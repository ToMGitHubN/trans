/*
 *Ver 0.5.0
 * jQueryPlugins
 * 対象domのTransformの取得・変更を行う
 */

 /*
 *案件別カスタム
 * なし
 */


/*
** 使用例 **


例) elementのtransform値を取得
(コード) $(element).trans();

返り値
x: number,// translateX
y: number,// translateY
z: number,// translateZ
rotateX: number,
rotateY: number,
rotateZ: number,// =rotate()
scaleX: number,
scaleY: number,
scaleZ: number,
support = {
  transition      : String, プレフィックスをつけた値(例) "transition", "WebkitTransition" ..
  transitionDelay : String,
  transform       : String,
  transformOrigin : String,
  filter          : String,
  bl_transform3d  : true// boolean: transform3D対応(true: 対応している)
}

注意) 返り値はmatrixを元に計算しているため、transformを設定していなくても出力される。
　　　ただし、端数に誤差が生じすることがある。

---------------------------------------------------------------


■値の設定を行う


$(element).trans({key, value});

key一覧
translateX, translateY, translateZ(単位 px)
rotate (=rotateZ),rotateX, rotateY, rotateZ(単位 deg)
scaleX, scaleY, scaleZ
scale: scaleX・scaleY両方を変更
x: translateX
y: translateY
z: translateZ
addX: translateXに加算
addY: translateYに加算
addZ: translateZに加算
addRotate: rotateZに加算
addRotateX: rotateXに加算
addRotateY: rotateYに加算
addRotateZ: rotateZに加算
addScale:　scaleX・scaleY両方に加算
addScaleX:　scaleXに加算
addScaleY:　scaleYに加算
addScaleZ:　scaleZに加算
transition

注意) 初期値となる項目は設定値ならない
     (例) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) => 実際の出力: ""

例) #idのtranslateXを200pxに設定

(コード) $("#id").trans({"x": 200});

(結果) translate3d(100px, 50px, 0px) => translate3d(200px, 50px, 0px)


例) #idのtranslateXを50px増やし、30deg回転を"transform 1s linear"で実行。同時にopacityを設定
(コード) var st_preTransf = $("#id").trans().support.transform;
        $("#id").trans({"addX": 200, "rotate": 30, "transition": st_preTransf + "  1s linear" }).css("opacity", 1);

(結果) translate3d(100px, 50px, 0px)
        => transition:transform 1s linear; transform: translate3d(300px, 50px, 0px) rotateZ: 30deg; opacity: 1;

*
*/

