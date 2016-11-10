(function (console, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = true;
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumIndex = function(e) {
	return e[1];
};
var com_grom_debug_Log = function() { };
com_grom_debug_Log.__name__ = true;
com_grom_debug_Log.info = function(message) {
	haxe_Log.trace(message,{ fileName : "Log.hx", lineNumber : 8, className : "com.grom.debug.Log", methodName : "info"});
};
com_grom_debug_Log.warning = function(message) {
	com_grom_debug_Log.info("WARNING: " + message);
};
com_grom_debug_Log.error = function(message) {
	com_grom_debug_Log.info("ERROR: " + message);
	com_grom_utils_UFlash.alert(message);
};
var com_grom_processor_IDocPreprocessingStrategy = function() { };
com_grom_processor_IDocPreprocessingStrategy.__name__ = true;
com_grom_processor_IDocPreprocessingStrategy.prototype = {
	__class__: com_grom_processor_IDocPreprocessingStrategy
};
var com_grom_fla2img_BitmapConvertStrategy = function(shapresRescale) {
	this._shapesRescale = shapresRescale;
	com_grom_debug_Log.info("shapes scale: " + shapresRescale);
};
com_grom_fla2img_BitmapConvertStrategy.__name__ = true;
com_grom_fla2img_BitmapConvertStrategy.__interfaces__ = [com_grom_processor_IDocPreprocessingStrategy];
com_grom_fla2img_BitmapConvertStrategy.prototype = {
	begin: function(doc) {
		this._doc = doc;
	}
	,processTimeline: function(tl) {
		com_grom_debug_Log.info("timeline to bitmap: " + tl.name);
		this._timeline = tl;
	}
	,processLayer: function(l,index) {
		this._layer = l;
		this._layerIndex = index;
	}
	,processFrame: function(f,frameIndex) {
		var index = 0;
		var shape = this.findNextShape(f);
		while(shape != null) {
			var fullName;
			fullName = "fla2img/" + (this._timeline.libraryItem != null?this._timeline.libraryItem.name:this._timeline.name);
			if(this._layerIndex > 0) fullName += "_l" + this._layerIndex;
			if(frameIndex > 0) fullName += "_f" + frameIndex;
			if(index > 0) fullName += "_e" + index;
			com_grom_debug_Log.info("converting to bitmap: " + fullName + ":" + Std.string(shape));
			this._doc.selectNone();
			shape.scaleX *= this._shapesRescale;
			shape.scaleY *= this._shapesRescale;
			this._doc.selection = [shape];
			this._doc.convertSelectionToBitmap();
			var converted = this._doc.selection[0];
			if(converted != null && converted.elementType == "instance") {
				com_grom_debug_Log.info("converted: " + Std.string(converted));
				var bi = converted;
				var folder = com_grom_utils_ULibrary.getItemPath(fullName);
				if(!this._doc.library.itemExists(folder)) this._doc.library.addNewItem("folder",folder);
				this._doc.library.moveToFolder(com_grom_utils_ULibrary.getItemPath(fullName),bi.libraryItem.name);
				this._doc.library.selectItem(bi.libraryItem.name);
				this._doc.library.renameItem(com_grom_utils_ULibrary.getItemName(fullName));
				index++;
			} else com_grom_debug_Log.warning("can't convert shape to bitmap: " + fullName);
			shape = this.findNextShape(f);
		}
	}
	,findNextShape: function(f) {
		var _g = 0;
		var _g1 = f.elements;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(e.elementType == "shape") return e;
		}
		return null;
	}
	,end: function() {
	}
	,__class__: com_grom_fla2img_BitmapConvertStrategy
};
var com_grom_fla2img_Main = function() {
	fl.outputPanel.clear();
	com_grom_debug_Log.info("fla2img version: " + "1.0.0");
	var doc = fl.getDocumentDOM();
	doc.save();
	com_grom_utils_UFlash.readConfig(doc,"fla2img");
	var outPath = com_grom_utils_UFlash.pickOutputPath();
	com_grom_debug_Log.info("output path picked: " + outPath);
	if(outPath == null) {
		com_grom_debug_Log.warning("output path is not selected");
		return;
	}
	if(!com_grom_fla2img_StartPopup.show()) {
		com_grom_debug_Log.info("fla2img dialog canceled");
		return;
	}
	var scale = com_grom_settings_Config.instance().getFloat("shapes_scale",1);
	var selectedItems = !com_grom_settings_Config.instance().getBoolean("all_items");
	if(selectedItems && doc.library.getSelectedItems().length == 0) {
		com_grom_utils_UFlash.alert("Please select items from library!");
		return;
	}
	var processor = new com_grom_fla2img_SelecteItemsDocPreprocessor(doc,selectedItems);
	processor.addPreprocessor(new com_grom_fla2img_BitmapConvertStrategy(scale));
	processor.process();
	var _g = 0;
	var _g1 = doc.library.items;
	while(_g < _g1.length) {
		var item = _g1[_g];
		++_g;
		if(item.itemType == "bitmap") {
			var bm = item;
			var outFileName = outPath + "/" + bm.name;
			if(outFileName.indexOf(".") < 0) outFileName += ".png";
			com_grom_debug_Log.info("exporting bitmap: " + outFileName);
			var path = com_grom_utils_ULibrary.getItemPath(outFileName);
			if(!FLfile.exists(path)) FLfile.createFolder(path);
			if(!bm.exportToFile(outFileName)) com_grom_debug_Log.warning("can't save bitmap: " + outFileName);
		}
	}
	com_grom_settings_Config.instance().write();
	doc.revert();
};
com_grom_fla2img_Main.__name__ = true;
com_grom_fla2img_Main.main = function() {
	new com_grom_fla2img_Main();
};
com_grom_fla2img_Main.prototype = {
	__class__: com_grom_fla2img_Main
};
var com_grom_processor_DocumentPreprocessor = function(doc) {
	this._processors = [];
	this._doc = doc;
};
com_grom_processor_DocumentPreprocessor.__name__ = true;
com_grom_processor_DocumentPreprocessor.prototype = {
	addPreprocessor: function(p) {
		this._processors.push(p);
	}
	,prepareTimelines: function() {
		var res = [];
		var _g1 = 0;
		var _g = this._doc.timelines.length;
		while(_g1 < _g) {
			var i = _g1++;
			res.push(this._doc.timelines[i]);
		}
		var _g2 = 0;
		var _g11 = this._doc.library.items;
		while(_g2 < _g11.length) {
			var item = _g11[_g2];
			++_g2;
			if(com_grom_utils_UElement.itemIs(item,["graphic","movie clip","button"])) {
				var symbol = item;
				if(HxOverrides.indexOf(res,symbol.timeline,0) < 0) res.push(symbol.timeline);
			}
		}
		return res;
	}
	,process: function() {
		com_grom_debug_Log.info("****************************************************");
		com_grom_debug_Log.info(" Preprocessing document...");
		com_grom_debug_Log.info("****************************************************");
		var _g = 0;
		var _g1 = this._processors;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.begin(this._doc);
		}
		var timelines = this.prepareTimelines();
		var _g2 = 0;
		while(_g2 < timelines.length) {
			var tl = timelines[_g2];
			++_g2;
			if(tl.libraryItem != null) this._doc.library.editItem(tl.libraryItem.name); else this._doc.currentTimeline = HxOverrides.indexOf(this._doc.timelines,tl,0);
			this.processTimeline(tl);
		}
		var _g3 = 0;
		var _g11 = this._processors;
		while(_g3 < _g11.length) {
			var p1 = _g11[_g3];
			++_g3;
			p1.end();
		}
		com_grom_debug_Log.info("****************************************************");
		com_grom_debug_Log.info(" Preprocessing COMPLETED.");
		com_grom_debug_Log.info("****************************************************");
	}
	,processTimeline: function(tl) {
		com_grom_debug_Log.info("...preprocessing timeline: " + tl.name);
		var _g = 0;
		var _g1 = this._processors;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.processTimeline(tl);
		}
		var _g11 = 0;
		var _g2 = tl.layerCount;
		while(_g11 < _g2) {
			var l = _g11++;
			tl.currentLayer = l;
			var layer = tl.layers[l];
			var locked = layer.locked;
			var visible = layer.visible;
			layer.locked = false;
			layer.visible = true;
			this.processLayer(l,tl);
			layer.locked = locked;
			layer.visible = visible;
		}
	}
	,processLayer: function(layerIndex,tl) {
		var l = tl.layers[layerIndex];
		var _g = 0;
		var _g1 = this._processors;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.processLayer(l,layerIndex);
		}
		var _g11 = 0;
		var _g2 = l.frameCount;
		while(_g11 < _g2) {
			var f = _g11++;
			tl.currentFrame = f;
			var frame = l.frames[f];
			var _g21 = 0;
			var _g3 = this._processors;
			while(_g21 < _g3.length) {
				var p1 = _g3[_g21];
				++_g21;
				p1.processFrame(frame,f);
			}
		}
	}
	,__class__: com_grom_processor_DocumentPreprocessor
};
var com_grom_fla2img_SelecteItemsDocPreprocessor = function(doc,selectedItems) {
	com_grom_processor_DocumentPreprocessor.call(this,doc);
	this._selecteItems = selectedItems;
};
com_grom_fla2img_SelecteItemsDocPreprocessor.__name__ = true;
com_grom_fla2img_SelecteItemsDocPreprocessor.__super__ = com_grom_processor_DocumentPreprocessor;
com_grom_fla2img_SelecteItemsDocPreprocessor.prototype = $extend(com_grom_processor_DocumentPreprocessor.prototype,{
	prepareTimelines: function() {
		if(this._selecteItems) {
			com_grom_debug_Log.info("prepare selected dependencies...");
			var sd = new com_grom_utils_SelectDependecies(this._doc.library.getSelectedItems(),["movie clip","graphic","button"]);
			var items = sd.select();
			return items.map(function(item) {
				var symbol = item;
				return symbol.timeline;
			});
		}
		return com_grom_processor_DocumentPreprocessor.prototype.prepareTimelines.call(this);
	}
	,__class__: com_grom_fla2img_SelecteItemsDocPreprocessor
});
var com_grom_ui_BasePopup = function(layoutURI,properties,doc) {
	var popupFile = com_grom_utils_UFlash.getScriptURIPath() + "StartPopup.xml";
	com_grom_debug_Log.info("load popup xml: " + popupFile);
	if(doc == null) doc = fl.getDocumentDOM();
	this._result = doc.xmlPanel(popupFile);
	com_grom_debug_Log.info("popup result:");
	var _g = 0;
	var _g1 = Reflect.fields(this._result);
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var value = Reflect.getProperty(this._result,name);
		com_grom_debug_Log.info("prop: " + name + "=" + value);
	}
};
com_grom_ui_BasePopup.__name__ = true;
com_grom_ui_BasePopup.prototype = {
	getDismiss: function() {
		return this._result.dismiss;
	}
	,getResult: function() {
		return this._result;
	}
	,__class__: com_grom_ui_BasePopup
};
var com_grom_fla2img_StartPopup = function() {
	com_grom_ui_BasePopup.call(this,"StartPopup.xml",null,fl.getDocumentDOM());
	if(this.getDismiss() == "accept") {
		var config = com_grom_settings_Config.instance();
		config.setFloat("shapes_scale",Std.parseFloat(this.getResult().scale));
		config.setBoolean("all_items",Std.string(this.getResult().imagesGroup) == "all");
		config.write();
	}
};
com_grom_fla2img_StartPopup.__name__ = true;
com_grom_fla2img_StartPopup.show = function() {
	var popup = new com_grom_fla2img_StartPopup();
	return popup.getDismiss() == "accept";
};
com_grom_fla2img_StartPopup.__super__ = com_grom_ui_BasePopup;
com_grom_fla2img_StartPopup.prototype = $extend(com_grom_ui_BasePopup.prototype,{
	__class__: com_grom_fla2img_StartPopup
});
var com_grom_settings_Config = function() {
	this._vars = new haxe_ds_StringMap();
};
com_grom_settings_Config.__name__ = true;
com_grom_settings_Config.instance = function() {
	if(com_grom_settings_Config._instance == null) com_grom_settings_Config._instance = new com_grom_settings_Config();
	return com_grom_settings_Config._instance;
};
com_grom_settings_Config.prototype = {
	read: function(fileName) {
		this._fileName = fileName;
		com_grom_debug_Log.info("read config: " + fileName);
		if(FLfile.exists(fileName)) {
			var data = FLfile.read(fileName);
			var json = new haxe_format_JsonParser(data).parseRec();
			var fields = Reflect.fields(json);
			var _g = 0;
			while(_g < fields.length) {
				var name = fields[_g];
				++_g;
				this.setString(name,Reflect.getProperty(json,name));
			}
		} else com_grom_debug_Log.info("config not found: " + fileName);
	}
	,write: function() {
		if(this._fileName == null) {
			com_grom_debug_Log.warning("can't save config, filename is not specified!");
			return;
		}
		var res = { };
		var $it0 = this._vars.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			Reflect.setField(res,name,this._vars.get(name));
		}
		var data = haxe_format_JsonPrinter.print(res,null,"\t");
		com_grom_debug_Log.info("write config: " + this._fileName);
		com_grom_debug_Log.info(data);
		if(!FLfile.write(this._fileName,data)) com_grom_debug_Log.warning("Can't save config: " + this._fileName);
	}
	,getString: function(name) {
		if(this._vars.exists(name)) return this._vars.get(name);
		return null;
	}
	,setString: function(name,value) {
		this._vars.set(name,value);
	}
	,getFloat: function(name,defValue) {
		var value = defValue;
		var str = this.getString(name);
		if(str == null) this.setFloat(name,defValue); else value = parseFloat(str);
		return value;
	}
	,setFloat: function(name,value) {
		this.setString(name,value == null?"null":"" + value);
	}
	,setBoolean: function(name,value) {
		this.setString(name,value?"true":"false");
	}
	,getBoolean: function(name) {
		return this.getString(name) == "true";
	}
	,__class__: com_grom_settings_Config
};
var com_grom_ui_PopupResult = function() { };
com_grom_ui_PopupResult.__name__ = true;
var com_grom_utils_SelectDependecies = function(items,processItemTypes) {
	this._dependentis = [];
	this._selectedItems = items;
	this._itemTypes = processItemTypes;
};
com_grom_utils_SelectDependecies.__name__ = true;
com_grom_utils_SelectDependecies.prototype = {
	select: function() {
		var _g = 0;
		var _g1 = this._selectedItems;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			this.processItem(i);
		}
		return this._dependentis;
	}
	,processItem: function(item) {
		if(com_grom_utils_UElement.itemIs(item,this._itemTypes)) {
			var symbol = item;
			if(HxOverrides.indexOf(this._dependentis,symbol,0) < 0) {
				com_grom_debug_Log.info("...depenency selected: " + symbol.name);
				this._dependentis.push(symbol);
				this.processTimeline(symbol.timeline);
			}
		}
	}
	,processTimeline: function(tl) {
		var _g = 0;
		var _g1 = tl.layers;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			var _g2 = 0;
			var _g3 = l.frames;
			while(_g2 < _g3.length) {
				var f = _g3[_g2];
				++_g2;
				var _g4 = 0;
				var _g5 = f.elements;
				while(_g4 < _g5.length) {
					var e = _g5[_g4];
					++_g4;
					if(e.elementType == "instance") {
						var instance = e;
						if(instance.instanceType == "symbol") this.processItem(instance.libraryItem);
					}
				}
			}
		}
	}
	,__class__: com_grom_utils_SelectDependecies
};
var com_grom_utils_UElement = function() { };
com_grom_utils_UElement.__name__ = true;
com_grom_utils_UElement.hasRotation = function(e) {
	return !isNaN(e.rotation) && e.rotation != 0;
};
com_grom_utils_UElement.getRotation = function(e) {
	var rotation = 0;
	if(com_grom_utils_UElement.hasRotation(e)) rotation = com_grom_utils_UMath.deg2rad(e.rotation);
	return rotation;
};
com_grom_utils_UElement.getSkew = function(e) {
	var resX = 0;
	var resY = 0;
	if(!com_grom_utils_UElement.hasRotation(e)) {
		resX = e.skewX;
		resY = e.skewY;
	}
	return new com_grom_utils_Vec2(resX,resY);
};
com_grom_utils_UElement.itemIs = function(item,types) {
	return HxOverrides.indexOf(types,item.itemType,0) >= 0;
};
var com_grom_utils_UFlash = function() { };
com_grom_utils_UFlash.__name__ = true;
com_grom_utils_UFlash.alert = function(message) {
	alert(message);
};
com_grom_utils_UFlash.readConfig = function(doc,appName) {
	if(doc.pathURI != null) {
		var configPath = StringTools.replace(doc.pathURI,".fla","." + appName + ".cfg");
		com_grom_settings_Config.instance().read(configPath);
	}
};
com_grom_utils_UFlash.pickOutputPath = function() {
	var outPath = com_grom_settings_Config.instance().getString("output_path");
	com_grom_debug_Log.info(outPath);
	if(outPath == null || !FLfile.exists(outPath)) {
		outPath = fl.browseForFolderURL("Browse output folder");
		if(outPath != null) {
			com_grom_settings_Config.instance().setString("output_path",outPath);
			com_grom_settings_Config.instance().write();
		}
	}
	return outPath;
};
com_grom_utils_UFlash.getScriptURIPath = function() {
	var len = fl.scriptURI.lastIndexOf("/") + 1;
	return HxOverrides.substr(fl.scriptURI,0,len);
};
var com_grom_utils_ULibrary = function() { };
com_grom_utils_ULibrary.__name__ = true;
com_grom_utils_ULibrary.getItemPath = function(fullName) {
	var lastIndex = fullName.lastIndexOf("/");
	if(lastIndex >= 0) return HxOverrides.substr(fullName,0,lastIndex);
	return null;
};
com_grom_utils_ULibrary.getItemName = function(fullName) {
	var lastIndex = fullName.lastIndexOf("/");
	if(lastIndex >= 0) return HxOverrides.substr(fullName,lastIndex + 1,null);
	return null;
};
var com_grom_utils_UMath = function() { };
com_grom_utils_UMath.__name__ = true;
com_grom_utils_UMath.deg2rad = function(deg) {
	return deg * Math.PI / 180.0;
};
com_grom_utils_UMath.vec2str = function(v) {
	return "[ " + v.x + " , " + v.y + " ]";
};
var com_grom_utils_Vec2 = function(ix,iy) {
	this.x = ix;
	this.y = iy;
};
com_grom_utils_Vec2.__name__ = true;
com_grom_utils_Vec2.prototype = {
	__class__: com_grom_utils_Vec2
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_format_JsonParser = function(str) {
	this.str = str;
	this.pos = 0;
};
haxe_format_JsonParser.__name__ = true;
haxe_format_JsonParser.prototype = {
	parseRec: function() {
		while(true) {
			var c = StringTools.fastCodeAt(this.str,this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { };
				var field = null;
				var comma = null;
				while(true) {
					var c1 = StringTools.fastCodeAt(this.str,this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						Reflect.setField(obj,field,this.parseRec());
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [];
				var comma1 = null;
				while(true) {
					var c2 = StringTools.fastCodeAt(this.str,this.pos++);
					switch(c2) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma1 == false) this.invalidChar();
						return arr;
					case 44:
						if(comma1) comma1 = false; else this.invalidChar();
						break;
					default:
						if(comma1) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma1 = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(StringTools.fastCodeAt(this.str,this.pos++) != 114 || StringTools.fastCodeAt(this.str,this.pos++) != 117 || StringTools.fastCodeAt(this.str,this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save1 = this.pos;
				if(StringTools.fastCodeAt(this.str,this.pos++) != 97 || StringTools.fastCodeAt(this.str,this.pos++) != 108 || StringTools.fastCodeAt(this.str,this.pos++) != 115 || StringTools.fastCodeAt(this.str,this.pos++) != 101) {
					this.pos = save1;
					this.invalidChar();
				}
				return false;
			case 110:
				var save2 = this.pos;
				if(StringTools.fastCodeAt(this.str,this.pos++) != 117 || StringTools.fastCodeAt(this.str,this.pos++) != 108 || StringTools.fastCodeAt(this.str,this.pos++) != 108) {
					this.pos = save2;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,parseString: function() {
		var start = this.pos;
		var buf = null;
		while(true) {
			var c = StringTools.fastCodeAt(this.str,this.pos++);
			if(c == 34) break;
			if(c == 92) {
				if(buf == null) buf = new StringBuf();
				buf.addSub(this.str,start,this.pos - start - 1);
				c = StringTools.fastCodeAt(this.str,this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "\x08";
					break;
				case 102:
					buf.b += "\x0C";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw new js__$Boot_HaxeError("Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1));
				}
				start = this.pos;
			} else if(c != c) throw new js__$Boot_HaxeError("Unclosed string");
		}
		if(buf == null) return HxOverrides.substr(this.str,start,this.pos - start - 1); else {
			buf.addSub(this.str,start,this.pos - start - 1);
			return buf.b;
		}
	}
	,parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45;
		var digit = !minus;
		var zero = c == 48;
		var point = false;
		var e = false;
		var pm = false;
		var end = false;
		while(true) {
			c = StringTools.fastCodeAt(this.str,this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		if(i == f) return i; else return f;
	}
	,invalidChar: function() {
		this.pos--;
		throw new js__$Boot_HaxeError("Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos);
	}
	,invalidNumber: function(start) {
		throw new js__$Boot_HaxeError("Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start));
	}
	,__class__: haxe_format_JsonParser
};
var haxe_format_JsonPrinter = function(replacer,space) {
	this.replacer = replacer;
	this.indent = space;
	this.pretty = space != null;
	this.nind = 0;
	this.buf = new StringBuf();
};
haxe_format_JsonPrinter.__name__ = true;
haxe_format_JsonPrinter.print = function(o,replacer,space) {
	var printer = new haxe_format_JsonPrinter(replacer,space);
	printer.write("",o);
	return printer.buf.b;
};
haxe_format_JsonPrinter.prototype = {
	ipad: function() {
		if(this.pretty) {
			var v = StringTools.lpad("",this.indent,this.nind * this.indent.length);
			if(v == null) this.buf.b += "null"; else this.buf.b += "" + v;
		}
	}
	,write: function(k,v) {
		if(this.replacer != null) v = this.replacer(k,v);
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 8:
				this.buf.b += "\"???\"";
				break;
			case 4:
				this.fieldsString(v,Reflect.fields(v));
				break;
			case 1:
				var v1 = v;
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2;
				if((function($this) {
					var $r;
					var f = v;
					$r = isFinite(f);
					return $r;
				}(this))) v2 = v; else v2 = "null";
				if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				break;
			case 5:
				this.buf.b += "\"<fun>\"";
				break;
			case 6:
				var c = _g[2];
				if(c == String) this.quote(v); else if(c == Array) {
					var v3 = v;
					this.buf.b += "[";
					var len = v3.length;
					var last = len - 1;
					var _g1 = 0;
					while(_g1 < len) {
						var i = _g1++;
						if(i > 0) this.buf.b += ","; else this.nind++;
						if(this.pretty) this.buf.b += "\n";
						this.ipad();
						this.write(i,v3[i]);
						if(i == last) {
							this.nind--;
							if(this.pretty) this.buf.b += "\n";
							this.ipad();
						}
					}
					this.buf.b += "]";
				} else if(c == haxe_ds_StringMap) {
					var v4 = v;
					var o = { };
					var $it0 = v4.keys();
					while( $it0.hasNext() ) {
						var k1 = $it0.next();
						Reflect.setField(o,k1,__map_reserved[k1] != null?v4.getReserved(k1):v4.h[k1]);
					}
					this.fieldsString(o,Reflect.fields(o));
				} else if(c == Date) {
					var v5 = v;
					this.quote(HxOverrides.dateStr(v5));
				} else this.fieldsString(v,Reflect.fields(v));
				break;
			case 7:
				var i1 = Type.enumIndex(v);
				var v6 = i1;
				if(v6 == null) this.buf.b += "null"; else this.buf.b += "" + v6;
				break;
			case 3:
				var v7 = v;
				if(v7 == null) this.buf.b += "null"; else this.buf.b += "" + v7;
				break;
			case 0:
				this.buf.b += "null";
				break;
			}
		}
	}
	,fieldsString: function(v,fields) {
		this.buf.b += "{";
		var len = fields.length;
		var last = len - 1;
		var first = true;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var f = fields[i];
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) {
				this.nind++;
				first = false;
			} else this.buf.b += ",";
			if(this.pretty) this.buf.b += "\n";
			this.ipad();
			this.quote(f);
			this.buf.b += ":";
			if(this.pretty) this.buf.b += " ";
			this.write(f,value);
			if(i == last) {
				this.nind--;
				if(this.pretty) this.buf.b += "\n";
				this.ipad();
			}
		}
		this.buf.b += "}";
	}
	,quote: function(s) {
		this.buf.b += "\"";
		var i = 0;
		while(true) {
			var c = StringTools.fastCodeAt(s,i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += "\\\"";
				break;
			case 92:
				this.buf.b += "\\\\";
				break;
			case 10:
				this.buf.b += "\\n";
				break;
			case 13:
				this.buf.b += "\\r";
				break;
			case 9:
				this.buf.b += "\\t";
				break;
			case 8:
				this.buf.b += "\\b";
				break;
			case 12:
				this.buf.b += "\\f";
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += "\"";
	}
	,__class__: haxe_format_JsonPrinter
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	fl.trace(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
var __map_reserved = {}
haxe_Log.trace = function(v,infos) {
	fl.trace(v);
};
com_grom_fla2img_Main.VERSION = "1.0.0";
com_grom_ui_PopupResult.ACCEPT = "accept";
com_grom_ui_PopupResult.CANCEL = "cancel";
js_Boot.__toStr = {}.toString;
com_grom_fla2img_Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
