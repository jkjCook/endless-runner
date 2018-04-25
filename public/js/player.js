import { Scene, PerspectiveCamera } from 'three';
import { TweenLite } from 'gsap';

class Player {
  constructor(width, height) {
    this.sceneHeight = height;
    this.sceneWidth = width;
    this.keyDown = false;
    this.keyUp = false;
    this.hit = false;
    this.camera = new PerspectiveCamera(60, this.sceneWidth / this.sceneHeight, 0.1, 1000);
    this.camera.position.z = 6.5;
    this.camera.position.y = 1.8;
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
  move(delta) {
    console.log(this.camera.position);
    if (this.keyDown) {
      let x;
      if (this.keyCode == 37) {
        TweenLite.to(this.camera.rotation, 0.5, { z: -0.2 });
        if (this.camera.position.x + (delta * -150) < 12 && this.camera.position.x + (delta * -150) > -12)
          x = this.camera.position.x + (delta * -200);
        else
          x = this.camera.position.x = -12.5;

        TweenLite.to(this.camera.position, 0.5, { x: x });
      }
      else if (this.keyCode == 39) {
        TweenLite.to(this.camera.rotation, 0.5, { z: 0.2 });
        if (this.camera.position.x + (delta * 150) < 12 && this.camera.position.x + (delta * 150) > -12)
          x = this.camera.position.x + (delta * 250);
        else
          x = this.camera.position.x = 12.5;

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
}

export default Player;
