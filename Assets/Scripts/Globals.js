//
// UI modifyable
//
static var cols : int;
static var rows : int;
static var xIncr : float;
static var yIncr : float;

//
// globals accessible from
// other scripts
//
static var nCubes : int;
static var nPairs : int;
static var bestScorePlayer : String;
static var currentPlayer : String;
static var gameOn : boolean = false;
static var bestTime : float = 0.0;
static var maxPlayers : int = 5;
static var playerList : String[];
static var endGameFunc : Function;
static var hitFunc : Function;
static var currentGameLevel : int = 1;
static var gamePrefs : GamePrefs;
static var hitMan : HitManager;
static var cubeArray : GameObject[];
static var screenshotNum : int = 1;

//
// Nasty addition: add a pair of cubes for every
// 2 or more consecutive wrong hits
//
var wrongCount : int = 0;

static var inited = false;

//
// locals
//
private static var nAnim : int = 0; // to create unique animation name

private static var clipArray : AnimationClip[];
private static var TYPES : int = 3; // types of animation, eg, rotation, trans..

static var havePlayerName : boolean = true;

Random.seed = Network.time;
		
static function init() {
	//
	// This function is called only once per game.
	// To ensure that, the static variable inited is set
	// in the calling script (in menu.js), so this is 
	// only called when inited is false.
	//
	print ("init() in Globals");
	
	gamePrefs = new GamePrefs();
	gamePrefs.init();
		
	hitMan = new HitManager();
	
	nCubes = cols * rows;
	nPairs = nCubes / 2;
	
	playerList = new String[maxPlayers];
			
	for (var i = 0; i < maxPlayers; i++) {
		if (PlayerPrefs.HasKey("playerList" + i)) {
			playerList[i] = PlayerPrefs.GetString("playerList" + i); 
			print("playerList" + i + ": " + playerList[i]);
			if (playerList[i] == null)
				playerList[i] = "not set";
		}
		else		
			playerList[i] = "no name";
	}
	for (i = 0; i < maxPlayers; i++)
		print("playerList" + i + ": " + playerList[i]);	
	
	if (PlayerPrefs.HasKey("currentPlayer"))
		Globals.currentPlayer = PlayerPrefs.GetString("currentPlayer");
	else {
		Globals.currentPlayer = playerList[0]; // set as default	
		if (Globals.currentPlayer == "no name")
			Globals.havePlayerName = false; // go to the player screen
	}
	if (PlayerPrefs.HasKey("bestScorePlayer"))
		Globals.bestScorePlayer = PlayerPrefs.GetString("bestScorePlayer");
	if (PlayerPrefs.HasKey("bestTime"))
		Globals.bestTime = PlayerPrefs.GetFloat("bestTime");
}

class GamePrefs {
	var soundFX : int;
	var musicOn : int;
	var simpleCube : int;
	
	function GamePrefs() {
		this.soundFX = 1;
		this.musicOn = 0;
		this.simpleCube = 0;
	};
	
	function init() {
		if (PlayerPrefs.HasKey("soundFX"))
			this.soundFX = PlayerPrefs.GetInt("soundFX");
		if (PlayerPrefs.HasKey("musicOn"))
			this.musicOn = PlayerPrefs.GetInt("musicOn");
		if (PlayerPrefs.HasKey("simpleCube"))
			this.simpleCube = PlayerPrefs.GetInt("simpleCube");
	};
	
	function save() {
		PlayerPrefs.SetInt("soundFX", this.soundFX);
		PlayerPrefs.SetInt("musicOn", this.musicOn);
		PlayerPrefs.SetInt("simpleCube", this.simpleCube);
	};
}

class HitManager {
	var hitCount : int; // one or 2
	var matchedPairs : int;
	var firstHit : GameObject;
	var startTime : float;
	var endTime : float;
	var gameTime : float;
	var lowestTime : float;
	var wrongHits : int;
			
	function start() {
		this.lowestTime = Globals.bestTime;
		this.hitCount = 0;
		this.matchedPairs = 0;
		this.startTime = Time.time;
		this.gameTime = 0.0;
		this.wrongHits = 0;
	};
	
	function getCurrentGameTime() : float {
		return Time.time - this.startTime;
	};
	
