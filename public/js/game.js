//FOR DEBUGGING
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Fog, Vector3, Clock } from 'three';
import { TweenLite } from 'gsap';
import Light from './light';
import Tree from './tree';
import World from './world';
import Player from './player';

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
  }

  createScene() {
    this.scene = new Scene();
    this.light = new Light(this.scene);
    this.fog = new Fog(0x333333, 30, 50);
    this.player = new Player(this.sceneWidth, this.sceneHeight);
    //this.controls = new OrbitControls( this.player.camera );
    this.speed = 0.2;

    this.tracker = 0;
    this.pos = { x: 0, y: 0, z: -180 };
    this.world1 = new World(this.scene, this.tree, this.pos);
    this.pos = { x: 0, y: 0, z: (-180 + -400) };
    this.world2 = new World(this.scene, this.tree, this.pos);
    this.worlds = [this.world1, this.world2];

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);

    document.body.appendChild(this.renderer.domElement);
    document.onkeydown = this.player.handleKeyPress;
    document.onkeyup = this.player.handleKeyUp;

    this.scene.fog = this.fog;
    this.scene = this.light.renderLight();
    this.scene = this.world1.renderWorld();
    this.scene = this.world2.renderWorld();
    this.addTreeArray();
    this.clock.start();

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
  //detects if tree has moved past the player or has collided with the player
  updateTreeLocation() {
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.z += this.speed;
      if (this.trees[i].position.z > this.player.camera.position.z - 0.5 &&
        this.trees[i].position.z < this.player.camera.position.z + 0.5 &&
        this.trees[i].position.x > this.player.camera.position.x - 0.5 &&
        this.trees[i].position.x < this.player.camera.position.x + 0.5)
        this.hit = true;
      if (this.trees[i].position.z >= this.player.camera.position.z) {
        this.trees[i].position.z = -200;
        this.trees[i].position.x = Math.random() * (15 - -15) + -15;
      }
    }
  }

  update = () => {
    //this.controls.update();
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
      this.player.move(this.delta);
    }
    else {
      //Add game over screen
    }
    this.renderer.render(this.scene, this.player.camera);

  }

  start() {
    this.createScene();
    this.update();
  }

}

export default Game;
