package com.grom.fla2img;
import com.grom.settings.Config;
import com.grom.ui.PopupResult;
import com.grom.ui.BasePopup;
import jsfl.Flash;

class StartPopup extends BasePopup
{
	public function new()
	{
		super("start_popup", null, Flash.getDocumentDOM());

		if (getDismiss() == PopupResult.ACCEPT)
		{
			var config = Config.instance();
			config.setFloat("shapes_scale", Std.parseFloat(getResult().scale));
			config.setBoolean("all_items", Std.string(getResult().imagesGroup) == "all");
			config.write();
		}
	}

	override private function initLayoutValues():Void
	{
		var config = Config.instance();
		setControlValue("shapes_scale", Std.string(config.getFloat("shapes_scale", 1)));

/*		if (config.getBoolean("all_items"))
		{
			setRadioSelected("check_all");
		}
		else
		{
			setRadioSelected("check_selected");
		}*/
	}

	public static function show():Bool
	{
		var popup = new StartPopup();
		return popup.getDismiss() == PopupResult.ACCEPT;
	}
}
