package com.grom.utils;

import com.grom.debug.Log;
import jsfl.Instance.InstanceType;
import jsfl.SymbolInstance;
import jsfl.Element.ElementType;
import jsfl.Timeline;
import jsfl.SymbolItem;
import jsfl.Item;

class SelectDependecies
{
	private var _dependentis:Array<Item> = [];
	private var _selectedItems:Array<Item>;
	private var _itemTypes:Array<ItemType>;

	public function new(items:Array<Item>, processItemTypes:Array<ItemType>)
	{
		_selectedItems = items;
		_itemTypes = processItemTypes;
	}

	public function select():Array<Item>
	{
		for (i in _selectedItems)
		{
			processItem(i);
		}
		return _dependentis;
	}

	private function processItem(item:Item):Void
	{
		if (UElement.itemIs(item, _itemTypes))
		{
			var symbol:SymbolItem = cast item;
			if (_dependentis.indexOf(symbol) < 0)
			{
				Log.info("...depenency selected: " + symbol.name);
				_dependentis.push(symbol);
				processTimeline(symbol.timeline);
			}
		}
	}

	private function processTimeline(tl:Timeline):Void
	{
		for (l in tl.layers)
		{
			for (f in l.frames)
			{
				for (e in f.elements)
				{
					if (e.elementType == ElementType.Instance)
					{
						var instance:SymbolInstance = cast e;
						if (instance.instanceType == InstanceType.Symbol)
						{
							processItem(instance.libraryItem);
						}
					}
				}
			}
		}
	}
}