	function end() {
		Globals.gameOn = false;

		this.endTime = Time.time;
		this.gameTime = this.endTime - this.startTime;

		if (this.lowestTime == 0.0 || this.gameTime < this.lowestTime) {
			//
			// For testing we'll make the first player
			// the best scorer. 
			//
			this.lowestTime = this.gameTime; 
			Globals.bestScorePlayer = Globals.currentPlayer;
			Globals.bestTime = this.lowestTime;
			
			PlayerPrefs.SetString("bestScorePlayer", Globals.bestScorePlayer);
			PlayerPrefs.SetFloat("bestTime", Globals.bestTime);
			
			Globals.hitFunc(4); // newHi sound
		}
		Globals.endGameFunc();		
	};
	
	function Hit(target : GameObject) {
		if (this.hitCount == 0) {
			//
			// Clicked on first of pair. Mark it
			//
			this.firstHit = target;
//			this.firstHit.transform.localScale = Vector3(0.5, 0.5, 0.5); // shrink it while pairing 
			this.firstHit.animation.Stop();
			
			Debug.Log("First hit on: " + target.name + " containing clip: " + target.animation.clip.name);
			
			Globals.hitFunc(0); // click
			hitCount++;
		}
		else if (this.hitCount == 1) {
			//
			// First restore the marked cube
			//
//			this.firstHit.transform.localScale = Vector3(1.0, 1.0, 1.0);			
			this.firstHit.animation.Play();
			
			Debug.Log("Second hit: reset " + this.firstHit.name + " containing clip: " + target.animation.clip.name);
			
			if (this.firstHit.name == target.name) {
				//
				// For now do nothing. Maybe add a penalty for being indecisive
				//
				
			}
			else if (this.firstHit.animation.clip.name == target.animation.clip.name) {
				//
				// A match
				//
				Debug.Log("Matched " + this.firstHit.name + " with " + target.name +
					" for animation " + this.firstHit.animation.clip.name);

				// a matching pair
				this.matchedPairs++;
				
				// switch them off
				this.firstHit.active = false;
				target.active = false;

				Debug.Log("Matches: " + this.matchedPairs + " of " + Globals.nPairs + " from " + Globals.nCubes);				
				
				if (this.matchedPairs == Globals.nPairs) {
					//
					// Completed all 15 matches
					//					
					Globals.hitFunc(3); // game over
					
					this.end();
					
				}					
				else {
					
					Globals.hitFunc(2); // a match	
				}				
			}
			else { // punishment!
				if (++this.wrongHits >= 2) {
					this.wrongHits = 0;
					this.startTime -= 5.0;
					
					Globals.hitFunc(5);
				}
				else
					Globals.hitFunc(1); // plays bzz sound for wrong choice
			}
									
			this.hitCount = 0;			
		}
		else
			Debug.Log("HitCount > 1!! ERROR!");
	};			
}

class ClipParams {

	var theType : int;
	var clipLen : float;
	var xMod : float;
	var yMod : float;
	var zMod : float;
	var wMode : WrapMode;
	var clipName : String;

	function ClipParams(tt : int, cl : float,  
				xm : float, ym : float, zm : float,
				wm : WrapMode, cn : String) {	
		
		this.theType = tt;
		this.clipLen = cl;
		this.xMod = xm;
		this.yMod = ym;
		this.zMod = zm;
		this.wMode = wm;
		this.clipName = cn;
	};
	
	function dump() {
		Debug.Log("theType: " + theType + ", clipLen: " + clipLen + ", xMod: " + xMod +
			", yMod: " + yMod + ",zMod: " + zMod + ", clipName: " + clipName);
	};
}
	
