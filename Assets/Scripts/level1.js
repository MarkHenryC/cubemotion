// Attach this to camera object
// to set up level initialisation

var levelStyle: GUIStyle;
var mySkin : GUISkin;

var COLS : int;
var ROWS : int;
var XSPACE : float;
var YSPACE : float;

var taunt : String;

var challengerTime : float;
var challengeeTime : float;

// enums? 1 = challenge issued, 2 = challenging, 3 = challenger won, 4 = chalengee won, 5 = wimpout
var challengeState : int = 0; 

var challengeeName : String;

var uiChallengeMesh : GameObject;
var uiNewGameMesh : GameObject;
var uiMenuMesh : GameObject;
var uiSelectChallengeMesh : GameObject;
var uiSelectWimpoutMesh : GameObject;

//
// For switching on and off UI elements
//
var startGameMask : int;
var endGameMask : int;
var challengeMask : int;

//
// This is for seconds counter
// Probably should get it from HitManager
// to avoid duplication but HM does't track
// game time - only at end of game
//
var timeDisplay : GUIText;
var lastTime : float; 
var startTime : float;

//
// Finally, sounds
//
/* * keep it simple for now; too many sounds == too bug app *
var BUZZCOUNT : int = 6;
var MATCHCOUNT : int = 5;
var WINCOUNT : int = 3;

var bzz : AudioSource[];
var match : AudioSource[];
var win : AudioSource[];
*/
var groan : AudioSource;
var wrong : AudioSource;
var match : AudioSource;
var lastMatch : AudioSource;
var newHi : AudioSource;
var touch : AudioSource;

function loadSounds(srcArray : AudioSource[], prefix : String, count : int) {
	for (var i = 0; i < count; i++) {
		var ob : GameObject = gameObject.Find(prefix + (i+1));
		if (ob)
			print("Got " + prefix + (i + 1) + ": Object " + ob);
		else
			print("NULL " + prefix + (i + 1));
			
		srcArray[i] = ob.audio;
	}
}

function initSounds() {
	//
	// Initialise sounds
	//
	/*
	bzz = new AudioSource[BUZZCOUNT];
	match = new AudioSource[MATCHCOUNT];
	win = new AudioSource[WINCOUNT];
	
	loadSounds(bzz, "bzz", BUZZCOUNT);
	loadSounds(match, "match", MATCHCOUNT);
	loadSounds(win, "win", WINCOUNT);		
	*/
	
	var ob : GameObject;
	
	ob = gameObject.Find("groan");
	groan = ob.audio;
	ob = gameObject.Find("wrong");
	wrong = ob.audio;
	ob = gameObject.Find("match");
	match = ob.audio;
	ob = gameObject.Find("lastMatch");
	lastMatch = ob.audio;
	ob = gameObject.Find("newHi");
	newHi = ob.audio;	
	ob = gameObject.Find("touch");
	touch = ob.audio;	
	
}

function hitSoundCallback(mode : int) {
	var snd : AudioSource = groan;
	switch (mode) {
	case 0: // click
		snd = touch;
		break;
	case 1: // wrong
		//snd = bzz[Random.Range(0, BUZZCOUNT-1)];
		snd = wrong;
		break;
	case 2: // match
		//snd = match[Random.Range(0, MATCHCOUNT-1)];
		snd = match;
		break;
	case 3: // last match
		//snd = win[Random.Range(0, WINCOUNT-1)];
		snd = lastMatch;
		break;
	case 4: // new high score
		snd = newHi;
		//
		// Sneak in a bit of extra code here
		// Display high score
		//
		var ob = gameObject.Find("newHiScoreText");
		ob.guiText.text = "NEW HI SCORE!";
		break;
	case 5:
		snd = groan;
		break;
	}
	if (Globals.gamePrefs.soundFX)
		snd.Play();
}

