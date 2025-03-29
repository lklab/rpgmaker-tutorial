/*:
 * @target MZ
 * @plugindesc 메시지 박스 커스텀
 * @author 아케나 공부
 *
 * @help CustomMessageBox.js
 */

Window_Message.prototype.startMessage = function() {
    const text = $gameMessage.allText();
    const textState = this.createTextState(text, 0, 0, 0);
    textState.x = this.newLineX(textState);
    textState.startX = textState.x;
    this._textState = textState;
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
    this._nameBoxWindow.start();
    $gameScreen.showPicture(
        1,
        'my_test/turtle',
        0,
        0, // x 위치
        450, // y 위치
        27.23631509, // 넓이
        27.23631509, // 높이
        255, // 불투명도
        0
    );
};

Window_Base.prototype.close = function() {
    if (!this.isClosed()) {
        $gameScreen.erasePicture(1);
        this._closing = true;
    }
    this._opening = false;
};

Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    this.setBackgroundType(2);
};
