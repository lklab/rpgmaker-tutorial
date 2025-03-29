/*:
 * @target MZ
 * @plugindesc 골드 윈도우 표시
 * @author 아케나 공부
 *
 * @help CustomGoldWindow.js
 */

function Custom_GoldWindow() {
    this.initialize(...arguments);
}

Custom_GoldWindow.prototype = Object.create(Window_Base.prototype);
Custom_GoldWindow.prototype.constructor = Custom_GoldWindow;

Custom_GoldWindow.prototype.initialize = function(rect) {
     Window_Base.prototype.initialize.call(this ,rect);
};

Custom_GoldWindow.prototype.update = function(){
    this.contents.clear();
    this.drawIcon(160,0,0);
    this.drawText($gameParty.gold(),65,0);
}

var smstart = Scene_Map.prototype.start;

Scene_Map.prototype.start = function(){
    smstart.apply(this, arguments);
    var rect = new Rectangle(0, 0, 200, 60)
    var goldWindow = new Custom_GoldWindow(rect);
    this.addChild(goldWindow);
}
