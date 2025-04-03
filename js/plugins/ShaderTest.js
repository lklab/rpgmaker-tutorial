/*:
 * @target MZ
 * @plugindesc 쉐이더 공부
 * @author 공부다
 *
 * @help ShaderTest.js
 */

(() => {
    class WaveFilter extends PIXI.Filter {
        constructor() {
            const fragment = `
                precision mediump float;
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform float time;

                void main(void) {
                    vec2 uv = vTextureCoord;
                    uv.y += sin(uv.x * 10.0 + time * 2.0) * 0.02;
                    gl_FragColor = texture2D(uSampler, uv);
                }
            `;
            super(undefined, fragment, { time: 0 });
            this._time = 0;
        }

        apply(filterManager, input, output, clear) {
            this._time += 0.016;
            this.uniforms.time = this._time;
            super.apply(filterManager, input, output, clear);
        }
    }

    // const TARGET_X = 12;
    // const TARGET_Y = 8;
    // const TARGET_LAYER = 3; // 0 = 아래 레이어 (A타일), 1+ = 위쪽

    // const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    // Spriteset_Map.prototype.createLowerLayer = function () {
    //     _Spriteset_Map_createLowerLayer.call(this);

    //     const tileWidth = $gameMap.tileWidth();
    //     const tileHeight = $gameMap.tileHeight();

    //     // 타일 ID 가져오기
    //     const tileId = $gameMap.tileId(TARGET_X, TARGET_Y, TARGET_LAYER);
    //     if (tileId === 0) {
    //         console.log('@@@ 없음!');
    //         return;
    //     } else {
    //         console.log(`tileId=${tileId}`);
    //     }

    //     const tileset = $gameMap.tileset();
    //     const tilesetImage = tileset.tilesetNames[5]; // A타일셋
    //     const bitmap = ImageManager.loadTileset(tilesetImage);

    //     bitmap.addLoadListener(() => {
    //         const sprite = new Sprite(bitmap);

    //         // A1~A4 타일의 경우 복잡할 수 있지만, 기본적으로 8x6 그리드 기준으로 자른다
    //         // const sx = (tileId % 16) * tileWidth;
    //         // const sy = Math.floor(tileId / 16) * tileHeight;
    //         if (tileId >= 128) {
    //             tileId -= 128;
    //         }
    //         const sx = (tileId % 16) * tileWidth;
    //         const sy = Math.floor(tileId / 16) * tileHeight;

    //         sprite.setFrame(13 * tileWidth, 2 * tileHeight, tileWidth, tileHeight);
    //         sprite.x = 0; //TARGET_X * tileWidth;
    //         sprite.y = 0; //TARGET_Y * tileHeight;
    //         sprite.filters = [new WaveFilter()];

    //         this._tilemap.addChild(sprite);
    //     });
    // };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        const filter = new PIXI.filters.ColorMatrixFilter();
        filter.brightness(0.6); // 어둡게 만들기

        // 화면 전체에 적용
        // SceneManager._scene.filters = [filter];

        // 윈도우 제외하고 적용 (배치한 이미지는 적용됨)
        // this.children[0].filters = [filter];

        // 타일맵에만 적용 (배치한 이미지는 적용안됨)
        this._spriteset._tilemap.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
        this._spriteset._tilemap.filters = [filter];
    };
})();
