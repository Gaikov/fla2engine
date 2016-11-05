package com.grom.utils;
import com.grom.debug.Log;
import com.grom.settings.Config;
import jsfl.Flash;
import jsfl.FLfile;
import String;
import jsfl.Document;

class UFlash
{
    static public function alert(message:String):Void
    {
        untyped __js__('alert({0})', message);
    }

    static public function readConfig(doc:Document, appName:String):Void
    {
        if (doc.pathURI != null)
        {
            var configPath = StringTools.replace(doc.pathURI, ".fla", "." + appName + ".cfg");
            Config.instance().read(configPath);
        }
    }

    static public function pickOutputPath():String
    {
        var outPath:String = Config.instance().getString("output_path");
        Log.info(outPath);
        if (outPath == null || !FLfile.exists(outPath))
        {
            outPath = Flash.browseForFolderURL("Browse output folder");
            if (outPath != null)
            {
                Config.instance().setString("output_path", outPath);
                Config.instance().write();
            }
        }
        return outPath;
    }

    public static function getScriptURIPath():String
    {
        return Flash.scriptURI.substr(0, Flash.scriptURI.lastIndexOf("/")+1);
    }
}
