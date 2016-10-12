package com.grom.fla2engine;

import com.grom.fla2engine.utils.UBitmap;
import jsfl.Flash;

class Main
{
    public function new()
    {
        Flash.outputPanel.clear();

        var doc = Flash.getDocumentDOM();

        var bitmap = UBitmap.createBitmap(doc, "__test_item");

        //doc.addItem()
    }

    public static function main():Void
    {
        new Main();
    }
}
