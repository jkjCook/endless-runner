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
    this.fog = new Fog(0x333333, 50, 200);
    this.pos = { x: 0, y: 0, z: -180 };
    this.world1 = new World(this.scene, this.tree, this.pos);
    this.pos.z *= 3;
    this.world2 = new World(this.scene, this.tree, this.pos);
    this.worlds = [this.world1, this.world2];

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
    this.scene = this.worlds[0].renderWorld();
    this.scene = this.worlds[1].renderWorld();

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
      this.camera.position.y = Math.random() * (3 - 2) + 2;
      this.camera.rotation.z = -0.1;
      if (this.camera.position.x < 20 && this.camera.position.x > -20)
        this.camera.position.x += -2;
      else
        this.camera.position.x += 1;
    }
    else if (event.keyCode == 39) {
      this.camera.position.y = Math.random() * (3 - 2) + 2;
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
    this.worlds[0].world.position.z += this.speed;
    this.worlds[1].world.position.z += this.speed;
    this.worlds[0].updateTreeLocation(this.speed, this.camera);
    this.worlds[1].updateTreeLocation(this.speed, this.camera);
    if (this.tracker >= 400) {
      this.tracker = 0;
      this.pos.z = -350;
      let temp = new World(this.scene, this.tree, this.pos);
      temp.renderWorld();
      this.worlds.push(temp);
    }
    if (this.worlds.length > 2) {
      this.worlds[0].removeWorld();
      this.worlds.shift();
    }
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.createScene();
    this.update();
  }

}

export default Game;
