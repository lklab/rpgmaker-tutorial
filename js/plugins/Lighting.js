/*:
 * @target MZ
 * @plugindesc 라이팅
 * @author 라이팅
 *
 * @help Lighting.js
 */

(() => {
    class LightingFilter extends PIXI.Filter {
        constructor() {
            const vertex = `
                attribute vec2 aVertexPosition;
                attribute vec2 aTextureCoord;
                uniform mat3 projectionMatrix;
                varying vec2 vTextureCoord;

                void main(void){
                    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                    vTextureCoord = aTextureCoord;
                }
            `

            const fragment = `
                precision mediump float;
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform sampler2D uLightMap;

                void main(void){
                    vec4 color = texture2D(uSampler, vTextureCoord);
                    vec4 light = texture2D(uLightMap, vTextureCoord);
                    light = mix(vec4(0.12, 0.18, 0.35, 1.0), light, light.a);
                    gl_FragColor = color * light;
                }
            `

            super(vertex, fragment, { uLightMap: PIXI.Texture.WHITE });
        }

        // apply(filterManager, input, output, clear) {
        //     this.uniforms.time += 1.0 / 60.0;
        //     super.apply(filterManager, input, output, clear);
        // }
    }

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        // create light map
        const width = Graphics.width;
        const height = Graphics.height;
        this._lightBitmap = new Bitmap(width, height);

        const baseTexture = this._lightBitmap._baseTexture;
        const texture = new PIXI.Texture(baseTexture);

        const filter = new LightingFilter();
        filter.uniforms.uLightMap = texture;

        // apply
        this._spriteset._tilemap.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
        this._spriteset._tilemap.filters = [filter];

        // create fireflies
        this._fireflies = [
            new Firefly(17, 19),
            new Firefly(19, 19),
            new Firefly(17, 21),
            new Firefly(15, 19),
            new Firefly(17, 17),
        ];

        // create lamps
        lamps = [];
        this._lamps = lamps;
        const lampBitmap = ImageManager.loadPicture('my_test/lamp');
        lampBitmap.addLoadListener(function() {
            lamps.push(new Lamp(13, 0, lampBitmap));
            lamps.push(new Lamp(17, 0, lampBitmap));
            lamps.push(new Lamp(13, 4, lampBitmap));
            lamps.push(new Lamp(17, 4, lampBitmap));
            lamps.push(new Lamp(13, 8, lampBitmap));
            lamps.push(new Lamp(17, 8, lampBitmap));
            lamps.push(new Lamp(13, 12, lampBitmap));
            lamps.push(new Lamp(17, 12, lampBitmap));
            lamps.push(new Lamp(13, 20, lampBitmap));
            lamps.push(new Lamp(17, 20, lampBitmap));
            lamps.push(new Lamp(13, 24, lampBitmap));
            lamps.push(new Lamp(17, 24, lampBitmap));
            lamps.push(new Lamp(13, 28, lampBitmap));
            lamps.push(new Lamp(17, 28, lampBitmap));
        });
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        const bitmap = this._lightBitmap;
        const context = bitmap._context;
        const t = performance.now() / 1000;

        bitmap.clear();

        // firefly
        const radius = $gameMap.tileWidth();
        for (let firefly of this._fireflies) {
            const pos = firefly.getPosition(t);
            // TODO: culling

            const gradient = context.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius);
            const ffcolor = firefly.getColor(t);
            gradient.addColorStop(0, ffcolor);
            gradient.addColorStop(0.3, ffcolor);
            gradient.addColorStop(1, firefly.getTransparentColor());
    
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            context.fill();
        }

        // lamp
        for (let lamp of this._lamps) {
            const pos = lamp.getPosition();

            // TODO culling
            bitmap.blt(lamp.bitmap, 0, 0, lamp.bitmap.width, lamp.bitmap.height, pos.x, pos.y);
        }

        bitmap._baseTexture.update();
    };

    class Firefly {
        constructor(mapX, mapY) {
            this.mapX = mapX;
            this.mapY = mapY;

            this.seedX = Math.random() * 10;
            this.seedY = Math.random() * 10;
            this.seedI = Math.random() * Math.PI * 2;
        }

        getPosition(t) {
            const posX = 0.5 * Math.sin(t * 0.7 + this.seedX) * Math.sin(t * 0.3 + this.seedY);
            const posY = 0.5 * Math.cos(t * 0.6 + this.seedY) * Math.sin(t * 0.4 + this.seedX);

            const x = (this.mapX - $gameMap.displayX() + 0.5 + posX * 3.0) * $gameMap.tileWidth();
            const y = (this.mapY - $gameMap.displayY() + 0.5 + posY * 3.0) * $gameMap.tileHeight();

            return { x, y };
        }

        getIntensity(t) {
            const min = 0.5;
            const max = 0.7;
            return Math.sin(t * 10.0 + this.seedI) * (max - min) * 0.5 + (max + min) * 0.5;
        }

        getColor(t) {
            return `rgba(255, 242, 180, ${this.getIntensity(t)})`;
        }

        getTransparentColor() {
            return `rgba(255, 242, 180, 0.0)`;
        }
    }

    class Lamp {
        constructor(mapX, mapY, bitmap) {
            this.mapX = mapX;
            this.mapY = mapY;
            this.bitmap = bitmap;
        }

        getPosition() {
            const x = (this.mapX - $gameMap.displayX()) * $gameMap.tileWidth();
            const y = (this.mapY - $gameMap.displayY()) * $gameMap.tileHeight();

            return { x, y };
        }
    }
})();
