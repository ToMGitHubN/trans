# Transformの取得・変更を行うjQueryPlugins
対象に設定されているTransformの値を取得することができます。返り値はmatrixを元に計算しています。  
また、Transformの値を変更することができます。  
値の変更は、translateXのみを変更したり、現在の位置から数値分だけ移動することもできます。

---
### (使い方1) elementのtransform値を取得  
**(コード)**` $(element).trans();`  
引数を付けずに実行することで、現在のtransform値を取得することができます。  

**返り値**  
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

注意)  
返り値は、端数に誤差が生じます。

---
### (使い方2) elementのtransform値を設定する
**(コード)**` $(element).trans({key, value});`  
 引数を付けて実行することで、値を設定することができます。  
値は、複数設定可能です。返り値は、jqueryになります。

**引数のキー一覧**  
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

---
### 使用例

例1) #idのtranslateXを200pxに設定

(コード) `$("#id").trans({"x": 200});`

(結果) translate3d(100px, 50px, 0px) => translate3d(200px, 50px, 0px)


例2) #idのtranslateXを50px増やし、30deg回転を"transform 1s linear"で実行。同時にopacityを設定  
(コード)`var st_preTransf = $("#id").trans().support.transform;`  
(コード)`$("#id").trans({"addX": 200, "rotate": 30, "transition": st_preTransf + "  1s linear" }).css("opacity", 1);`

(結果) translate3d(100px, 50px, 0px)
        => transition:transform 1s linear; transform: translate3d(300px, 50px, 0px) rotateZ: 30deg; opacity: 1;
