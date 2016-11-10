package com.grom.fla2img;
import com.grom.debug.Log;
import jsfl.SymbolItem;
import jsfl.Item.ItemType;
import com.grom.utils.SelectDependecies;
import jsfl.Document;
import jsfl.Timeline;
import jsfl.Item;
import com.grom.processor.DocumentPreprocessor;

class SelecteItemsDocPreprocessor extends DocumentPreprocessor
{
	private var _selecteItems:Bool;

	public function new(doc:Document, selectedItems:Bool)
	{
		super(doc);
		_selecteItems = selectedItems;
	}

	override private function prepareTimelines():Array<Timeline>
	{
		if (_selecteItems)
		{
			Log.info("prepare selected dependencies...");
			var sd = new SelectDependecies(_doc.library.getSelectedItems(),
				[ItemType.MovieClip, ItemType.Graphic, ItemType.Button]);
			var items = sd.select();

			return items.map(function(item:Item):Timeline
			{
				var symbol:SymbolItem = cast item;
				return symbol.timeline;
			});
		}
		return super.prepareTimelines();
	}
}
