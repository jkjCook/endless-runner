import { HemisphereLight, DirectionalLight,  Scene } from 'three';

class Light {
  constructor(scene) {
    this.scene = scene;
  }

  renderLight() {
    let hemisphereLight = new HemisphereLight( 0x000000, 0x00ff00, 0.9 );
    hemisphereLight.position.set(6.5, 500, 0);
    this.scene.add(hemisphereLight);
    var light = new DirectionalLight(0xffffff, 0.5);
    light.castShadow = true;
    this.scene.add(light);
    return this.scene;
  }
}

export default Light;
