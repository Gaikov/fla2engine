package com.grom.fla2img;
import com.grom.debug.processor.IDocPreprocessingStrategy;

class BitmapConvertStrategy implements IDocPreprocessingStrategy
{
	private var _timeline:Timeline;
	private var _layer:Layer;

	public function new()
	{
	}

	public function begin(doc:Document):Void
	{
	}

	public function processTimeline(tl:Timeline):Void
	{
		_timeline = tl;
	}

	public function processLayer(l:Layer):Void
	{
		_layer = l;
	}

	public function processFrame(f:Frame):Void
	{

	}

	public function end():Void
	{
	}


}
