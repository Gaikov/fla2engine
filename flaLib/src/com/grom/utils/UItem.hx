package com.grom.utils;
import jsfl.Document;
import jsfl.Item;

class UItem
{
    static public function findLibraryItem(doc:Document, name:String):Item
    {
        for (i in doc.library.items)
        {
            if (i.name == name)
            {
                return i;
            }
        }
        return null;
    }

}
