import {
  PlaneGeometry, MeshStandardMaterial, Mesh, Scene,
  DoubleSide, Vector3, FlatShading, Matrix4
} from 'three';
import Tree from './tree';

class World {
  constructor(scene, tree, pos = { x: 0, y: 0, z: 0 }) { //game scene, tree object and rendering position
    this.scene = scene;
    this.plane = new PlaneGeometry(50, 400, 10, 10);
    this.plane.applyMatrix(new Matrix4().makeRotationX(- Math.PI / 2));
    this.material = new MeshStandardMaterial({ color: 0xffffff, shading: FlatShading });
    this.land = new Mesh(this.plane, this.material);
    this.tree = tree;
    this.trees = [];
    this.renderFloor = 400;
    this.world = new Mesh(this.plane, this.material);
    for (var i = 0; i < this.world.geometry.vertices.length; i++) {
      this.world.geometry.vertices[i].z += pos.z;
    }
    this.world.receiveShadow = true;
    this.generateLandGeometry();
  }

  removeWorld() {
    this.scene.remove(this.world);
    this.world.geometry.dispose();
    this.material.dispose();
    this.world = undefined;
    this.removeTrees();
  }
  removeTrees() {
    for (let i = 0; i < this.trees.length; i++) {
      this.scene.remove(this.trees[i]);
      this.trees[i] = undefined;
    }
  }

  addTreeArray() {
    for (let i = 0; i < this.trees.length; i++) {
      this.scene.add(this.trees[i]);
    }
  }

  updateTreeLocation(speed, camera) {
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].position.z += speed;
      if (this.trees[i].position.z > camera.position.z - 0.5 && this.trees[i].position.z < camera.position.z + 0.5 &&
        this.trees[i].position.x > camera.position.x - 0.5 && this.trees[i].position.x < camera.position.x + 0.5)
        console.log("HIT!!");
      if (this.trees[i].position.z >= camera.position.z) {
        this.trees[i].position.z = -200;
        this.trees[i].position.x = Math.random() * (15 - -15) + -15;
      }
    }
  }

  renderWorld() {
    this.scene.add(this.world);
    this.addTreeArray();
    return this.scene;
  }
  updateWorldPosition(speed) {
    for (var i = 0; i < this.world.geometry.vertices.length; i++) {
      this.world.geometry.vertices[i].z += speed
    }
    this.world.position.z += speed;
  }
  generateLandGeometry() {
    for (var i = 0, l = this.world.geometry.vertices.length; i < l; i++) {
      if (i % 10 == 0) {
        this.world.geometry.vertices[i].y = 0;
      }
      else if (i % 8 == 0) {
        this.tree.position.set(this.world.geometry.vertices[i].x, this.world.geometry.vertices[i].y + 1.6, this.world.geometry.vertices[i].z);
        this.trees.push(this.tree.clone());
      }
      else
        this.world.geometry.vertices[i].y = Math.floor(Math.random() * 1.5);
    }
  }
  findYAtVertex(pos) {
    let closest = new Vector3();
    for (var i = 0, l = this.world.geometry.vertices.length; i < l; i++) {
      if ((((pos.x - this.world.geometry.vertices[i].x) > 20) || (pos.x - this.world.geometry.vertices[i].x) < 20) &&
        (((pos.x - this.world.geometry.vertices[i].z) > 20) || (pos.x - this.world.geometry.vertices[i].z) < 20)) {
          closest = this.world.geometry.vertices[i];
      }
    }
    return closest;
  }
}

export default World;
