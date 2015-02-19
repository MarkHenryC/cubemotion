var mySkin : GUISkin;

function Start() {
	print("Start() in Menu.js. Checking Globals.inited: " + Globals.inited);
	
	if (!Globals.inited) {
		Globals.init();
		Globals.inited = true;
		print("Called init() in Globals.js. Globals.inited: " + Globals.inited);
	}
	
	if (Globals.havePlayerName == false) {
		Globals.havePlayerName = true; // don't force them twice or more
		Application.LoadLevel("player");
	}
	else {
		var wrigglyName : String = "cubeWriggly";
		var shiftyName : String = "cubeShifty";
		var scaleyName : String = "cubeScaley";
		
		var wrigglyOb : GameObject = gameObject.Find(wrigglyName);
		var shiftyOb : GameObject = gameObject.Find(shiftyName);
		var scaleyOb : GameObject = gameObject.Find(scaleyName);
		
		var aClip : AnimationClip = Anims.animRot(wrigglyOb, 1.0, 45, 90, 180, WrapMode.PingPong);
		var bClip : AnimationClip = Anims.animPos(shiftyOb, 0.5, 0.0, -0.2, 0.0, WrapMode.PingPong);
		var cClip : AnimationClip = Anims.animScale(scaleyOb, 2.0, 1.0, 0.0, 0.0, WrapMode.PingPong);
		
		aClip.name = wrigglyName;
		bClip.name = shiftyName;
		cClip.name = scaleyName;
		
		wrigglyOb.animation.AddClip(aClip, wrigglyName);
		shiftyOb.animation.AddClip(bClip, shiftyName);
		scaleyOb.animation.AddClip(cClip, scaleyName);
		
		wrigglyOb.animation.clip = aClip;
		shiftyOb.animation.clip = bClip;
		scaleyOb.animation.clip = cClip;
		
		wrigglyOb.animation.Play(wrigglyName);
		shiftyOb.animation.Play(shiftyName);
		scaleyOb.animation.Play(scaleyName);	
	}
}

//
// For reading clickable items such as menu cube
//
function Update() {
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
			
				print("Click menu object: " + target.name);
				
				if (target.name == "cubeWriggly") {
					Globals.currentGameLevel = 1;
					Application.LoadLevel("level1");
				}
				else if (target.name == "cubeShifty") {
					Globals.currentGameLevel = 2;
					Application.LoadLevel("level1");
				}
				else if (target.name == "cubeScaley") {
					Globals.currentGameLevel = 3;
					Application.LoadLevel("level1");
				}								
				else if (target.name == "uiPlayersMesh")
					Application.LoadLevel("player");
				else if (target.name == "uiSettingsMesh")
					Application.LoadLevel("settings");					
				else if (target.name == "uiInfoMesh")
					Application.LoadLevel("info");					
					
				
			} // raycast hit
			
		} // touchPhase == began
	} // tcount > 0
}

function createDiceDecoration(ob : GameObject) {
//	var aClip = new AnimationClip();
	
	var kfArray : Keyframe[] = new Keyframe[5];
	
	var obx : int = ob.transform.position.x;
	var oby : int = ob.transform.position.y;
	
	var aClip = Anims.animRot(ob, 1.0, 359, 720, -270, WrapMode.PingPong);
		
	/* set xpos keyframes */
	kfArray[0] = new Keyframe(0.0, obx - 3);
	kfArray[1] = new Keyframe(1.0, obx - 3);
	kfArray[2] = new Keyframe(2.0, obx + 3);
	kfArray[3] = new Keyframe(3.0, obx + 3);
	kfArray[4] = new Keyframe(4.0, obx - 3);
	
	var animCurveX : AnimationCurve = new AnimationCurve(kfArray);
	animCurveX.postWrapMode = WrapMode.Loop;
	
	aClip.SetCurve("", Transform, "localPosition.x", animCurveX);
	
	/* set ypos keyframes */
	kfArray[0] = new Keyframe(0.0, oby + 6);
	kfArray[1] = new Keyframe(1.0, oby - 10);
	kfArray[2] = new Keyframe(2.0, oby - 10);
	kfArray[3] = new Keyframe(3.0, oby + 6);
	kfArray[4] = new Keyframe(4.0, oby + 6);

	var animCurveY : AnimationCurve = new AnimationCurve(kfArray);
	animCurveY.postWrapMode = WrapMode.Loop;

	aClip.SetCurve("", Transform, "localPosition.y", animCurveY);		

    aClip.name = "MenuDisplay";
    ob.animation.AddClip(aClip, "MenuDisplay");
    
	ob.animation.clip = aClip;
	
    ob.animation.Play("MenuDisplay");		
}