import OBJLoader from './OBJLoader';
import { Object3D, Mesh } from 'three';
import MTLLoader from './MTLLoader';

//Needs to load the material as well and combine the Object3D and MTL and return to Game
class Tree {
  constructor() {
    this.loader = new OBJLoader();
    this.matLoader = new MTLLoader();
  }
  loadObj(mat) {
    return new Promise((resolve, reject) => {
      this.loader.setMaterials(mat);
      this.loader.load('../assets/tree.obj', (obj) => {
        this.tree = obj;
        resolve(this.tree);
      }, (xhr) => {
        console.log(xhr);
      }, (error) => {
        reject(error);
      })
    });
  }
  loadMat() {
    return new Promise((resolve, reject) => {
      this.matLoader.load('../assets/tree-material.mtl', (material) => {
          this.material = material;
          resolve(this.material);
        }, (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }, (error) => {
          console.log(error);
        }
      );
    })
  }
}

export default Tree;
