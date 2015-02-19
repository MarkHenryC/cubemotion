var mySkin : GUISkin;

var menuButton : GameObject;

private static var toggleSFX : boolean;
private static var sfxStatus : String;
private static var musicStatus : String;
private static var toggleMusic : boolean;
private static var simpleCubeStatus : String;
private static var toggleSimpleCube : boolean;
private static var localInfo = "If you're on an older iPod you may get better performance " +
								"by switching to simple drawing.";
								
function Start() {
	toggleSFX = Globals.gamePrefs.soundFX ? true : false;
	toggleMusic = Globals.gamePrefs.musicOn ? true : false;
	toggleSimpleCube = Globals.gamePrefs.simpleCube ? true : false;

	sfxStatus = toggleSFX ? "Sound FX ON" : "Sound FX OFF";
	musicStatus = toggleMusic ? "No music. Use iTunes!" : "Music OFF";			
	simpleCubeStatus = toggleSimpleCube ? "Simple drawing ON" : "Simple drawing OFF";	
	
	menuButton = gameObject.Find("menuButton");
}

function OnGUI () {
	GUI.skin = mySkin;

	toggleSFX = GUI.Toggle (Rect (20, 20, 200, 40), toggleSFX, sfxStatus);
	toggleMusic = GUI.Toggle (Rect (20, 70, 200, 40), toggleMusic, musicStatus);
	
	//
	// Info about simple cube drawing and toggle switch
	//
	GUI.Label(Rect(20, 130, 280, 100), localInfo);
	toggleSimpleCube = GUI.Toggle (Rect (20, 220, 200, 40), toggleSimpleCube, simpleCubeStatus);		
	
	if (GUI.changed) {
		Globals.gamePrefs.soundFX = toggleSFX ? 1 : 0;
		Globals.gamePrefs.musicOn = toggleMusic ? 1 : 0;
		Globals.gamePrefs.simpleCube = toggleSimpleCube ? 1 : 0;
		Globals.gamePrefs.save();
		
		sfxStatus = toggleSFX ? "Sound FX ON" : "Sound FX OFF";
		musicStatus = toggleMusic ? "No music. Use iTunes!" : "Music OFF";			
		simpleCubeStatus = toggleSimpleCube ? "Simple drawing ON" : "Simple drawing OFF";		
	}
}

// For checking clickable objects such as menuCube
//
function Update () {
	var tCount = iPhoneInput.touchCount;
	if (tCount > 0) {
		
		var touchPos : Vector3 = iPhoneInput.GetTouch(0).position;
		
		if (iPhoneInput.GetTouch(0).phase == iPhoneTouchPhase.Began) {
				
			var ray = Camera.main.ScreenPointToRay (touchPos);
			var hit : RaycastHit;		
	
			if (iPhoneInput.touchCount == 3)
				Application.CaptureScreenshot("screenshot" + Globals.screenshotNum++ + ".png");
	
			if (Physics.Raycast (ray, hit, 100)) {
			
				var target : GameObject = hit.collider.gameObject;
			
				print("Hit object: " + target.name);
				
				if (target.name == "MenuBlock")
					Application.LoadLevel("menu");
					
			} // raycast hit on cubes
			
		} // touchPhase == began
	} // tCount > 0
}