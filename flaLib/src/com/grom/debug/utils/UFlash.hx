package com.grom.debug.utils;
class UFlash
{
    static public function alert(message:String):Void
    {
        untyped __js__('alert({0})', message);
    }
}
