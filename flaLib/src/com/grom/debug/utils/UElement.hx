package com.grom.debug.utils;
import utils.UMath;
import jsfl.Matrix;
import jsfl.Item;
import jsfl.Element;

class UElement
{
	static public function hasRotation(e:Element):Bool
	{
		return !Math.isNaN(e.rotation) && e.rotation != 0;
	}

	static public function getRotation(e:Element):Float
	{
		var rotation:Float = 0;
		if (hasRotation(e))
		{
			rotation = UMath.deg2rad(e.rotation);
		}
		return rotation;
	}

	static public function getSkew(e:Element):Vec2
	{
		var resX:Float = 0;
		var resY:Float = 0;
		if (!hasRotation(e))
		{
			resX = e.skewX;
			resY = e.skewY;
		}
		return new Vec2(resX, resY);
	}

	static public function itemIs(item:Item, types:Array<ItemType>):Bool
	{
		return types.indexOf(item.itemType) >= 0;
	}

	static public function computePivot(parentPos:Vec2, childTransform:Matrix):Vec2
	{
		var inv = UMatrix.inverse(childTransform);
		return UMatrix.applyToPoint(inv, parentPos);
	}

	static public function convertColor(color:String):String
	{
		return StringTools.replace(color, "#", "");
	}

/*	static public function computeMatrix(e:Element):Matrix
	{
		var m = UMatrix.identity();
		m = UMatrix.rotate(m, getRotation(e));
		return UMatrix.translate(m, e.left, e.top);
	}*/
}
