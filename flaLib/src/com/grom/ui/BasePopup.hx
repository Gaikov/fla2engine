package com.grom.ui;
import jsfl.FLfile;
import String;
import haxe.Resource;
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
	private var _layout:String;

	public function new(layoutResource:String, properties:StringMap<String> = null, doc:Document = null)
	{
		_layout = Resource.getString(layoutResource);

		initLayoutValues();

		var match = ~/#\{.*}/g;
		_layout = match.replace(_layout, "");

		var tmpFileName:String = UFlash.getScriptURIPath() + "/" + layoutResource + ".tmp";
		FLfile.write(tmpFileName, _layout);

		Log.info("load popup xml: " + tmpFileName);
		if (doc == null)
		{
			doc = Flash.getDocumentDOM();
		}

		_result = doc.xmlPanel(tmpFileName);
		FLfile.remove(tmpFileName);

		Log.info("popup result:");
		for (name in Reflect.fields(_result))
		{
			var value = Reflect.getProperty(_result, name);
			Log.info("prop: " + name + "=" + value);
		}
	}

	private function initLayoutValues():Void
	{

	}

	public function setControlValue(name:String, value:String):Void
	{
		_layout = StringTools.replace(_layout, "#{" + name + "}", value);
	}

/*	public function setRadioSelected(name:String):Void
	{
		setControlValue(name, "selected=\"true\"");
	}*/

	public function getDismiss():String
	{
		return _result.dismiss;
	}

	public function getResult():Dynamic<String>
	{
		return _result;
	}
}
