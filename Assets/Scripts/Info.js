var mySkin : GUISkin;
var helpText : String;

function Start() {
// 	var bt : String = Globals.bestTime > 0.0 ? "BEST TIME: " + Globals.bestTime + " seconds" +
// 		" by: " + Globals.bestScorePlayer : "";
 	var bt : String = "\n\nBEST TIME: " + Globals.bestTime + " seconds" +
 		" by: " + Globals.bestScorePlayer;
		
	
	helpText = 	"WELCOME TO CUBEMOTION. " +
				"Match the animations of the cubes. Note that you're viewing them in " +
				"3D, so a pair of the animations may look slightly different, depending on their position. " + 	
				"Avoid making the wrong selection, " + 
				"as the animation on the first item will go out of sync with its pair, making a match harder. " +
				"Two wrong hits will add 5 seconds to your time. " +
				"You can repeat any game by hitting the CHALLENGE icon. Hand over your device and give them a chance to beat you. " +
				bt;
				
}
				
function OnGUI () {
	GUI.skin = mySkin;
	GUI.Label(Rect(20,20, 300, 340), helpText);

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