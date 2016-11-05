package com.grom.ui;
import jsfl.Flash;
import com.grom.debug.Log;
import com.grom.utils.UFlash;
import jsfl.Document;
import haxe.ds.StringMap;

/*
* http://blog.stroep.nl/2011/12/jsfl-dialog/
* http://www.flashguru.co.uk/communicating-between-actionscript-and-jsfl
* */

class BasePopup
{
	private var _result:Dynamic<String>;

	public function new(layoutURI:String, properties:StringMap<String> = null, doc:Document = null)
	{
		var popupFile = UFlash.getScriptURIPath() + "StartPopup.xml";
		Log.info("load popup xml: " + popupFile);
		if (doc == null)
		{
			doc = Flash.getDocumentDOM();
		}

		_result = doc.xmlPanel(popupFile);

		Log.info("popup result:");
		for (name in Reflect.fields(_result))
		{
			var value = Reflect.getProperty(_result, name);
			Log.info("prop: " + name + "=" + value);
		}
	}

	public function getDismiss():String
	{
		return _result.dismiss;
	}

	public function getResult():Dynamic<String>
	{
		return _result;
	}
}
