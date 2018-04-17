import { HemisphereLight, DirectionalLight,  Scene } from 'three';

class Light {
  constructor(scene) {
    this.scene = scene;
  }

  renderLight() {
    var hemisphereLight = new HemisphereLight(0xfffafa, 0x000000, .9)
    this.scene.add(hemisphereLight);
    var light = new DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 10);
    light.castShadow = true;
    this.scene.add(light);
    return this.scene;
  }
}

export default Light;
