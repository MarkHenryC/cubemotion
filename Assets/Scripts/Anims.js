static function createKeyframeCurve(animTime : float, frames : int, 
							start : float, span : float, 
							wMode : WrapMode) : AnimationCurve {
	
	var kfArray : Keyframe[] = new Keyframe[frames];
	var timeIncr : float = animTime / frames;
	var spanIncr : float = span / frames;
	
	for (var i = 0; i < frames; i++) {
		kfArray[i] = new Keyframe(start + i * timeIncr, i * spanIncr);
	}
	
	var animCurve : AnimationCurve = new AnimationCurve(kfArray);
	animCurve.postWrapMode = wMode;
	
	return animCurve;
}

static function createLinearCurve(startTime : float, startPos : float, 
							endTime : float, endPos : float, 
							wMode : WrapMode) : AnimationCurve {
	
	var animCurve : AnimationCurve = AnimationCurve.Linear(startTime, startPos, endTime, endPos);
	animCurve.postWrapMode = wMode;
	
	return animCurve;
}

static function animRot(obj : GameObject, fSecs : float, 
	xAngle : int, yAngle : int, zAngle : int, wMode : WrapMode) 
	: AnimationClip {
	
	print("Creating wriggly dice");
	
	var aClip = new AnimationClip();
	var eRotation = Quaternion.identity;
	var startRotation = Quaternion.identity;
	
	/* start from neg to positive in case of full 360 rot */
	var startXAngle = -(xAngle/2);
	var startYAngle = -(yAngle/2);
	var startZAngle = -(zAngle/2);
	
	eRotation.eulerAngles = Vector3(xAngle, yAngle, zAngle);
	startRotation.eulerAngles = Vector3(startXAngle, startYAngle, startZAngle);
	
	var xCurve = createLinearCurve(0.0, startRotation.x, 
		fSecs, eRotation.x, wMode);
		
	aClip.SetCurve("", Transform, "localRotation.x", xCurve);

	var yCurve = createLinearCurve(0.0, startRotation.y, 
		fSecs, eRotation.y, wMode);
		
	aClip.SetCurve("", Transform, "localRotation.y", yCurve);
	
	var zCurve = createLinearCurve(0.0, startRotation.z, 
		fSecs, eRotation.z, wMode);
		
	aClip.SetCurve("", Transform, "localRotation.z", zCurve);
	
	var wCurve = createLinearCurve(0.0, startRotation.w,
		fSecs, eRotation.w, wMode);
		
	aClip.SetCurve("", Transform, "localRotation.w", wCurve);
	
	return aClip;
}

static function animScale(obj : GameObject, fSecs : float, 
	xScale : float, yScale : float, zScale : float, wMode : WrapMode) 
	: AnimationClip {
	
	print("Creating scaley dice");
	
	var aClip = new AnimationClip();		
	
	var xCurve = createLinearCurve(0.0, obj.transform.localScale.x,
		fSecs, obj.transform.localScale.x + xScale, wMode);
		
	aClip.SetCurve("", Transform, "localScale.x", xCurve);
	
	var yCurve = createLinearCurve(0.0, obj.transform.localScale.y,
		fSecs, obj.transform.localScale.y + yScale, wMode);
		
	aClip.SetCurve("", Transform, "localScale.y", yCurve);
	
	var zCurve = createLinearCurve(0.0, obj.transform.localScale.z,
		fSecs, obj.transform.localScale.z + zScale, wMode);
		
	aClip.SetCurve("", Transform, "localScale.z", zCurve);	
	
	return aClip;
}

static function animPos(obj : GameObject, fSecs : float, 
	xPos : float, yPos : float, zPos : float, wMode : WrapMode) 
	: AnimationClip {
		
	var aClip = new AnimationClip();
	
	print("Creating shifty dice");

	var xCurve = createLinearCurve(0.0, obj.transform.position.x,  
		fSecs, obj.transform.position.x + xPos, wMode);	
		
	aClip.SetCurve("", Transform, "localPosition.x", xCurve);
	
	var yCurve = createLinearCurve(0.0, obj.transform.position.y, 
		fSecs, obj.transform.position.y + yPos, wMode);		
		
	aClip.SetCurve("", Transform, "localPosition.y", yCurve);
  
	var zCurve = createLinearCurve(0.0, obj.transform.position.z, 
		fSecs, obj.transform.position.z + zPos, wMode);	
		
	aClip.SetCurve("", Transform, "localPosition.z", zCurve);

	return aClip;
}