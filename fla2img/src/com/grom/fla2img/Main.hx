package com.grom.fla2img;
import com.grom.debug.settings.Config;
import com.grom.debug.debug.Log;
import com.grom.debug.utils.UFlash;
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





		Config.instance().write();
		doc.revert();
	}

	static public function main():Void
	{
		new Main();
	}
}
