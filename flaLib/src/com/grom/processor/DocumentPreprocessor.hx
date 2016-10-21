package com.grom.processor;
import com.grom.utils.UElement;
import com.grom.debug.Log;
import jsfl.Layer;
import jsfl.Timeline;
import jsfl.SymbolItem;
import jsfl.Item.ItemType;
import jsfl.Document;

class DocumentPreprocessor
{
	private var _processors:Array<IDocPreprocessingStrategy> = [];
	private var _doc:Document;

	public function new(doc:Document)
	{
		_doc = doc;
	}

	public function process():Void
	{
		Log.info("****************************************************");
		Log.info(" Preprocessing document...");
		Log.info("****************************************************");

		for (p in _processors)
		{
			p.begin(_doc);
		}

		for (i in 0..._doc.timelines.length)
		{
			var tl = _doc.timelines[i];
			_doc.currentTimeline = i;
			processTimeline(tl);
		}

		for (item in _doc.library.items)
		{
			//Log.info("item: " + item.itemType);
			if (UElement.itemIs(item, [ItemType.Graphic, ItemType.MovieClip, ItemType.Button]))
			{
				var symbol:SymbolItem = cast item;
				_doc.library.editItem(item.name);
				processTimeline(symbol.timeline);
			}
		}

		for (p in _processors)
		{
			p.end();
		}

		Log.info("****************************************************");
		Log.info(" Preprocessing COMPLETED.");
		Log.info("****************************************************");
	}

	private function processTimeline(tl:Timeline):Void
	{
		Log.info("...preprocessing timeline: " + tl.name);

		for (p in _processors)
		{
			p.processTimeline(tl);
		}

		for (l in 0...tl.layerCount)
		{
			tl.currentLayer = l;

			var layer = tl.layers[l];
			var locked = layer.locked;
			var visible = layer.visible;
			layer.locked = false;
			layer.visible = true;

			processLayer(layer, tl);

			layer.locked = locked;
			layer.visible = visible;
		}
	}

	private function processLayer(l:Layer, tl:Timeline):Void
	{
		for (p in _processors)
		{
			p.processLayer(l);
		}

		for (f in 0...l.frameCount)
		{
			tl.currentFrame = f;
			var frame = l.frames[f];

			for (p in _processors)
			{
				p.processFrame(frame);
			}
		}
	}
}
