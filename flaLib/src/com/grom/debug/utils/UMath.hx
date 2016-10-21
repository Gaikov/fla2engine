package com.grom.debug.utils;

class UMath
{
	static public function deg2rad(deg:Float):Float
	{
		return deg * Math.PI / 180.0;
	}

	static public function vec2str(v:Vec2):String
	{
		return "[ " + v.x + " , " + v.y + " ]";
	}
}
