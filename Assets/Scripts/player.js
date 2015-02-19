var mySkin : GUISkin;

var menuButton : GameObject;

function Start() {
	print ("In Player.js Start()");
	
	for (var i = 0; i < Globals.playerList.length; i++) {		
		print ("Player " + i + " : " + Globals.playerList[i]);
	}
	
	menuButton = gameObject.Find("menuButton");
}

function OnGUI () {
	GUI.skin = mySkin;
	
	//
	// NOTE: for testing, you'll get an error here if
	// you dont' start from the "splash" level, since the
	// init() function in Globals needs to be called to
	// initialise the player list
	//
	
	GUI.Label (Rect (20, 10, 300, 30), "Current player: " + Globals.currentPlayer);	
	
	for (var i = 0; i < Globals.playerList.length; i++) {		
		Globals.playerList[i] = GUI.TextField (Rect (40, 50 + i * 40, 160, 30), Globals.playerList[i]);
		
		if (GUI.Button (Rect (220, 50 + i * 40, 80, 30), "< choose")) {
			Globals.currentPlayer = Globals.playerList[i];
			print("Current player: " + Globals.currentPlayer);
			PlayerPrefs.SetString("currentPlayer", Globals.currentPlayer);
			var test = PlayerPrefs.GetString("currentPlayer");
			print("Set: " + test);
		}				
	}
	
	GUI.Label(Rect(20, 280, 280, 100), "Tap in a box to add or change a name." + 
		" Hit the \"choose\" button to set a name on the left as the current player.");
	
	if (GUI.changed) {
		//
		// In case they've added a name to the list
		//
		print("Updating prefs");
		
		for (i = 0; i < Globals.playerList.length; i++) {
			PlayerPrefs.SetString("playerList" + i, Globals.playerList[i]);

			test = PlayerPrefs.GetString("playerList" + i);
			print("Set: " + test);
		}
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