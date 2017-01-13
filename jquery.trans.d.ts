// Type definitions for jQuery.trans.js 0.5.0

/// <reference path="./jquery.d.ts"/>



// trans //////////////////////////////////////////////////

interface JQueryTrans_transformSet{
	translateX? : number;
	translateY? : number;
	translateZ? : number;
	rotate? : number;
	rotateX? : number;
	rotateY? : number;
	rotateZ? : number;
	scale? : number;
	scaleX? : number;
	scaleY? : number;
	scaleZ? : number;
	x? : number;/** translateXの別名 */
	y? : number;/** translateYの別名 */
	z? : number;/** translateZの別名 */

	/* 現在の位置に対して加算する */
	addX? : number;
	addY? : number;
	addZ? : number;
	addRotate? : number;
	addRotateX? : number;
	addRotateY? : number;
	addRotateZ? : number;
	addScale? : number;
	addScaleX? : number;
	addScaleY? : number;
	addScaleZ? : number;
}


////////////////////////////////////////////////////////////////////////////////////////////////////

interface JQuery {
		trans(): String;
		trans(transform: JQueryTrans_transformSet): JQuery;
		trans(key: String, value: String): JQuery;
}
