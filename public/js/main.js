import Game from './game';
import Tree from './tree';
let tree = new Tree();
tree = new Tree();
tree.loadMat().then((mat) => {  //Load the world after loading the tree resource and pass the object to the world
  tree.loadObj(mat).then((obj) => {
    let game = new Game(window.innerWidth, window.innerHeight, obj);
    game.start();
  });
});


