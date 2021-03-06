package com.grom.processor;
import jsfl.Layer;
import jsfl.Frame;
import jsfl.Timeline;
import jsfl.Document;

interface IDocPreprocessingStrategy
{
	function begin(doc:Document):Void;
	function processTimeline(tl:Timeline):Void;
	function processLayer(l:Layer, index:Int):Void;
	function processFrame(f:Frame, index:Int):Void;
	function end():Void;
}
