/*:
 * @target MZ
 * @plugindesc 아웃라인
 * @author 아웃라인
 *
 * @help Outline.js
 */

(() => {
    // OutlineFilter.js
    class OutlineFilter extends PIXI.Filter {
        constructor(outlineColor = [0, 0, 0, 1], outlineThickness = 1.0) {
            const fragment = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform vec4 outlineColor;
            uniform float thickness;
            uniform vec2 texelSize;

            void main(void) {
                float alpha = texture2D(uSampler, vTextureCoord).a;
                if (alpha >= 0.01) {
                    gl_FragColor = texture2D(uSampler, vTextureCoord);
                    return;
                }

                float maxAlpha = 0.0;
                for (int x = -1; x <= 1; x++) {
                    for (int y = -1; y <= 1; y++) {
                        if (x == 0 && y == 0) continue;
                        vec2 offset = vec2(float(x), float(y)) * texelSize * thickness;
                        float sampleAlpha = texture2D(uSampler, vTextureCoord + offset).a;
                        maxAlpha = max(maxAlpha, sampleAlpha);
                    }
                }

                if (maxAlpha > 0.01) {
                    gl_FragColor = outlineColor;
                } else {
                    gl_FragColor = vec4(0.0);
                }
            }
            `;
            const uniforms = {
                outlineColor: new Float32Array(outlineColor),  // [r, g, b, a]
                thickness: outlineThickness,
                texelSize: [1.0, 1.0]  // to be set based on texture size
            };
            super(null, fragment, uniforms);
        }

        apply(filterManager, input, output, clear) {
            this.uniforms.texelSize[0] = 1.0 / input.frame.width;
            this.uniforms.texelSize[1] = 1.0 / input.frame.height;            
            super.apply(filterManager, input, output, clear);
        }

        setColor(r, g, b, a = 1.0) {
            this.uniforms.outlineColor = new Float32Array([r, g, b, a]);
        }

        setThickness(value) {
            this.uniforms.thickness = value;
        }
    }

    class AnimatedOutlineFilter extends PIXI.Filter {
        constructor(color1 = [1, 0, 0, 1], color2 = [0, 0, 1, 1], thickness = 2.0) {
            const fragment = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;

            uniform vec4 color1;
            uniform vec4 color2;
            uniform float thickness;
            uniform vec2 texelSize;
            uniform float time;

            const float PI = 3.14159265359;

            void main(void) {
                float baseAlpha = texture2D(uSampler, vTextureCoord).a;
                if (baseAlpha >= 0.01) {
                    gl_FragColor = texture2D(uSampler, vTextureCoord);
                    return;
                }

                float maxAlpha = 0.0;
                for (int x = -1; x <= 1; x++) {
                    for (int y = -1; y <= 1; y++) {
                        if (x == 0 && y == 0) continue;
                        vec2 offset = vec2(float(x), float(y)) * texelSize * thickness;
                        float sampleAlpha = texture2D(uSampler, vTextureCoord + offset).a;
                        maxAlpha = max(maxAlpha, sampleAlpha);
                    }
                }

                if (maxAlpha > 0.01) {
                    float wave = sin((vTextureCoord.y + time * 0.8) * PI * 2.0); // 속도 및 주기 조절
                    float t = 0.5 + 0.5 * wave; // normalize to 0.0 - 1.0
                    vec4 gradientColor = mix(color1, color2, t);
                    gl_FragColor = gradientColor;
                } else {
                    gl_FragColor = vec4(0.0);
                }
            }
            `;
            super(null, fragment, {
                color1: new Float32Array(color1),
                color2: new Float32Array(color2),
                thickness: thickness,
                texelSize: [1.0, 1.0],
                time: 0.0
            });
            this._time = 0;
        }
    
        apply(filterManager, input, output, clear) {
            const frame = input.filterFrame || input.frame;
            this.uniforms.texelSize[0] = 1.0 / frame.width;
            this.uniforms.texelSize[1] = 1.0 / frame.height;
            this._time += 1.0 / 60.0; // assuming 60 FPS
            this.uniforms.time = this._time;
            super.apply(filterManager, input, output, clear);
        }
    
        setColors(c1, c2) {
            this.uniforms.color1 = new Float32Array(c1);
            this.uniforms.color2 = new Float32Array(c2);
        }
    
        setThickness(value) {
            this.uniforms.thickness = value;
        }
    }

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        // const sprite = $gameMap.event(12).getSprite();
        // sprite.filters = [new OutlineFilter([1.0, 0.0, 0.0, 1.0], 1.5)];
        
        const eventId = 22; // 예: ID가 3인 이벤트
        const character = $gameMap.event(eventId);
        
        // 이벤트에 대응하는 Sprite_Character 찾기
        const sprite = SceneManager._scene._spriteset._characterSprites.find(
            s => s._character === character
        );
        
        if (sprite) {
            // sprite.filters = [new OutlineFilter([1.0, 0.0, 0.0, 1.0], 1.0)];
            sprite.filters = [
                new AnimatedOutlineFilter(
                    [0.0, 0.6, 0.8, 1.0],
                    [0.4, 0.2, 0.7, 1.0],
                    1.0
                )
            ];
        } else {
            console.warn("해당 이벤트의 스프라이트를 찾을 수 없습니다.");
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        
        // const eventId = 12; // 예: ID가 3인 이벤트
        // const character = $gameMap.event(eventId);
        
        // // 이벤트에 대응하는 Sprite_Character 찾기
        // const sprite = SceneManager._scene._spriteset._characterSprites.find(
        //     s => s._character === character
        // );
        
        // if (sprite) {
        //     sprite.filters = [new OutlineFilter([1.0, 0.0, 0.0, 1.0], 2.0)];
        // } else {
        //     console.warn("해당 이벤트의 스프라이트를 찾을 수 없습니다.");
        // }
    };

})();
