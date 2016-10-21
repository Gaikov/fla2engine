package com.grom.debug.settings;
import haxe.ds.StringMap;
import haxe.Json;
import jsfl.FLfile;

import com.grom.debug.debug.Log;

class Config
{
	static private var _instance:Config;

	private var _vars:StringMap<String> = new StringMap();
	private var _fileName:String;

	public function new()
	{
	}

	public function read(fileName:String):Void
	{
		_fileName = fileName;
		Log.info("read config: " + fileName);
		if (FLfile.exists(fileName))
		{
			var data = FLfile.read(fileName);

			var json = Json.parse(data);

			var fields = Reflect.fields(json);
			for (name in fields)
			{
				setString(name, Reflect.getProperty(json, name));
			}
		}
		else
		{
			Log.info("config not found: " + fileName);
		}
	}

	public function write():Void
	{
		if (_fileName == null)
		{
			Log.warning("can't save config, filename is not specified!");
			return;
		}

		var res:Dynamic = {};
		for (name in _vars.keys())
		{
			Reflect.setField(res, name, _vars.get(name));
		}

		var data:String = Json.stringify(res);
		Log.info(data);

		Log.info("write config: " + _fileName);
		if (!FLfile.write(_fileName, data))
		{
			Log.warning("Can't save config: " + _fileName);
		}
	}

	static public function instance():Config
	{
		if (_instance == null)
		{
			_instance = new Config();
		}
		return _instance;
	}

	public function getString(name:String):String
	{
		if (_vars.exists(name))
		{
			return _vars.get(name);
		}
		return null;
	}

	public function setString(name:String, value:String):Void
	{
		_vars.set(name, value);
	}
}
