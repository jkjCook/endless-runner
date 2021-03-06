//FOR DEBUGGING
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Fog,
  Vector3, Clock, SphereGeometry, MeshLambertMaterial, Mesh } from 'three';
import { TweenLite } from 'gsap';
import Light from './light';
import Tree from './tree';
import World from './world';
import Player from './player';
import Gem from './gem';
import Sound from './sound';

class Game {
  constructor(width, height, tree) {
    this.tree = tree;
    this.trees = [];
    this.bounderyTrees = [];
    this.sceneWidth = width;
    this.sceneHeight = height;
    this.clock = new Clock();
    this.sound = new Sound();
    for (let i = 0; i < 200; i++) {
      if (i < 20) this.trees.push(this.tree.clone());
      this.bounderyTrees.push(this.tree.clone());
    }

  }

  createScene() {
    this.scene = new Scene();
    this.light = new Light(this.scene);
    this.fog = new Fog(0x333333, 30, 50);
    this.player = new Player(this.sceneWidth, this.sceneHeight);
    //this.controls = new OrbitControls(this.player.camera);
    this.gem = new Gem(this.scene);
    this.speed = 0.2;
    this.score = 0;
    this.tracker = 0;
    this.pos = { x: 0, y: 0, z: -180 };
    this.world1 = new World(this.scene, this.tree, this.pos);
    this.pos.z = (-180 + -400);
    this.world2 = new World(this.scene, this.tree, this.pos);
    this.worlds = [this.world1, this.world2];
    this.domScore = document.getElementById('score');
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);

    this.scene.fog = this.fog;
    this.scene.add(this.sky);
    this.scene = this.light.renderLight();
    this.scene = this.world1.renderWorld();
    this.scene = this.world2.renderWorld();
    this.scene = this.gem.addGem();
    this.addTreeArray();
    this.clock.start();

    document.body.appendChild(this.renderer.domElement);
    document.onkeydown = this.player.handleKeyPress;
    document.onkeyup = this.player.handleKeyUp;
  }

  addTreeArray() {
    for(let i = 0; i < this.bounderyTrees.length; i++) {
      if(i % 2 == 0)
        this.bounderyTrees[i].position.x = 13;
      else
        this.bounderyTrees[i].position.x = -13;
      this.bounderyTrees[i].position.y = 1.6;
      this.bounderyTrees[i].position.z = -(i - 8);
      this.scene.add(this.bounderyTrees[i]);
    }
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.x = Math.floor(Math.random() * (8 - -8) + -8);
      this.trees[i].position.y = 1.6;
      this.trees[i].position.z = Math.floor(Math.random() * (2 - -300) + -300);
      this.scene.add(this.trees[i]);
    }
  }

  updateGemLocation() {
    if (this.gem.gem.position.y > 2)
      this.gem.up = false;
    else if (this.gem.gem.position.y < 1.3)
      this.gem.up = true;
    if (this.gem.up)
      this.gem.gem.position.y += 0.002;
    else
      this.gem.gem.position.y -= 0.002;
    this.gem.gem.position.z += this.speed;
    if (this.gem.gem.position.z > this.player.camera.position.z - 1 &&
      this.gem.gem.position.z < this.player.camera.position.z + 1 &&
      this.gem.gem.position.x > this.player.camera.position.x - 1 &&
      this.gem.gem.position.x < this.player.camera.position.x + 1) {
      this.score += 1;
      this.gem.gem.position.z = -200;
      this.gem.gem.position.x = Math.random() * (10 - -10) + -10;
      this.sound.collect.play();
    }
    if (this.gem.gem.position.z >= this.player.camera.position.z) {
      this.gem.gem.position.z = -200;
      this.gem.gem.position.x = Math.random() * (10 - -10) + -10;
    }
  }
  //detects if tree has moved past the player or has collided with the player
  updateTreeLocation() {
    for(let i = 0; i < this.bounderyTrees.length; i++) {
      if (this.bounderyTrees[i].position.z >= this.player.camera.position.z) {
        this.bounderyTrees[i].position.z = -190;
      }
      this.bounderyTrees[i].position.z += this.speed;
    }
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.z += this.speed;
      if (this.trees[i].position.z > this.player.camera.position.z - 1 &&
        this.trees[i].position.z < this.player.camera.position.z + 1 &&
        this.trees[i].position.x > this.player.camera.position.x - 1 &&
        this.trees[i].position.x < this.player.camera.position.x + 1)
        this.hit = true;
      if (this.trees[i].position.z >= this.player.camera.position.z) {
        this.trees[i].position.z = -200;
        this.trees[i].position.x = Math.random() * (10 - -10) + -10;
      }
    }
  }

  update = () => {
    //this.controls.update();
    this.domScore.innerHTML = this.score;
    if (this.speed <= 1.6) this.speed += 0.00034;
    if (!this.hit) {
      requestAnimationFrame(this.update);
      this.delta = this.clock.getDelta();
      this.tracker += this.speed;
      this.worlds[0].world.position.z += this.speed;
      this.worlds[1].world.position.z += this.speed;
      this.updateTreeLocation();
      this.updateGemLocation();
      if (this.tracker >= this.world1.renderFloor) {
        this.tracker = 0;
        this.pos.z = -330;
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
      //Add game over
    }
    this.renderer.render(this.scene, this.player.camera);

  }

  start() {
    this.createScene();
    this.update();
  }

}

export default Game;
