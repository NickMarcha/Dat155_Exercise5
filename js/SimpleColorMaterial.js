"use strict";

import {ShaderMaterial} from "./build/three.module.js";

//Egen-laget shader: extends ShaderMaterial, som gir oss en rekke forhåndsdefinerte uniform-variable og shader-funksjoner
export default class SimpleColorMaterial extends ShaderMaterial {
    constructor({
        //Kan kalle parameterne hva vi vil - her kalt 'xInParameters' for å tydeliggjøre skillet mellom parameter og uniform-variabel i shaderne
        //Bruker senere som verdier til uniform-variabler vi sender til shadere
        mapInParameters = null, //Tekstur
        colorInParameters = null //Farge som skal fargelegge videre
                }) {

        //Enkelt vertex-shader: Videresender teksturkoordinater
        //Merk at vi får projectionMatrix, modelViewMatrix og position uten å måtte opprette de, siden dette legges til av ShaderMaterial-klassen vi extender
        //Dokumentasjon for ShaderMaterial: https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial
        //Oversikt over attributter og uniformer vi får fra Three.js: https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram
        const vertexShader = `
            out vec2 vUv;
            
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        
        `

        //Enkel fragment-shader
        //Bruker uniform-variablene TextureInShader og colorInShader som vi oppretter i kallet på super()-constructor
        //Bruker shader-funksjonen texture() for å finne rett farge i teksturen ved hjelp av tekstur-koordinatene
        //Blander sammen fargen i teksturen med fargen vi har sendt inn i colorInShader
        const fragmentShader = `
            uniform sampler2D textureInShader;
            uniform vec3 colorInShader;
            
            in vec2 vUv;
            
            void main(){
                vec4 textureColor = texture(textureInShader, vUv);
                gl_FragColor = vec4(textureColor.xyz * colorInShader, 1.0);
            }
            
        
        `


        //Kall på constructor til ShaderMaterial
        //Trenger vertexShader og fragmentShader - vi sender så med navnene på uniform-variablene vi vil bruke i shader,
        //og hvilke verdier de skal ha - her tekstur og farge vi har sendt som parametere i constructoren til Materialet vårt
        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {

                textureInShader: {
                    value: mapInParameters
                },
                colorInShader: {
                    value: colorInParameters
                }
            }
        });
    }
}