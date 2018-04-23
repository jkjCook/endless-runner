import {
  PlaneGeometry, MeshStandardMaterial, Mesh, Scene,
  DoubleSide, Vector3, FlatShading, Matrix4
} from 'three';
import Tree from './tree';

class World {
  constructor(scene, tree, pos = { x: 0, y: 0, z: 0 }) { //game scene, tree object and rendering position
    this.scene = scene;
    this.plane = new PlaneGeometry(30, 400, 10, 10);
    this.plane.applyMatrix(new Matrix4().makeRotationX(- Math.PI / 2));
    this.material = new MeshStandardMaterial({ color: 0xffffff, shading: FlatShading });
    this.land = new Mesh(this.plane, this.material);
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
  }

  renderWorld() {
    this.scene.add(this.world);
    return this.scene;
  }
  updateWorldPosition(speed) {
    for (var i = 0; i < this.world.geometry.vertices.length; i++) {
      this.world.geometry.vertices[i].z += speed
    }
    this.world.position.z += speed;
  }
  generateLandGeometry() {
    for (var i = 0; i < this.world.geometry.vertices.length; i++) {
      if (i % Math.sqrt(this.world.geometry.vertices.length) == 0) {
        this.world.geometry.vertices[i].y = 0;
      }
      else if(i < Math.sqrt(this.world.geometry.vertices.length)){
        this.world.geometry.vertices[i].y = 0;
      }
      else
        this.world.geometry.vertices[i].y = Math.floor(Math.random() * 1.5);
    }
  }
}

export default World;
