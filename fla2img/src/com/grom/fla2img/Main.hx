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
	static private inline var VERSION:String = "1.0.0";

	public function new()
	{
		Flash.outputPanel.clear();
		Log.info("fla2img version: " + VERSION);

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

		if (!StartPopup.show())
		{
			Log.info("fla2img dialog canceled");
			return;
		}

		var scale = Config.instance().getFloat("shapes_scale", 1);
		var selectedItems = !Config.instance().getBoolean("all_items");
		if (selectedItems && doc.library.getSelectedItems().length == 0)
		{
			UFlash.alert("Please select items from library!");
			return;
		}

		var processor:DocumentPreprocessor = new SelecteItemsDocPreprocessor(doc, selectedItems);
		processor.addPreprocessor(new BitmapConvertStrategy(scale));
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
