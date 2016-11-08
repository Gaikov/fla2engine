package com.grom.utils;

class ULibrary
{
    static public function getItemPath(fullName:String):String
    {
        var lastIndex = fullName.lastIndexOf("/");
        if (lastIndex >= 0)
        {
            return fullName.substr(0, lastIndex);
        }
        return null;
    }

    static public function getItemName(fullName:String):String
    {
        var lastIndex = fullName.lastIndexOf("/");
        if (lastIndex >= 0)
        {
            return fullName.substr(lastIndex + 1);
        }
        return null;
    }
}
