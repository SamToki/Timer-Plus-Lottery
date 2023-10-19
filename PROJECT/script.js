// For SamToki.github.io/Timer+Lottery

// Initialization
	// Declare Variables
	"use strict";
		// Unsaved
		var Elements, Looper = 0, Percentage = 0,
		Automation = {
			ClockTimer, TimeSeparatorBlink, LotteryRoller
		};
		
		// Saved
		var Timer = {
			Duration: 300000, Preset: [0, 300000, 900000, 3600000],
			UseCountdown: true,
			IsRunning: false, IsPaused: false,
			ClockTime: 0, StartTime: 0, EndTime: 0,
			CurrentTime: 300000, Display: [0, 0, 0, 5, 0, 0, 0],
			Lap: {
				Sequence: 1, PreviousCurrentTime: 300000
			}
		},
		Lottery = {
			Mode: "Normal",
			Range: {
				Min: 1, Max: 50
			},
			PreventDuplication: true,
			Number: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			Progress: 0
		};

	// Load Configuration
	window.onload = function() {
		if(localStorage.System) {
			System = JSON.parse(localStorage.getItem("System"));
		} else {
			System.I18n.Language = "zh-CN";
		}
		switch(System.I18n.Language) {
			case "zh-CN":
				// window.location.replace("index.html");
				break;
			case "en-US":
				PopupDialogAppear("System_LanguageUnsupported",
					"Termination",
					"<span lang='en-US'>Sorry, this page currently does not support English (US).</span>",
					"<span lang='en-US'>OK</span>", "", "");
				break;
			case "ja-JP":
				PopupDialogAppear("System_LanguageUnsupported",
					"Termination",
					"<span lang='ja-JP'>すみません。このページは日本語にまだサポートしていません。</span>",
					"<span lang='ja-JP'>OK</span>", "", "");
				break;
			case "zh-TW":
				PopupDialogAppear("System_LanguageUnsupported",
					"Termination",
					"<span lang='zh-TW'>抱歉，本頁面暫不支援繁體中文。</span>",
					"<span lang='zh-TW'>確定</span>", "", "");
				break;
			default:
				alert("【系统错误】\n函数「SetI18nLanguage」的参数「System.I18n.Language」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
				break;
		}
		RefreshSystem();
		if(localStorage.TimerPlusLottery_Timer) {
			Timer = JSON.parse(localStorage.getItem("TimerPlusLottery_Timer"));
		}
		RefreshTimer();
		if(localStorage.TimerPlusLottery_Lottery) {
			Lottery = JSON.parse(localStorage.getItem("TimerPlusLottery_Lottery"));
		}
		RefreshLottery();
	};

// Refresh
	// System
	function RefreshSystem() {
		// Settings
			// Display
			ChangeValue("Combobox_SettingsDisplayTheme", System.Display.Theme);
			switch(System.Display.Theme) {
				case "Auto":
					document.getElementById("ThemeVariant_Common").href = "../common-Dark.css";
					document.getElementById("ThemeVariant_Common").media = "(prefers-color-scheme: dark)";
					document.getElementById("ThemeVariant_Style").href = "style-Dark.css";
					document.getElementById("ThemeVariant_Style").media = "(prefers-color-scheme: dark)";
					break;
				case "Default":
					document.getElementById("ThemeVariant_Common").href = "";
					document.getElementById("ThemeVariant_Common").media = "";
					document.getElementById("ThemeVariant_Style").href = "";
					document.getElementById("ThemeVariant_Style").media = "";
					break;
				case "Dark":
					document.getElementById("ThemeVariant_Common").href = "../common-Dark.css";
					document.getElementById("ThemeVariant_Common").media = "";
					document.getElementById("ThemeVariant_Style").href = "style-Dark.css";
					document.getElementById("ThemeVariant_Style").media = "";
					break;
				case "Genshin":
					document.getElementById("ThemeVariant_Common").href = "../common-Genshin.css";
					document.getElementById("ThemeVariant_Common").media = "";
					document.getElementById("ThemeVariant_Style").href = "style-Genshin.css";
					document.getElementById("ThemeVariant_Style").media = "";
					break;
				case "HighContrast":
					document.getElementById("ThemeVariant_Common").href = "../common-HighContrast.css";
					document.getElementById("ThemeVariant_Common").media = "";
					document.getElementById("ThemeVariant_Style").href = "style-HighContrast.css";
					document.getElementById("ThemeVariant_Style").media = "";
					break;
				default:
					alert("【系统错误】\n参数「System.Display.Theme」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
					break;
			}
			ChangeValue("Combobox_SettingsDisplayCursor", System.Display.Cursor);
			switch(System.Display.Cursor) {
				case "Default":
					ChangeCursorOverall("");
					break;
				case "BTRAhoge":
					ChangeCursorOverall("url(../cursors/BTRAhoge.cur), auto");
					break;
				case "Genshin":
					ChangeCursorOverall("url(../cursors/Genshin.cur), auto");
					break;
				case "GenshinNahida":
					ChangeCursorOverall("url(../cursors/GenshinNahida.cur), auto");
					break;
				case "GenshinFurina":
					ChangeCursorOverall("url(../cursors/GenshinFurina.cur), auto");
					break;
				default:
					alert("【系统错误】\n参数「System.Display.Cursor」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
					break;
			}
			ChangeChecked("Checkbox_SettingsDisplayShowTopbar", System.Display.ShowTopbar);
			if(System.Display.ShowTopbar == true) {
				ChangeShow("Topbar");
				ChangePadding("SectionTitleBelowTopbar", "");
			} else {
				ChangeHide("Topbar");
				ChangePadding("SectionTitleBelowTopbar", "40px 0 40px 0");
			}
			ChangeValue("Combobox_SettingsDisplayAnimSpeed", System.Display.Anim.Speed);
			ChangeAnimSpeedOverall(System.Display.Anim.Speed);

			// Sound
			ChangeChecked("Checkbox_SettingsSoundPlaySound", System.Sound.PlaySound);
			
			// I18n
			ChangeValue("Combobox_SettingsI18nLanguage", System.I18n.Language);

			// Dev
			ChangeChecked("Checkbox_SettingsDevShowAllBorders", System.Dev.ShowAllBorders);
			ChangeShowAllBorders(System.Dev.ShowAllBorders);
			ChangeChecked("Checkbox_SettingsDevUseOldTypeface", System.Dev.UseOldTypeface);
			ChangeUseOldTypeface(System.Dev.UseOldTypeface);

		// Save Configuration
		localStorage.setItem("System", JSON.stringify(System));
	}

	// Timer
	function ClockTimer() {
		// Change Self Update Freq
		clearInterval(Automation.ClockTimer);
		if(Timer.IsRunning == true && Timer.IsPaused == false) {
			Automation.ClockTimer = setInterval(ClockTimer, 10);
		} else {
			Automation.ClockTimer = setInterval(ClockTimer, 500);
		}

		// Core
			// Update Current Time First
			if(Timer.UseCountdown == true) {
				Timer.CurrentTime = Timer.EndTime - Timer.ClockTime;
			} else {
				Timer.CurrentTime = Timer.Duration - (Timer.EndTime - Timer.ClockTime);
			}

			// Clock Time & Start Time & End Time
			Timer.ClockTime = Date.now() - new Date().getTimezoneOffset() * 60000;
			if(Timer.IsRunning == false && Timer.IsPaused == false) {
				Timer.StartTime = Timer.ClockTime;
				Timer.EndTime = Timer.ClockTime + Timer.Duration;
			}
			if(Timer.IsRunning == true && Timer.IsPaused == true) {
				if(Timer.UseCountdown == true) {
					Timer.EndTime = Timer.ClockTime + Timer.CurrentTime;
				} else {
					Timer.EndTime = Timer.ClockTime + (Timer.Duration - Timer.CurrentTime);
				}
			}

			// Update Current Time Again
			if(Timer.UseCountdown == true) {
				Timer.CurrentTime = Timer.EndTime - Timer.ClockTime;
			} else {
				Timer.CurrentTime = Timer.Duration - (Timer.EndTime - Timer.ClockTime);
			}

		// Dashboard
			// Start Time & End Time
			ChangeText("Label_TimerDashboardStartTime", Math.floor(Timer.StartTime % 86400000 / 3600000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + Math.floor(Timer.StartTime % 3600000 / 60000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + Math.floor(Timer.StartTime % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}));
			ChangeText("Label_TimerDashboardEndTime", Math.floor(Timer.EndTime % 86400000 / 3600000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + Math.floor(Timer.EndTime % 3600000 / 60000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + Math.floor(Timer.EndTime % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}));

			// Progring & Needle
			Percentage = Timer.CurrentTime / Timer.Duration * 100;
			ChangeProgring("ProgringFg_Timer", 917.35 * (100 - Percentage) / 100);
			ChangeRotate("Needle_Timer", Timer.CurrentTime / 60000 * 360);

			// Scrolling Numbers
			Timer.Display[1] = Math.floor(Timer.CurrentTime / 6000000);
			Timer.Display[2] = Math.floor(Timer.CurrentTime % 6000000 / 600000);
			Timer.Display[3] = Math.floor(Timer.CurrentTime % 600000 / 60000);
			Timer.Display[4] = Math.floor(Timer.CurrentTime % 60000 / 10000);
			Timer.Display[5] = Timer.CurrentTime % 10000 / 1000;
			Timer.Display[6] = Math.floor(Timer.CurrentTime % 1000 / 10);
			if(System.Display.Anim.Speed == "none") {
				Timer.Display[5] = Math.floor(Timer.Display[5]);
			} else {
				if(Timer.Display[5] > 9) {Timer.Display[4] = Timer.Display[4] + (Timer.Display[5] - 9);} // Imitating the cockpit PFD number scrolling effect.
				if(Timer.Display[4] > 5) {Timer.Display[3] = Timer.Display[3] + (Timer.Display[4] - 5);}
				if(Timer.Display[3] > 9) {Timer.Display[2] = Timer.Display[2] + (Timer.Display[3] - 9);}
				if(Timer.Display[2] > 9) {Timer.Display[1] = Timer.Display[1] + (Timer.Display[2] - 9);}
			}
			ChangeTop("ScrollingNumber_Timer1", -60 * (9 - Timer.Display[1]) + "px");
			ChangeTop("ScrollingNumber_Timer2", -60 * (11 - Timer.Display[2]) + "px");
			ChangeTop("ScrollingNumber_Timer3", -60 * (11 - Timer.Display[3]) + "px");
			ChangeTop("ScrollingNumber_Timer4", -60 * (7 - Timer.Display[4]) + "px");
			ChangeTop("ScrollingNumber_Timer5", 20 - 40 * (11 - Timer.Display[5]) + "px");
			ChangeText("Label_TimerDashboardCurrentTimeMillisec", "." + Timer.Display[6].toLocaleString(undefined, {minimumIntegerDigits: 2}));
		
		// Time Up
		if(Timer.ClockTime >= Timer.EndTime) {
			PopupDialogAppear("Timer_TimeUp",
				"Completion",
				"计时完成！<br />" +
				"从 " + ReadText("Label_TimerDashboardStartTime") + " 至 " + ReadText("Label_TimerDashboardEndTime") + "。<br />" +
				"设定时长 " + Math.floor(Timer.Duration / 60000) + "分" + Math.floor(Timer.Duration % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "秒，实际时长 " + Math.floor((Timer.EndTime - Timer.StartTime) / 60000) + "分" + Math.floor((Timer.EndTime - Timer.StartTime) % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "秒。",
				"确定", "", "");
			if(System.Sound.PlaySound == true) {AudioPlay("Audio_SoundRingtone");}
			TimerReset();
		}
	}
	function RefreshTimer() {
		// Call
		ClockTimer();

		// Ctrls
		if(Timer.IsRunning == false) {
			ChangeText("Cmdbtn_TimerCtrlStart", "开始");
			ChangeDisabled("Textbox_TimerOptionsMin", false); ChangeDisabled("Textbox_TimerOptionsSec", false);
		} else {
			if(Timer.IsPaused == false) {
				ChangeText("Cmdbtn_TimerCtrlStart", "暂停");
			} else {
				ChangeText("Cmdbtn_TimerCtrlStart", "继续");
			}
			ChangeDisabled("Textbox_TimerOptionsMin", true); ChangeDisabled("Textbox_TimerOptionsSec", true);
		}

		// Options
		ChangeValue("Textbox_TimerOptionsMin", Math.floor(Timer.Duration / 60000));
		ChangeValue("Textbox_TimerOptionsSec", Math.floor(Timer.Duration % 60000 / 1000));
		ChangeChecked("Checkbox_TimerOptionsCountdown", Timer.UseCountdown);

		// Presets
		ChangeText("Label_TimerPreset1", Math.floor(Timer.Preset[1] / 60000) + ":" + Math.floor(Timer.Preset[1] % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}));
		ChangeText("Label_TimerPreset2", Math.floor(Timer.Preset[2] / 60000) + ":" + Math.floor(Timer.Preset[2] % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}));
		ChangeText("Label_TimerPreset3", Math.floor(Timer.Preset[3] / 60000) + ":" + Math.floor(Timer.Preset[3] % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}));

		// Save Configuration
		localStorage.setItem("TimerPlusLottery_Timer", JSON.stringify(Timer));
	}
	function TimeSeparatorBlink() {
		Elements = document.getElementsByClassName("TimeSeparator");
		if(Timer.IsRunning == true && Timer.IsPaused == false && Elements[0].style.opacity == "") {
			for(Looper = 0; Looper < Elements.length; Looper++) {
				Elements[Looper].style.opacity = "0.2";
			}
		} else {
			for(Looper = 0; Looper < Elements.length; Looper++) {
				Elements[Looper].style.opacity = "";
			}
		}
	}

	// Lottery
	function RefreshLottery() {
		// Dashboard
		ChangeText("Label_LotteryDashboardNumber01", Lottery.Number[1]);
		ChangeText("Label_LotteryDashboardNumber02", Lottery.Number[2]);
		ChangeText("Label_LotteryDashboardNumber03", Lottery.Number[3]);
		ChangeText("Label_LotteryDashboardNumber04", Lottery.Number[4]);
		ChangeText("Label_LotteryDashboardNumber05", Lottery.Number[5]);
		ChangeText("Label_LotteryDashboardNumber06", Lottery.Number[6]);
		ChangeText("Label_LotteryDashboardNumber07", Lottery.Number[7]);
		ChangeText("Label_LotteryDashboardNumber08", Lottery.Number[8]);
		ChangeText("Label_LotteryDashboardNumber09", Lottery.Number[9]);
		ChangeText("Label_LotteryDashboardNumber10", Lottery.Number[10]);

		// Ctrls
		if(Lottery.Progress != 0) {
			ChangeDisabled("Cmdbtn_LotteryCtrlRoll", true);
		} else {
			ChangeDisabled("Cmdbtn_LotteryCtrlRoll", false);
		}

		// Options
		ChangeValue("Combobox_LotteryOptionsMode", Lottery.Mode);
		switch(Lottery.Mode) {
			case "Normal":
				ChangeDisabled("Textbox_LotteryOptionsRangeMin", false);
				ChangeDisabled("Textbox_LotteryOptionsRangeMax", false);
				break;
			case "Dice":
				ChangeDisabled("Textbox_LotteryOptionsRangeMin", true);
				ChangeDisabled("Textbox_LotteryOptionsRangeMax", true);
				Lottery.Range.Min = 1;
				Lottery.Range.Max = 6;
				break;
			case "Poker":
				ChangeDisabled("Textbox_LotteryOptionsRangeMin", true);
				ChangeDisabled("Textbox_LotteryOptionsRangeMax", true);
				Lottery.Range.Min = 1;
				Lottery.Range.Max = 13;
				break;
			default:
				alert("【系统错误】\n函数「RefreshLottery」的参数「Lottery.Mode」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
				break;
		}
		ChangeValue("Textbox_LotteryOptionsRangeMin", Lottery.Range.Min);
		ChangeValue("Textbox_LotteryOptionsRangeMax", Lottery.Range.Max);

		// Save Configuration
		localStorage.setItem("TimerPlusLottery_Lottery", JSON.stringify(Lottery));
	}
	function LotteryRoller() {
		// Move the Lottery Queue
		for(Looper = 10; Looper >= 2; Looper--) {
			Lottery.Number[Looper] = Lottery.Number[Looper - 1];
		}

		// Roll A New Number
		do { // Prevent rolling a number that already exists in the lottery queue.
			Lottery.Number[1] = Randomize(Lottery.Range.Min, Lottery.Range.Max);
			if(Lottery.Mode == "Poker") {
				if(Lottery.Number[1] == 1) {
					Lottery.Number[1] = "A";
				}
				if(Lottery.Number[1] == 11) {
					Lottery.Number[1] = "J";
				}
				if(Lottery.Number[1] == 12) {
					Lottery.Number[1] = "Q";
				}
				if(Lottery.Number[1] == 13) {
					Lottery.Number[1] = "K";
				}
			}
		} while(Lottery.PreventDuplication == true && Lottery.Range.Max - Lottery.Range.Min >= 9 && IsDuplicationInLotteryQueue() == true);

		// Make Progress
		Lottery.Progress++;

		// Finish Rolling
		if(Lottery.Progress > 10) {
			Lottery.Progress = 0;
			clearInterval(Automation.LotteryRoller);
		}

		// Refresh
		RefreshLottery();
	}
	function IsDuplicationInLotteryQueue() {
		for(Looper = 2; Looper <= 10; Looper++) {
			if(Lottery.Number[Looper] == Lottery.Number[1]) {
				return true;
			}
		}
		return false;
	}

// Cmds
	// Timer
		// Ctrls
		function TimerStart() {
			if(Timer.IsRunning == false) {
				Timer.IsRunning = true; Timer.IsPaused = false;
			} else {
				if(Timer.IsPaused == false) {
					Timer.IsPaused = true;
				} else {
					Timer.IsPaused = false;
				}
			}
			RefreshTimer();
		}
		function TimerLap() {
			if(Timer.UseCountdown == true) {
				ChangeText("Label_TimerCtrlLapRecorder",
					"#" + Timer.Lap.Sequence +
					"　+" + Math.floor((Timer.Lap.PreviousCurrentTime - Timer.CurrentTime) / 60000) + ":" + Math.floor((Timer.Lap.PreviousCurrentTime - Timer.CurrentTime) % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "." + Math.floor((Timer.Lap.PreviousCurrentTime - Timer.CurrentTime) % 1000 / 10).toLocaleString(undefined, {minimumIntegerDigits: 2}) +
					"　" + Math.floor((Timer.Duration - Timer.CurrentTime) / 60000) + ":" + Math.floor((Timer.Duration - Timer.CurrentTime) % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "." + Math.floor((Timer.Duration - Timer.CurrentTime) % 1000 / 10).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "<br />" +
					ReadText("Label_TimerCtrlLapRecorder"));
			} else {
				ChangeText("Label_TimerCtrlLapRecorder",
					"#" + Timer.Lap.Sequence +
					"　+" + Math.floor((Timer.CurrentTime - Timer.Lap.PreviousCurrentTime) / 60000) + ":" + Math.floor((Timer.CurrentTime - Timer.Lap.PreviousCurrentTime) % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "." + Math.floor((Timer.CurrentTime - Timer.Lap.PreviousCurrentTime) % 1000 / 10).toLocaleString(undefined, {minimumIntegerDigits: 2}) +
					"　" + Math.floor(Timer.CurrentTime / 60000) + ":" + Math.floor(Timer.CurrentTime % 60000 / 1000).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "." + Math.floor(Timer.CurrentTime % 1000 / 10).toLocaleString(undefined, {minimumIntegerDigits: 2}) + "<br />" +
					ReadText("Label_TimerCtrlLapRecorder"));
			}
			Timer.Lap.Sequence++;
			Timer.Lap.PreviousCurrentTime = Timer.CurrentTime;
		}
		function TimerReset() {
			Timer.IsRunning = false; Timer.IsPaused = false;
			Timer.Lap.Sequence = 1;
			if(Timer.UseCountdown == true) {
				Timer.Lap.PreviousCurrentTime = Timer.Duration;
			} else {
				Timer.Lap.PreviousCurrentTime = 0;
			}
			RefreshTimer();
			ChangeText("Label_TimerCtrlLapRecorder", "");
		}

		// Options
		function SetTimerDuration() {
			Timer.Duration = parseInt(Number(ReadValue("Textbox_TimerOptionsMin"))) * 60000 + parseInt(Number(ReadValue("Textbox_TimerOptionsSec"))) * 1000; // Use parseInt(Number()) to force convert value to integer.
			if(Timer.Duration < 1000) {
				Timer.Duration = 1000;
			}
			if(Timer.Duration > 59999000) {
				Timer.Duration = 59999000;
			}
			RefreshTimer();
		}
		function SetTimerCountdown() {
			if(document.getElementById("Checkbox_TimerOptionsCountdown").checked) {
				Timer.UseCountdown = true;
			} else {
				Timer.UseCountdown = false;
			}
			Timer.Lap.PreviousCurrentTime = Timer.Duration - Timer.Lap.PreviousCurrentTime;
			RefreshTimer();
		}

		// Presets
		function TimerPresetStart(Selector) {
			Timer.Duration = Timer.Preset[Selector];
			TimerReset();
			TimerStart();
		}
		function TimerPresetReplace(Selector) {
			Timer.Preset[Selector] = Timer.Duration;
			RefreshTimer();
		}
	
	// Lottery
		// Ctrls
		function LotteryRoll() {
			Lottery.Progress = 1;
			Automation.LotteryRoller = setInterval(LotteryRoller, 100);
			RefreshLottery();
		}
		function LotteryReset() {
			for(Looper = 1; Looper <= 10; Looper++) {
				Lottery.Number[Looper] = 0;
			}
			Lottery.Progress = 0;
			RefreshLottery();
		}

		// Options
		function SetLotteryMode() {
			Lottery.Mode = ReadValue("Combobox_LotteryOptionsMode");
			RefreshLottery();
		}
		function SetLotteryRangeMin() {
			Lottery.Range.Min = parseInt(Number(ReadValue("Textbox_LotteryOptionsRangeMin")));
			if(Lottery.Range.Min < 1) {
				Lottery.Range.Min = 1;
			}
			if(Lottery.Range.Min > 9999) {
				Lottery.Range.Min = 9999;
			}
			if(Lottery.Range.Min > Lottery.Range.Max) {
				Lottery.Range.Max = Lottery.Range.Min;
			}
			RefreshLottery();
		}
		function SetLotteryRangeMax() {
			Lottery.Range.Max = parseInt(Number(ReadValue("Textbox_LotteryOptionsRangeMax")));
			if(Lottery.Range.Max < 1) {
				Lottery.Range.Max = 1;
			}
			if(Lottery.Range.Max > 9999) {
				Lottery.Range.Max = 9999;
			}
			if(Lottery.Range.Max < Lottery.Range.Min) {
				Lottery.Range.Min = Lottery.Range.Max;
			}
			RefreshLottery();
		}
		function SetLotteryPreventDuplication() {
			if(document.getElementById("Checkbox_LotteryOptionsPreventDuplication").checked) {
				Lottery.PreventDuplication = true;
			} else {
				Lottery.PreventDuplication = false;
			}
			RefreshLottery();
		}

	// Settings
		// Display
		function SetDisplayTheme() {
			System.Display.Theme = ReadValue("Combobox_SettingsDisplayTheme");
			RefreshSystem();
		}
		function SetDisplayCursor() {
			System.Display.Cursor = ReadValue("Combobox_SettingsDisplayCursor");
			RefreshSystem();
		}
		function SetDisplayShowTopbar() {
			if(document.getElementById("Checkbox_SettingsDisplayShowTopbar").checked) {
				System.Display.ShowTopbar = true;
			} else {
				System.Display.ShowTopbar = false;
			}
			RefreshSystem();
		}
		function SetDisplayAnimSpeed() {
			System.Display.Anim.Speed = ReadValue("Combobox_SettingsDisplayAnimSpeed");
			RefreshSystem();
		}

		// Sound
		function SetSoundPlaySound() {
			if(document.getElementById("Checkbox_SettingsSoundPlaySound").checked) {
				System.Sound.PlaySound = true;
			} else {
				System.Sound.PlaySound = false;
			}
			RefreshSystem();
		}

		// I18n
		function SetI18nLanguage() {
			System.I18n.Language = ReadValue("Combobox_SettingsI18nLanguage");
			switch(System.I18n.Language) {
				case "zh-CN":
					// window.location.replace("index.html");
					break;
				case "en-US":
					PopupDialogAppear("System_LanguageUnsupported",
						"Termination",
						"<span lang='en-US'>Sorry, this page currently does not support English (US).</span>",
						"<span lang='en-US'>OK</span>", "", "");
					break;
				case "ja-JP":
					PopupDialogAppear("System_LanguageUnsupported",
						"Termination",
						"<span lang='ja-JP'>すみません。このページは日本語にまだサポートしていません。</span>",
						"<span lang='ja-JP'>OK</span>", "", "");
					break;
				case "zh-TW":
					PopupDialogAppear("System_LanguageUnsupported",
						"Termination",
						"<span lang='zh-TW'>抱歉，本頁面暫不支援繁體中文。</span>",
						"<span lang='zh-TW'>確定</span>", "", "");
					break;
				default:
					alert("【系统错误】\n函数「SetI18nLanguage」的参数「System.I18n.Language」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
					break;
			}
			RefreshSystem();
		}

		// Dev
		function SetDevShowAllBorders() {
			if(document.getElementById("Checkbox_SettingsDevShowAllBorders").checked) {
				System.Dev.ShowAllBorders = true;
			} else {
				System.Dev.ShowAllBorders = false;
			}
			RefreshSystem();
		}
		function SetDevUseOldTypeface() {
			if(document.getElementById("Checkbox_SettingsDevUseOldTypeface").checked) {
				System.Dev.UseOldTypeface = true;
			} else {
				System.Dev.UseOldTypeface = false;
			}
			RefreshSystem();
		}
		function SetDevClearLocalStorage() {
			PopupDialogAppear("System_ConfirmClearLocalStorage",
				"Caution",
				"您确认要清空 Local Storage？",
				"清空", "取消", "");
		}
	
	// Popup Dialog Answer
	function PopupDialogAnswer(Selector) {
		switch(Interaction.PopupDialogEvent) {
			case "System_LanguageUnsupported":
				switch(Selector) {
					case 1:
						break;
					default:
						alert("【系统错误】\n函数「PopupDialogAnswer」的参数「Selector」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
						break;
				}
				break;
			case "System_ConfirmClearLocalStorage":
				switch(Selector) {
					case 1:
						ClearLocalStorage();
						break;
					case 2:
						break;
					default:
						alert("【系统错误】\n函数「PopupDialogAnswer」的参数「Selector」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
						break;
				}
				break;
			case "Timer_TimeUp":
				switch(Selector) {
					case 1:
						AudioStop("Audio_SoundRingtone");
						break;
					default:
						alert("【系统错误】\n函数「PopupDialogAnswer」的参数「Selector」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
						break;
				}
				break;
			default:
				alert("【系统错误】\n函数「PopupDialogAnswer」的参数「Interaction.PopupDialogEvent」为意料之外的值。\n请通过「帮助」版块中的链接向我提供反馈以帮助解决此问题，谢谢！");
				break;
		}
		PopupDialogDisappear();
	}

// Automations
	// Time Separator Blink
	Automation.TimeSeparatorBlink = setInterval(TimeSeparatorBlink, 500);
