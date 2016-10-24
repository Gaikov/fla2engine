package com.grom.fla2img;
import jsfl.Item.ItemType;
import com.grom.utils.ULibrary;
import jsfl.BitmapInstance;
import jsfl.Element;
import jsfl.Shape;
import com.grom.debug.Log;
import com.grom.processor.IDocPreprocessingStrategy;
import jsfl.Frame;
import jsfl.Document;
import jsfl.Layer;
import jsfl.Timeline;

class BitmapConvertStrategy implements IDocPreprocessingStrategy
{
	private var _timeline:Timeline;
	private var _layer:Layer;
	private var _layerIndex:Int;
	private var _doc:Document;
	private var _shapesRescale:Float;

	public function new(shapresRescale:Float)
	{
		_shapesRescale = shapresRescale;
	}

	public function begin(doc:Document):Void
	{
		_doc = doc;
	}

	public function processTimeline(tl:Timeline):Void
	{
		Log.info("timeline to bitmap: " + tl.name);
		_timeline = tl;
	}

	public function processLayer(l:Layer, index:Int):Void
	{
		_layer = l;
		_layerIndex = index;
	}

	public function processFrame(f:Frame, frameIndex:Int):Void
	{
		var index = 0;
		var shape = findNextShape(f);

		while (shape != null)
		{
			var fullName = "fla2img/" + (_timeline.libraryItem != null ? _timeline.libraryItem.name : _timeline.name);
			if (_layerIndex > 0)
			{
				fullName += "_l" + _layerIndex;
			}
			if (frameIndex > 0)
			{
				fullName += "_f" + frameIndex;
			}
			if (index > 0)
			{
				fullName += "_e" + index;
			}

			Log.info("converting to bitmap: " + fullName + ":" + shape);
			_doc.selectNone();
			shape.scaleX *= _shapesRescale;
			shape.scaleY *= _shapesRescale;
			_doc.selection = [shape];
			_doc.convertSelectionToBitmap();

			var converted:Element = _doc.selection[0];
			if (converted != null && converted.elementType == ElementType.Instance)
			{
				Log.info("converted: " + converted);
				var bi:BitmapInstance = cast converted;

				var folder = ULibrary.getItemPath(fullName);
				if (!_doc.library.itemExists(folder))
				{
					_doc.library.addNewItem(ItemType.Folder, folder);
				}
				_doc.library.moveToFolder(ULibrary.getItemPath(fullName), bi.libraryItem.name);
				_doc.library.selectItem(bi.libraryItem.name);
				_doc.library.renameItem(ULibrary.getItemName(fullName));
				index++;
			}
			else
			{
				Log.warning("can't convert shape to bitmap: " + fullName);
			}

			shape = findNextShape(f);
		}
	}

	private function findNextShape(f:Frame):Shape
	{
		for (e in f.elements)
		{
			if (e.elementType == ElementType.Shape)
			{
				return cast e;
			}
		}
		return null;
	}

	public function end():Void
	{
	}


}
