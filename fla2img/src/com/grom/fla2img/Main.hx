package com.grom.fla2img;
import jsfl.FLfile;
import com.grom.utils.ULibrary;
import jsfl.BitmapItem;
import jsfl.Item.ItemType;
import com.grom.processor.DocumentPreprocessor;
import com.grom.settings.Config;
import com.grom.debug.Log;
import com.grom.utils.UFlash;
import jsfl.Flash;

class Main
{
	public function new()
	{
		Flash.outputPanel.clear();

		var doc = Flash.getDocumentDOM();
		doc.save();
		UFlash.readConfig(doc, "fla2img");

		var outPath = UFlash.pickOutputPath();
		Log.info("output path picked: " + outPath);
		if (outPath == null)
		{
			Log.warning("output path is not selected");
			return;
		}

		var processor:DocumentPreprocessor = new DocumentPreprocessor(doc);
		processor.addPreprocessor(new BitmapConvertStrategy());
		processor.process();

		for (item in doc.library.items)
		{
			if (item.itemType == ItemType.Bitmap)
			{
				var bm:BitmapItem = cast item;
				var outFileName:String = outPath + "/" + bm.name;
				if (outFileName.indexOf(".") < 0)
				{
					outFileName += ".png";
				}

				Log.info("exporting bitmap: " + outFileName);

				var path = ULibrary.getItemPath(outFileName);
				if (!FLfile.exists(path))
				{
					FLfile.createFolder(path);
				}

				if (!bm.exportToFile(outFileName))
				{
					Log.warning("can't save bitmap: " + outFileName);
				}
			}
		}

		Config.instance().write();
		doc.revert();
	}

	static public function main():Void
	{
		new Main();
	}
}
