package com.grom.debug.utils;
import com.grom.debug.debug.Log;
import jsfl.Item.ItemType;
import jsfl.BitmapItem;
import jsfl.Document;

class UBitmap
{
    static public function createBitmap(doc:Document, name:String):BitmapItem
    {
        if (doc.library.itemExists(name))
        {
            if (!doc.library.deleteItem(name))
            {
                Log.error("Can't delete library item: " + name);
            }
        }

        if (!doc.library.addNewItem(ItemType.Bitmap, name))
        {
            Log.error("Can't create library bitmap: " + name);
            return null;
        }

        return cast UItem.findLibraryItem(doc, name);
    }
}