function Start() {
	print("Start() in level1.js");

	var ob = gameObject.Find("newHiScoreText");
	ob.guiText.text = "";

	Globals.cols = COLS;
	Globals.rows = ROWS;
	Globals.xIncr = XSPACE;
	Globals.yIncr = YSPACE;
	
	startGameMask = 1 | 1 << 11; // just layer 1 & 11 (menu)
	endGameMask = 1 | 1 << 11 | 1 << 9; // layers 1, 9 & 11 visible
	challengeMask = 1 | 1 << 10; // switch menu off
	
	Camera.main.cullingMask = startGameMask;
	
	var templateName = Globals.gamePrefs.simpleCube ? "cube_simple" : "cube";
	
	var template : GameObject = gameObject.Find(templateName);
	
	Globals.createCubes(template);	
		
	timeDisplay = gameObject.Find("timeDisplay").guiText;		
	
	Globals.init();
	
	if (PlayerPrefs.HasKey("challengee"))
		challengeeName = PlayerPrefs.GetString("challengee");
	
	uiChallengeMesh = gameObject.Find("uiChallengeMesh");
//	uiChallengeMesh.active = false;
	
	uiNewGameMesh = gameObject.Find("uiNewGameMesh");
//	uiNewGameMesh.active = false;
	
	uiSelectChallengeMesh = gameObject.Find("uiSelectChallengeMesh");
//	uiSelectChallengeMesh.active = false;
	
	uiSelectWimpoutMesh = gameObject.Find("uiSelectWimpoutMesh");
//	uiSelectWimpoutMesh.active = false;
	
	uiMenuMesh = gameObject.Find("uiMenuMesh");
	
	Globals.endGameFunc = level1EndGame;		
	
	startTime = lastTime = Time.time;
	
	print("Base time start game: " + lastTime);
	
	initSounds();
	Globals.hitFunc = hitSoundCallback;
// 	
// 	var test = gameObject.Find("bzz1");
// 	print("test= " + test);
// 	test.audio.Play();
	
	Globals.gameOn = true;
	Globals.hitMan.start();
}

function level1EndGame() {
	print("Level 1 End Game routine called");
	
	//
	// The end of a challenge game
	//
	if (challengeState == 2) {
		//
		// compare scores etc
		//
		challengeeTime = Globals.hitMan.gameTime;
		if (challengeeTime < challengerTime)
			challengeState = 4;
		else
			challengeState = 3;
			
//		uiChallengeMesh.active = false;
//		uiNewGameMesh.active = false;
		
		Camera.main.cullingMask = startGameMask;
			
	}
	else if (challengeState == 0) {	
		//
		// End of a regular game
		//
//		uiChallengeMesh.active = true;
//		uiNewGameMesh.active = true;
				
		Camera.main.cullingMask = endGameMask;
	}
}

function newGame() {
	print("Creating new game");
	
	Application.LoadLevel("level1");
}

function challenge() {
	print("Creating challenge game");

	var ob = gameObject.Find("newHiScoreText");
	ob.guiText.text = "";
	
//	uiNewGameMesh.active = false;
//	uiChallengeMesh.active = false;

	Camera.main.cullingMask = challengeMask;	
	
	challengerTime = Globals.hitMan.gameTime;
	
	taunt = "You have been issued a challenge by " + 
		Globals.currentPlayer + ". This person seems to think they're pretty"
		+ " good, and that maybe you can't beat their time of " + challengerTime
		+ " seconds. Are you up for it? Enter your name below then"
		+ " select the Challenge icon"
		+ " on the right or the crybaby icon on the left."; 				
		
	challengeState = 1;
	
//	uiSelectChallengeMesh.active = true;
//	uiSelectWimpoutMesh.active = true;
	
	print("Challenge issued in challenged");
}

