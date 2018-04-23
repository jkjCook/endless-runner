import { Howler, Howl } from 'howler';
class Sound {
  constructor() {
    this.collect = new Howl({
      src: '../assets/collect.wav'
    });
  }
}

export default Sound;
