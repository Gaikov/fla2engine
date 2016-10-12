package com.grom.fla2engine.debug;
import com.grom.fla2engine.utils.UFlash;
class Log
{
    static public function info(message:String):Void
    {
        trace(message);
    }

    static public function warning(message:String):Void
    {
        info("WARNING: " + message);
    }

    static public function error(message:String):Void
    {
        info("ERROR: " + message);
        UFlash.alert(message);
    }

}