;(function($, win) {

'use strict';

/****************************** 0.初期化 ******************************/


var test_div = document.createElement("div");//css環境調査用のdivElement


/**
* サポートされいるcss
*/
var support = {
  transition      : "",// String: (例) "transition", "WebkitTransition" ..
  transitionDelay : "",// String
  transform       : "",// String
  transformOrigin : "",// String
  filter          : "",// String
  bl_transform3d  : true// boolean: transform3D対応(true: 対応している)
};


/**
* 対象のcss値にベンダープレフィックスが必要か調査し、必要ならプレフィックスをつけた値を返す
* @param {String} str_prop 確認対象となる文字列
* @return {String} 環境で使用可能なcss値
*/
function fun_getVendorPropertyName(str_prop) {

  if (str_prop in test_div.style) return str_prop;

  var prefixes = ["Moz", "Webkit", "O", "ms"];
  var str_prop_ = str_prop.charAt(0).toUpperCase() + str_prop.substr(1);
  var str_vendorProp = "";

  for (var i = 0; i < prefixes.length; i++) {

    str_vendorProp = prefixes[i] + str_prop_;
    if (str_vendorProp in test_div.style) { return str_vendorProp; }
  }
}

// ブラウザの状況に合わせたtransitionを設定
support.transition      = fun_getVendorPropertyName("transition");
support.transitionDelay = fun_getVendorPropertyName("transitionDelay");
support.transform       = fun_getVendorPropertyName("transform");
support.transformOrigin = fun_getVendorPropertyName("transformOrigin");
support.filter          = fun_getVendorPropertyName("Filter");

// boolean: transform3D対応状況フラグ
support.bl_transform3d   = (function() {

  test_div.style[support.transform] = "";
  test_div.style[support.transform] = "rotateY(90deg)";

  return test_div.style[support.transform] !== "";
})();



/*************************** 1. 関数部 ***************************/


/**
* 対象のmatrix値を取得する
* @param {Object} dom_target 抽出対象のDOMオブジェクト
* @return {Array} matrix値
*/
function fun_getMatrixArray(dom_target) {

  var obj_style = dom_target.currentStyle || document.defaultView.getComputedStyle(dom_target, "");
  var bl_mat3d = true;
  var ar_matrix = [ [], [], [], [] ];//返り値格納

  //対象のmatrix3dを抽出
  var str_mat = /matrix3d\((.*)\)/;
  var tmp_matrix = obj_style[support.transform].match(str_mat);

  if(tmp_matrix === null){

    // 対象のmatrix3dが存在しない時、matrixを抽出
    bl_mat3d = false;

    str_mat = /matrix\((.*)\)/;
    tmp_matrix = obj_style[support.transform].match(str_mat);
  }


  if(tmp_matrix === null){

    // matrixが存在しない時、"translate3d(0px, 0px, 0px) rotate(0deg) scale(1, 1)"のmatrixを返す
    ar_matrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    return ar_matrix;
  }

  //matrix 文字列を配列に変換
  tmp_matrix = tmp_matrix.slice(1)[0].split(",");
  for(var i = 0; i < tmp_matrix.length; i ++){

    tmp_matrix[i] = parseFloat(tmp_matrix[i], 10);
  }


  if(bl_mat3d === true){

    ar_matrix = [
      [ tmp_matrix[0],   tmp_matrix[1],  tmp_matrix[2],  tmp_matrix[3] ],
      [ tmp_matrix[4],   tmp_matrix[5],  tmp_matrix[6],  tmp_matrix[7] ],
      [ tmp_matrix[8],   tmp_matrix[9],  tmp_matrix[10], tmp_matrix[11] ],
      [ tmp_matrix[12],  tmp_matrix[13], tmp_matrix[14], tmp_matrix[15] ],
    ];

  }else {

    ar_matrix = [
      [ tmp_matrix[0], tmp_matrix[1], 0, 0 ],
      [ tmp_matrix[2], tmp_matrix[3], 0, 0 ],
      [ 0,             0,             1, 0 ],
      [ tmp_matrix[4], tmp_matrix[5], 0, 1 ]
    ];
  }


  return ar_matrix;
}


  /**
  * 対象のtransform値を取得する
  * @param {Object} dom_target 抽出対象のDOMオブジェクト
  * @return {Object} => {
  *    x(translateX): int,(単位: px)
  *    y(translateY): int,(単位: px)
  *    z(translateZ): int,(単位: px)
  *    rotateX: int,(単位: deg)
  *    rotateY: int,(単位: deg)
  *    rotateZ: int,(単位: deg)
  *    scaleX: int
  *    scaleY: int
  *    scaleZ: int
  *   }
  */
  function fun_getTransform(dom_target){

    // 対象のmatrix3dを2次元配列で取得
    var ar_matrix = fun_getMatrixArray(dom_target);


    var tmp_rotationX = Math.atan2(ar_matrix[1][2], ar_matrix[2][2]);
		var tmp_rotationY = Math.asin(ar_matrix[0][2] * -1);
		var tmp_rotationZ = Math.atan2(ar_matrix[0][1], ar_matrix[0][0]);

    // -0は0に置き換える(判定式が0/-0ともにtrueとなるが問題ないため、省略)
    if( tmp_rotationX === -0 ){ tmp_rotationX = 0 }
    if( tmp_rotationY === -0 ){ tmp_rotationY = 0 }
    if( tmp_rotationZ === -0 ){ tmp_rotationZ = 0 }

		if( Math.cos(tmp_rotationY) === 0 ){

			tmp_rotationX = Math.atan2( ar_matrix[2][0] * -1, ar_matrix[1][1]);
			tmp_rotationZ = 0;

		}


    var obj_trasF = {
      x: ar_matrix[3][0],// translateX
      y: ar_matrix[3][1],// translateY
      z: ar_matrix[3][2],// translateZ
      rotateX: tmp_rotationX * 180 / Math.PI,
      rotateY: tmp_rotationY * 180 / Math.PI,
      rotateZ: tmp_rotationZ * 180 / Math.PI,
      scaleX: Math.sqrt(ar_matrix[0][0] * ar_matrix[0][0] + ar_matrix[0][1] * ar_matrix[0][1] + ar_matrix[0][2] * ar_matrix[0][2] ),
			scaleY: Math.sqrt(ar_matrix[1][0] * ar_matrix[1][0] + ar_matrix[1][1] * ar_matrix[1][1] + ar_matrix[1][2] * ar_matrix[1][2] ),
			scaleZ: Math.sqrt(ar_matrix[2][0] * ar_matrix[2][0] + ar_matrix[2][1] * ar_matrix[2][1] + ar_matrix[2][2] * ar_matrix[2][2] )
    };


    // @test code
    // console.log(
    //     "translate3d(" + obj_trasF.x + "px," + obj_trasF.y + "px," + obj_trasF.z + "px) " +
    //     "rotateX(" + obj_trasF.rotateX + "deg) rotateY(" + obj_trasF.rotateY + "deg) rotateZ( " + obj_trasF.rotateZ + "deg)" +
    //     "scale3d(" + obj_trasF.scaleX + ", " + obj_trasF.scaleY + ", " + obj_trasF.scaleZ + " )" );


    return obj_trasF;
  }


/**
* ユーザの入力値に対応するTransform値の変更
* @param {Object}          obj_transVal Transform値
* @param {String}          str_key      変更対象
* @param {number | String} value        適用値
*/
function fun_setTransformValue(obj_transVal, str_key ,value){

  var val = parseFloat(value, 10);

  switch (str_key) {
    case "translateX":
      obj_transVal.x = val;
      break;
    case "translateY":
      obj_transVal.y = val;
      break;
    case "translateZ":
      obj_transVal.z = val;
      break;
    case "rotate":
      obj_transVal.rotateZ = val;
      break;
    case "scale":
      obj_transVal.scaleX = val;
      obj_transVal.scaleY = val;
      break;
    case "addX":
      obj_transVal.x += val;
      break;
    case "addY":
      obj_transVal.y += val;
      break;
    case "addZ":
      obj_transVal.z += val;
      break;
    case "addRotate":
      obj_transVal.rotateZ += val;
      break;
    case "addRotateX":
      obj_transVal.rotateX += val;
      break;
    case "addRotateY":
      obj_transVal.rotateY += val;
      break;
    case "addRotateZ":
      obj_transVal.rotateZ += val;
      break;
    case "addScaleX":
      obj_transVal.scaleX += val;
      break;
    case "addScale":
      obj_transVal.scaleX += val;
      obj_transVal.scaleY += val;
      break;
    case "addScaleY":
      obj_transVal.scaleY += val;
      break;
    case "addScaleZ":
      obj_transVal.scaleZ += val;
      break;
    default:
      obj_transVal[str_key] = val;
  }

}


/**
* Object形式を文字形式のCSS Transform形式に変換する
* @param  {Object} obj_transVal Transform値
* @return {String} CSS Transform形式
*/
function fun_toStringCssTransformHuman(obj_transVal){

  var ar_transform = [];

  // translate系 {{
  if( (obj_transVal.x === 0 &&  obj_transVal.y === 0 && obj_transVal.z === 0) === false ){


    if( support.bl_transform3d === true ){

      ar_transform.push( "translate3d(" );

    }else{

      ar_transform.push( "translate(" );
    }


    ar_transform.push( obj_transVal.x + "px," );
    ar_transform.push( obj_transVal.y + "px" );

    if( support.bl_transform3d === true ){

      ar_transform.push( ar_transform.pop() + "," );
      ar_transform.push( obj_transVal.z + "px)" );

    }else {
      ar_transform.push( ") " );
    }

  }
  // translate系 }}


  // rotate系 {{
  if( obj_transVal.rotateX !== 0 ){

    ar_transform.push( "rotateX(" + obj_transVal.rotateX + "deg)" );
  }

  if( obj_transVal.rotateY !== 0 ){

    ar_transform.push( "rotateY(" + obj_transVal.rotateY + "deg)" );
  }

  if( obj_transVal.rotateZ !== 0 ){

    ar_transform.push( "rotateZ(" + obj_transVal.rotateZ + "deg)" );
  }
  // rotate系 }}


  // scale系 {{
  if( (obj_transVal.scaleX === 1 &&  obj_transVal.scaleY === 1 && obj_transVal.scaleZ === 1) === false ){

    if( obj_transVal.scaleZ === 1 || support.bl_transform3d === false ){

      if( obj_transVal.scaleX === obj_transVal.scaleY ){

        ar_transform.push( "scale(" + obj_transVal.scaleX + ")" );
      }else{

        ar_transform.push( "scale(" + obj_transVal.scaleX + ", " + obj_transVal.scaleY + ")" );
      }

    }else {
      ar_transform.push( "scale3d(" + obj_transVal.scaleX + ", " + obj_transVal.scaleY + ", " + obj_transVal.scaleZ + ")" );
    }

  }
  // scale系 }}

  return ar_transform.join(" ");
}



/*************************** 2.jQueryプラグイン設定 ***************************/


/**
* jQueryプラグイン設定
* 対象domのTransformの取得・変更を行う
* @param  {Object | String}  operation 変更するTransform・Transition値
* @return {Object | jQuery}  Objectの場合 対象のTransform情報
*　　　　　　　　　　　　　　　  jQueryの場合 thisが返される
*/
$.fn.trans= function(operation, option) {

  var obj_targetTransform = {};


  if( operation === undefined )  {

    var dom_taget = $(this).get(0);

    obj_targetTransform = fun_getTransform(dom_taget);
    obj_targetTransform.support = support;

    // 対象DOM　及び　Transform系の環境情報を返す
    return $.extend(true, {}, obj_targetTransform);

  }


  //Transformを適用するkey
  var ar_transformFilter = [
    "translateX", "translateY", "translateZ",
    "rotate",     "rotateX",    "rotateY",    "rotateZ",
    "scale",      "scaleX",     "scaleY",     "scaleZ",
    "x",          "y",          "z",
    "addX",       "addY",       "addZ",
    "addRotate",  "addRotateX", "addRotateY", "addRotateZ",
    "addScale",   "addScaleX",  "addScaleY",  "addScaleZ"
  ];

  $(this).each(function(index, dom_taget){
    //各domへ値を適用していく

    obj_targetTransform = fun_getTransform(dom_taget);

    if(typeof operation === "object"){

      $.each(operation, function(key, val){

        if( ar_transformFilter.indexOf(key) !== -1 ){
          //Transform値の変更

          //obj_targetTransformの変更
          fun_setTransformValue(obj_targetTransform, key, val);

        }else if(key === "transition"){

          // transition適用
          $(dom_taget).css(support.transition, val);
        }

      });
    }


    // transform適用
    $(dom_taget).css(support.transform, fun_toStringCssTransformHuman(obj_targetTransform) );

  });


  return this;
};

})(jQuery, window);
