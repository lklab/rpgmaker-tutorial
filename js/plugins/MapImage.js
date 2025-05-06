/*:
 * @target MZ
 * @plugindesc 맵상에 이미지 표시
 * @author 아케나 공부
 *
 * @help MapImage.js
 */

class Sprite_MapBoundImage extends Sprite {
    constructor(imageName, mapX, mapY, z) {
        super(ImageManager.loadPicture(imageName));
        this._mapX = mapX;
        this._mapY = mapY;
        this.anchor.set(0.5, 1);

        this.sizeX = 2;
        this.sizeY = 2;

        this.bitmap.addLoadListener(() => {
            this.scale.set(this.sizeX * $gameMap.tileWidth() / this.bitmap.width, this.sizeY * $gameMap.tileHeight() / this.bitmap.height)
        });
        this.z = z;
    }

    update() {
        super.update();
        const screenX = (this._mapX - $gameMap.displayX() + 0.5) * $gameMap.tileWidth();
        const screenY = (this._mapY - $gameMap.displayY() + this.sizeY * 0.5 + 0.5) * $gameMap.tileHeight();
        this.x = screenX;
        this.y = screenY;
    }
}

(() => {
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        // for (let i = 0; i < 5; ++i) {
        //     let z = 4 - i;
        //     const sprite = new Sprite_MapBoundImage('my_test/test_128', 17, 8 + i * 2, z >= 3 ? z + 1 : z);
        //     this._spriteset._tilemap.addChild(sprite);
        // }
        const sprite = new Sprite_MapBoundImage('my_test/test_128', 15, 9, 4.1);
        this._spriteset._tilemap.addChild(sprite);

        // 0.0-0.9 맵 바닥 타일만 가림
        // 1.0     보통 캐릭터의 아래 이벤트와 같은 레벨
        // 1.1-2.9 보통 캐릭터의 아래 이벤트를 가림
        // 3.0     플레이어와 같은 레벨
        // 3.1-3.9 플레이어를 가림
        // 4.0-4.9 아래로 통과 가능한 맵 타일을 가림
        // 5.0     보통 캐릭터의 위 이벤트와 같은 레벨
        // 5.1-    최상위

        // z 값이 같으면 Y 값이 큰게 위로 올라옴

        // if ($gameMap.mapId() === targetMapId) {
        //     const sprite = new Sprite(ImageManager.loadPicture(imageName));
        //     sprite.x = posX * $gameMap.tileWidth();
        //     sprite.y = posY * $gameMap.tileHeight();
        //     sprite.z = 1; // 플레이어보다 뒤

        //     // 스프라이트 타일맵에 붙이기 (플레이어와 같은 레이어)
        //     this._spriteset._tilemap.addChild(sprite);

        //     // 필요하면 글로벌 변수에 저장 (지우기용)
        //     $gameTemp._autoImageSprite = sprite;
        // }
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        _Scene_Map_terminate.call(this);
        console.log('_Scene_Map_terminate');
    };
})();
