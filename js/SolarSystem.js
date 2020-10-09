"use strict";

import {
    AmbientLight, Color,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D, PointLight, Sphere,
    SphereGeometry,
    TextureLoader
} from "./build/three.module.js";
import SimpleColorMaterial from "./SimpleColorMaterial.js";

export default class SolarSystem{
    //Bruker solsystemets constructor for å sette opp planetene. Tar inn Three.js sin scene som parameter, siden vi må legge objekter til i denne
    constructor(scene) {
        //En mesh trenger Geometry (bufferdata, transformasjoner - hvor ligger verticene våre) og Material (hvordan skal objektet fargelegges)

        //Variabler for å opprette geometrien til en kule
        //Se https://threejs.org/docs/index.html#api/en/geometries/SphereGeometry for effekten av width- og heightSegments (åpne Controls oppe til høyre i sphere-vinduet)
        let radius = 5;
        let widthSegments = 64;
        let heightSegments = 64;

        //Opprett geometri for solen vår
        let sunGeometry = new SphereGeometry(radius, widthSegments, heightSegments);

        //Opprett materiale som bestemmer hvordan solen skal fargelegges
        let sunTextureUrl = 'assets/texture_sun.jpg'; //Hvor ligger teksturen?
        let sunTexture = new TextureLoader().load(sunTextureUrl); //Bruker Three.js sin TextureLoader for å laste inn teksturen
        //Opprett en instans av Three.js sin MeshBasicMaterial - et enkelt materiale som ikke tar hensyn til lys
        //(Kommentert ut siden vi heller vil bruke vår egen-lagde shader)
        //let sunMaterial = new MeshBasicMaterial({map: sunTexture});

        //Opprett en instans av vårt egen-lagde Material
        //Parametere: tekstur, og en Three.js Color som skal brukes for å farge teksturen mer - her for å farge den rødt
        let sunMaterial = new SimpleColorMaterial({
            mapInParameters: sunTexture,
            colorInParameters: new Color(0xFF0000)
        })

        //Oppretter selve sol-Meshen, som nå består av et Geometry-objekt og et Material-objekt
        this.sun = new Mesh(sunGeometry, sunMaterial);

        //Legge solen til scenen
        scene.add(this.sun);

        //Legger det usynlige objektet som barn av solen

        this.earthOrbitNode = this.createOrbitNode();
        this.sun.add(this.earthOrbitNode);

        let earthMaterial = this.createMaterial('assets/texture_earth.jpg',"assets/earthspec1k.jpg","assets/2k_earth_normal_map.png");

        this.earth = this.createPlanetMesh(earthMaterial,2.5);

        //Legger jorden som barn av earthOrbitNode - this.earth arver nå rotasjoner som gjøres på this.earthOrbitNode
        this.earthOrbitNode.add(this.earth);

        //Flytter jorden litt til høyre for solen
        this.earth.position.x = 15;

        //Legger shrek som barn av solen

        this.shrekOrbitNode = this.createOrbitNode();
        this.sun.add(this.shrekOrbitNode);

        let shrekMaterial = this.createMaterial('assets/shrek.jpg',"assets/earthspec1k.jpg","assets/2k_earth_normal_map.png");

        this.shrekPlanet = this.createPlanetMesh(shrekMaterial,2.5);


        this.shrekOrbitNode.add(this.shrekPlanet);

        this.shrekPlanet.position.x = -15;

        //Legger donkey som barn av shrek

        this.donkeyOrbitNode = this.createOrbitNode();
        this.shrekPlanet.add(this.donkeyOrbitNode);

        let donkeyMaterial = this.createMaterial('assets/donkey.png',"assets/earthspec1k.jpg","assets/2k_earth_normal_map.png");

        this.donkeyMoon = this.createPlanetMesh(donkeyMaterial,1);

        this.donkeyOrbitNode.add(this.donkeyMoon);

        //Flytter jorden litt til venstre for solen
        this.donkeyMoon.position.x = 5;

        //Det nye Materialet forholder seg til lys, og vil være helt svart.
        //Legger derfor til lys i scenen - PointLight lyser i alle retninger rundt seg
        this.sunLight = new PointLight(0xffffff, 3);
        //Legger lyset som barn av solen
        this.sun.add(this.sunLight);

        //Legger til et mykere AmbientLight for å representere bakgrunnsbelysning - gjør at vi såvidt kan se baksiden av jorden vår
        this.ambientLight = new AmbientLight(0xffffff, 0.4);
        scene.add(this.ambientLight); //Legg bakgrunnslyset til i scenen.

    }



    createOrbitNode(){
        //Oppretter et usynlig Object3D som jorden vår skal rotere rundt.
        let orbitNode = new Object3D();
        return orbitNode;
    }
    createMaterial(textureUrl,specularMapUrl, normalMapUrl){
        let texture = new TextureLoader().load(textureUrl);

        //Fikk ikke gjort på forelesning:
        //Bruk av Specular Map - definerer hvor "shiny" forskjellige områder på objektet skal være
        //Bruk av Normal Map - Lager illusjon av høyde og dybde ved at en tekstur brukes for å definere endringer i normalene over objektet
        let specularMap = new TextureLoader().load(specularMapUrl);
        let normalMap = new TextureLoader().load(normalMapUrl);

        //Bruker her MeshPhongMaterial - litt mer avansert Material som forholder seg til lys
        let material = new MeshPhongMaterial({map:texture,
            shininess:1.0,
            specular: specularMap,
            normalMap: normalMap
        });

        return material;
    }
    createPlanetMesh(material, radius = 5,
    widthSegments = 64,
    heightSegments = 64){
        //Samme prosedyre for jorden vår
        //Last inn tekstur og gi denne til et Material

        //Forandrer radius - gjør jorden halvparten så stor som solen
        let geometry = new SphereGeometry(radius, widthSegments, heightSegments);

        //Oppretter Mesh for jorden ved å gi Geometry og Material
        return new Mesh(geometry, material);
    }

    animate(){
        //Når App-klassen ber solsystemet om å animere seg: roter planetene
        this.rotateObject(this.sun, [0.0, 0.005, 0.0]);
        this.rotateObject(this.earthOrbitNode, [0.0, 0.01, 0.0]);
        this.rotateObject(this.earth, [0.0, 0.02, 0.0]);

        this.rotateObject(this.shrekOrbitNode, [0.0, 0.01, 0.0]);
        this.rotateObject(this.shrekPlanet, [0.0, 0.02, 0.0]);

        this.rotateObject(this.donkeyMoon, [0.0, -0.2, 0.0]);
    }

    rotateObject(object, rotation){
        //Hjelpe-metode for å rotere et objekt
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }

}