static function createCubes(src : GameObject) {
	//
	// src is the object to clone
	//
	
	//
	// params is a fresh array of shuffled animation parameters
	// to generate curves to attach to clips. There are two
	// of each to each cube has amn animation pair
	//
	
	print("createCubes");
	
	var params = createRandomClipParamArray(cols * rows);
	
	cubeArray = new GameObject[cols * rows];
	
	var yPos : float = 0;
	var intToggle : int = 0;	
	var ix = 0;
	
	for (var r : int = 0; r < rows; r++) {
		
		var xPos : float = 0;
		
		for (var c : int = 0; c < cols; c++) {

			var ob : GameObject = Instantiate(src, Vector3(xPos, yPos, 0), Quaternion.identity);
			ob.AddComponent("BoxCollider"); // to make it clickable
			ob.name = "box-r" + r + "-c" + c; 			
			
//			ob.AddComponent(CubeScript); // the clickon script for gameplay
			print("Created GameObject named: " + ob.name);
			
			addClip(ob, params[ix]);
			cubeArray[ix] = ob;
			ix++;
			
//			print("Attached animation named: " + ob.animation.name + " to object: " + ob.name);			
//			print("Clip instance ID: " + ob.animation.clip.GetInstanceID());

			ob.renderer.enabled = true;

			xPos += xIncr;			
		}
		
		yPos += yIncr;
	}
	
	hitMan.start();
}	

static function addClip(ob : GameObject, params : ClipParams) {
	
//	ob.AddComponent("Animation");
//	ob.animation.playAutomatically = true;	    
    
    var aClip : AnimationClip;
    
    switch (params.theType) {
    	case 1:    	
			aClip = Anims.animRot(ob, params.clipLen, params.xMod, params.yMod, params.zMod, params.wMode);
			break;
		case 2:
			aClip = Anims.animPos(ob, params.clipLen, params.xMod, params.yMod, params.zMod, params.wMode);	
			break;		
		case 3:
			aClip = Anims.animScale(ob, params.clipLen, params.xMod, params.yMod, params.zMod, params.wMode);
			break;
    }
    
    aClip.name = params.clipName;
    ob.animation.AddClip(aClip, params.clipName);
    
//    print("aClip instance ID: " + aClip.GetInstanceID());
    
	ob.animation.clip = aClip;
	
//  print("New object: " + ob.name + " with animation: " + ob.animation + " and clip: " + ob.animation.clip);
//	print("Clip name: " + ob.animation.clip.name);
	
    ob.animation.Play(params.clipName);
}

static function createRandomClipParamArray(nSize : int) : ClipParams[] {
	//
	// assume size == number of cubes and number
	// of param blocks is size / 2 so each param has a pair
	//
	var paramArray = new ClipParams[nSize];
	var ix = 0;
	
	for (var i = 0; i < nSize / 2; i++) {
		var cp : ClipParams = createRandomClipParams(currentGameLevel);
		
//		cp.dump();
		
		paramArray[ix++] = cp;
		paramArray[ix++] = cp; // must be in pairs
	}
	
	//
	// Shuffle the pack
	//
	i = nSize;
	while (--i) {
	   var j = Mathf.Floor(Random.value * (i + 1));
	   var tempi = paramArray[i];
	   var tempj = paramArray[j];
	   paramArray[i] = tempj;
	   paramArray[j] = tempi;
	}
	
	return paramArray;	
}		
static function createRandomClipParams(theType : int) : ClipParams {			
	if (theType < 1) // 0 for random
		theType = Mathf.Floor(Random.value * TYPES + 1);	

	var clipLen : float = 0.1 + Random.value * 3.0;
	var n : int = Mathf.Floor(Random.value * 4); // bias toward pingpong
	var wMode : WrapMode = WrapMode.PingPong; //= n ? WrapMode.PingPong : WrapMode.Loop; // loop not nice unless full 360	
	var clipName : String = "clip" + ++nAnim;

	var xMod : float;
	var yMod : float;
	var zMod : float;
	
	switch (theType) {
		case 1: // rotation			
			xMod = (Random.value * 360.0) - 180.0;
			xMod = (Random.value * 360.0) - 180.0;
			zMod = (Random.value * 360.0) - 180.0;
			break;
		case 2: // translation
			xMod = (Random.value * 0.75) - 0.375;
			yMod = (Random.value * 0.75) - 0.375;
			zMod = (Random.value * 0.75) - 0.375;
			break;
		case 3: // scale
			xMod = (Random.value * 1.5) - 0.75;
			yMod = (Random.value * 1.5) - 0.75;
			zMod = (Random.value * 1.5) - 0.75;
			break;			
	}
	
	return new ClipParams(theType, clipLen, xMod, yMod, zMod, wMode, clipName);
}		