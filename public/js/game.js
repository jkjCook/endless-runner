//FOR DEBUGGING
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Fog, Vector3, Clock } from 'three';
import { TweenLite } from 'gsap';
import Light from './light';
import Tree from './tree';
import World from './world';

class Game {
  constructor(width, height, tree) {
    this.tree = tree;
    this.sceneWidth = width;
    this.sceneHeight = height;
    this.clock = new Clock();
    this.keyDown = false;
    this.keyUp = false;
  }

  createScene() {
    this.scene = new Scene();
    this.light = new Light(this.scene);
    this.fog = new Fog(0x333333, 30, 50);
    this.pos = { x: 0, y: 0, z: -180 };
    this.world1 = new World(this.scene, this.tree, this.pos);
    this.pos = { x: 0, y: 0, z: (-180 + -400) };
    this.world2 = new World(this.scene, this.tree, this.pos);
    this.worlds = [this.world1, this.world2];
    this.speed = 0.8;
    this.tracker = 0;

    this.camera = new PerspectiveCamera(60, this.sceneWidth / this.sceneHeight, 0.1, 1000);
    this.camera.position.z = 6.5;
    this.camera.position.y = 1.8;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);
    document.body.appendChild(this.renderer.domElement);
    document.onkeydown = this.handleKeyPress;
    document.onkeyup = this.handleKeyUp;
    this.scene.fog = this.fog;
    this.scene = this.light.renderLight();
    this.scene = this.world1.renderWorld();
    this.scene = this.world2.renderWorld();
    this.clock.start();

  }
  handleKeyUp = (event) => {
    this.keyUp = true;
    this.keyDown = false;
    this.keyCode = event.keyCode;
  }
  handleKeyPress = (event) => {
    this.keyDown = true;
    this.keyUp = false;
    this.keyCode = event.keyCode;
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.delta = this.clock.getDelta();
    this.tracker += this.speed;
    this.worlds[0].world.position.z += this.speed;
    this.worlds[0].updateTreeLocation(this.speed, this.camera);
    this.worlds[1].world.position.z += this.speed;
    this.worlds[1].updateTreeLocation(this.speed, this.camera);
    if (this.tracker >= this.world1.renderFloor) {
      this.pos.z = this.worlds[1].world.position.z;
      let temp = new World(this.scene, this.tree, this.pos);
      this.worlds.push(temp);
      this.tracker = 0;
    }
    if(this.worlds.length > 2) {
      this.worlds[0].removeWorld();
      this.worlds.shift();
    }

    if (this.keyDown) {
      let x;
      if (this.keyCode == 37) {
        TweenLite.to(this.camera.rotation, 0.5, {z: -0.2});
        if (this.camera.position.x < 20 && this.camera.position.x > -20)
          x = this.camera.position.x + (this.delta * -250);
        else
          x = this.camera.position.x + (this.delta * 130);

        TweenLite.to(this.camera.position, 0.5, { x: x });
      }
      else if (this.keyCode == 39) {
        TweenLite.to(this.camera.rotation, 0.5, {z: 0.2});
        if (this.camera.position.x < 20 && this.camera.position.x > -20)
          x = this.camera.position.x + (this.delta * 250);
        else
          x = this.camera.position.x + (this.delta * -130);

        TweenLite.to(this.camera.position, 0.5, { x: x });
      }
    }
    else if (this.keyUp) {
      if (this.keyCode == 37) {
        TweenLite.to(this.camera.rotation, 0.5, {z: 0});
      }
      else if (this.keyCode == 39) {
        TweenLite.to(this.camera.rotation, 0.5, {z: 0});
      }
    }
    this.renderer.render(this.scene, this.camera);

  }

  start() {
    this.createScene();
    this.update();
  }

}

export default Game;
