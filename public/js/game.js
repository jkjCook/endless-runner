//FOR DEBUGGING
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Fog } from 'three';
import Light from './light';
import Tree from './tree';
import World from './world';

class Game {
  constructor(width, height, tree) {
    this.tree = tree;
    this.sceneWidth = width;
    this.sceneHeight = height;
  }

  createScene() {
    this.scene = new Scene();
    this.light = new Light(this.scene);
    this.fog = new Fog(0x333333, 30, 50);
    this.pos = { x: 0, y: 0, z: -180 };
    this.world = new World(this.scene, this.tree, this.pos);

    this.speed = 0.8;
    this.tracker = 0;

    this.camera = new PerspectiveCamera(60, this.sceneWidth / this.sceneHeight, 0.1, 1000);
    this.camera.position.z = 6.5;
    this.camera.position.y = 2.5;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);
    document.body.appendChild(this.renderer.domElement);
    document.onkeydown = this.handleKeyPress;
    document.onkeyup = this.handleKeyUp;
    this.scene.fog = this.fog;
    this.scene = this.light.renderLight();
    this.scene = this.world.renderWorld();

  }
  handleKeyUp = (event) => {
    if (event.keyCode == 37) {
      this.camera.rotation.z = 0;
    }
    else if (event.keyCode == 39) {
      this.camera.rotation.z = 0
    }
  }
  handleKeyPress = (event) => {
    if (event.keyCode == 37) {
      //this.camera.position.y = Math.random() * (3 - 2) + 2;
      this.camera.rotation.z = -0.1;
      if (this.camera.position.x < 20 && this.camera.position.x > -20)
        this.camera.position.x += -2;
      else
        this.camera.position.x += 1;
    }
    else if (event.keyCode == 39) {
      //this.camera.position.y = Math.random() * (3 - 2) + 2;
      this.camera.rotation.z = 0.1;
      if (this.camera.position.x < 20 && this.camera.position.x > -20)
        this.camera.position.x += 2;
      else
        this.camera.position.x += -1;

    }
  }
  update = () => {
    requestAnimationFrame(this.update);
    this.tracker += this.speed;
    this.world.world.position.z += this.speed;
    this.world.updateTreeLocation(this.speed, this.camera);
    if(this.tracker >= this.world.renderFloor){
      this.tracker = 0;
      this.world.world.position.set(this.pos.x, this.pos.y, -10);
    }
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.createScene();
    this.update();
  }

}

export default Game;
