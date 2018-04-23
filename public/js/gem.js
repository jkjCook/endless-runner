import { SphereGeometry, MeshBasicMaterial, Mesh } from 'three';

class Gem {
  constructor(scene) {
    this.sphere = new SphereGeometry(0.4, 10, 10);
    this.material = new MeshBasicMaterial({color: 0xff00ff});
    this.gem = new Mesh(this.sphere, this.material);
    this.scene = scene;
    this.gem.position.z = -200;
    this.gem.position.x = Math.random() * (10 - -10) + -10;
    this.gem.position.y = 1.5;
    this.gem.up = false;
  }
  addGem() {
    this.scene.add(this.gem);
    return this.scene;
  }
}

export default Gem;
