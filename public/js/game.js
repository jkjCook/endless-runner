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
    this.trees = [];
    for (let i = 0; i < 20; i++) {
      this.trees.push(this.tree.clone());
    }
    this.sceneWidth = width;
    this.sceneHeight = height;
    this.clock = new Clock();
    this.keyDown = false;
    this.keyUp = false;
    this.hit = false;
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
    this.speed = 0.2;
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
    this.addTreeArray();
    this.clock.start();

  }
  removeTrees() {
    for (let i = 0; i < this.trees.length; i++) {
      this.scene.remove(this.trees[i]);
      this.trees[i] = undefined;
    }
  }

  addTreeArray() {
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.x = Math.floor(Math.random() * (8 - -8) + -8);
      this.trees[i].position.y = 1.6;
      this.trees[i].position.z = Math.floor(Math.random() * (2 - -300) + -300);
      console.log(this.trees[i].position);
      this.scene.add(this.trees[i]);
    }
  }

  updateTreeLocation() {
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.z += this.speed;
      if (this.trees[i].position.z > this.camera.position.z - 0.5 && this.trees[i].position.z < this.camera.position.z + 0.5 &&
        this.trees[i].position.x > this.camera.position.x - 0.5 && this.trees[i].position.x < this.camera.position.x + 0.5)
        this.hit = true;
      if (this.trees[i].position.z >= this.camera.position.z) {
        this.trees[i].position.z = -200;
        this.trees[i].position.x = Math.random() * (15 - -15) + -15;
      }
    }
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
    if (this.speed <= 2) this.speed += 0.00034;
    if (!this.hit) {
      requestAnimationFrame(this.update);
      this.delta = this.clock.getDelta();
      this.tracker += this.speed;
      this.worlds[0].world.position.z += this.speed;
      this.worlds[1].world.position.z += this.speed;
      this.updateTreeLocation();
      if (this.tracker >= this.world1.renderFloor) {
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

      if (this.keyDown) {
        let x;
        if (this.keyCode == 37) {
          TweenLite.to(this.camera.rotation, 0.5, { z: -0.2 });
          if (this.camera.position.x < 20 && this.camera.position.x > -20)
            x = this.camera.position.x + (this.delta * -250);
          else
            x = this.camera.position.x + (this.delta * 130);

          TweenLite.to(this.camera.position, 0.5, { x: x });
        }
        else if (this.keyCode == 39) {
          TweenLite.to(this.camera.rotation, 0.5, { z: 0.2 });
          if (this.camera.position.x < 20 && this.camera.position.x > -20)
            x = this.camera.position.x + (this.delta * 250);
          else
            x = this.camera.position.x + (this.delta * -130);

          TweenLite.to(this.camera.position, 0.5, { x: x });
        }
      }
      else if (this.keyUp) {
        if (this.keyCode == 37) {
          TweenLite.to(this.camera.rotation, 0.5, { z: 0 });
        }
        else if (this.keyCode == 39) {
          TweenLite.to(this.camera.rotation, 0.5, { z: 0 });
        }
      }
    }
    else {
      //Add game over screen
    }
    this.renderer.render(this.scene, this.camera);

  }

  start() {
    this.createScene();
    this.update();
  }

}

export default Game;