function startChallenge() {
	for (var i = 0; i < Globals.cubeArray.length; i++) {
		Globals.cubeArray[i].active = true;
	}
	
	startTime = lastTime = Time.time;
		
	Globals.hitMan.start();
	Globals.gameOn = true;

	challengeState = 2;
	
	uiSelectChallengeMesh.active = false;
	uiSelectWimpoutMesh.active = false;
	
	Camera.main.cullingMask = startGameMask;
	
	print("startChallenge()");
}

function wimpout() {
	challengeState = 0;
	Application.LoadLevel("menu");
}
	
function fakeGameEnd() {
	print("fakeGameEnd()");
	
	for (var i = 0; i < Globals.cubeArray.length; i++)
		Globals.cubeArray[i].active = false;
	
	Globals.hitMan.end();
	
	level1EndGame();
}

function Update () {	
	var tCount = iPhoneInput.touchCount;
	if (tCount > 0) {
		
		var touchPos : Vector3 = iPhoneInput.GetTouch(0).position;
		
		if (iPhoneInput.GetTouch(0).phase == iPhoneTouchPhase.Began) {
				
			var ray = Camera.main.ScreenPointToRay (touchPos);
			var hit : RaycastHit;		
	
			if (iPhoneInput.touchCount == 3)
				Application.CaptureScreenshot("screenshot" + Globals.screenshotNum++ + ".png");
				
// 			else if (iPhoneInput.touchCount == 4)
// 				fakeGameEnd();
	
			if (Physics.Raycast (ray, hit, 100, Camera.main.cullingMask)) {
			
				var target : GameObject = hit.collider.gameObject;
			
				print("Hit object: " + target.name);
				
				if (target.tag == "dice") {
					
					//
					// dice only active when game on
					//
					if (Globals.gameOn)
						Globals.hitMan.Hit(target);
					else print ("No gameOn");
						
				} // target 

				else if (target.name == "MenuBlock")
					Application.LoadLevel("menu");
					
				else if (challengeState == 0) {
					if (target.name == "uiChallengeMesh")
						challenge();
					else if (target.name == "uiNewGameMesh")
						newGame();
				}
				else if (challengeState == 1) {
					if (target.name == "uiSelectChallengeMesh")
						startChallenge();
					else if (target.name == "uiSelectWimpoutMesh")
						wimpout();
					
				}
					
			} // raycast hit on cubes
			
		} // touchPhase == began
	} // tCount > 0

	if (Globals.gameOn) {	
		//
		// Update no more than once per second
		//
		var t = Time.time;
		var diff : float = t - lastTime;
		if (diff >= 1.0) {
			timeDisplay.text = "" + Mathf.Round(Globals.hitMan.getCurrentGameTime());
			lastTime = t;
		} 
	}	
}

function OnGUI () {
	GUI.skin = mySkin;
	switch (challengeState) {
		case 1:
			// Make a background box
// 			GUI.Box (Rect (40, 10, 240, 380), "THE CHALLENGE");
// 		
// 			if (GUI.Button (Rect (60, 40, 200, 40), "START")) {
// 				startChallenge();
// 			}
// 
// 			// Make the second button.
// 			if (GUI.Button (Rect (60, 90, 200, 40), "WIMP OUT")) {		
// 				challengeState = 5;
// 				Application.LoadLevel ("menu");
// 			}
		
			GUI.Label(Rect(60, 130, 200, 230), taunt);
			
			challengeeName = GUI.TextField (Rect(60, 370, 250, 30), challengeeName);
							
			if (GUI.changed) {
				Globals.currentPlayer = challengeeName;
				
				print("Updating challengee info");
				
				PlayerPrefs.SetString("challengee", challengeeName);
		
				var test = PlayerPrefs.GetString(challengeeName);
				print("Challengee set to: " + test);
			}			
			break;
		case 3:
			GUI.Label(Rect(60, 170, 200, 100), "" + challengeeName + " LOSES");
			break;
		case 4:
			GUI.Label(Rect(60, 170, 200, 100), "" + challengeeName + " WINS");
			break;			
	}	
}