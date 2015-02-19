//
// Attached to cube in menu scene
// Just decoration
//
var maxAngle : int = 360;
var inc : int = 0;
var basePosY : float;

var sin : float[] = new float[maxAngle];

function Start() {
	for (var i = 0; i < maxAngle; i++) {
		sin[i] = 4.0 * Mathf.Sin(Mathf.Deg2Rad * i);
	}
	basePosY = transform.position.y; 
}
	
function Update () {

	var t : float = Time.deltaTime;
	
    transform.Rotate(t * 100, 0, 0);
	transform.RotateAround (Vector3.zero, Vector3.up, 100 * t);

    transform.position.y = basePosY + sin[inc] * t;
    if (++inc >= maxAngle) 
    	inc = 0;

}