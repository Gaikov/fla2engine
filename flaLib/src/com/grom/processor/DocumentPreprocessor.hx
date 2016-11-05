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

	public function addPreprocessor(p:IDocPreprocessingStrategy):Void
	{
		_processors.push(p);
	}

	private function prepareTimelines():Array<Timeline>
	{
		var res = new Array<Timeline>();

		for (i in 0..._doc.timelines.length)
		{
			res.push(_doc.timelines[i]);
		}

		for (item in _doc.library.items)
		{
			if (UElement.itemIs(item, [ItemType.Graphic, ItemType.MovieClip, ItemType.Button]))
			{
				var symbol:SymbolItem = cast item;
				if (res.indexOf(symbol.timeline) < 0)
				{
					res.push(symbol.timeline);
				}
			}
		}

		return res;
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

		var timelines = prepareTimelines();

		for (tl in timelines)
		{
			if (tl.libraryItem != null)
			{
				_doc.library.editItem(tl.libraryItem.name);
			}
			else
			{
				_doc.currentTimeline = _doc.timelines.indexOf(tl);
			}
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

			processLayer(l, tl);

			layer.locked = locked;
			layer.visible = visible;
		}
	}

	private function processLayer(layerIndex:Int, tl:Timeline):Void
	{
		var l = tl.layers[layerIndex];

		for (p in _processors)
		{
			p.processLayer(l, layerIndex);
		}

		for (f in 0...l.frameCount)
		{
			tl.currentFrame = f;
			var frame = l.frames[f];

			for (p in _processors)
			{
				p.processFrame(frame, f);
			}
		}
	}
}
