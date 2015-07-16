var game = new Phaser.Game(400, 490, Phaser.AUTO, '')
var MAX_BOX_COUNT = 8;

function Main() {};

Main.prototype = {
  preload: function(){
    this.game.load.image('helicopter', 'assets/helicopter.png');
    this.game.load.image('box', 'assets/box.png');
    this.game.stage.backgroundColor = "#f77777";
  },
  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = this.game.add.sprite(90, 200, 'helicopter');
    this.game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.boxes = this.game.add.group();
    this.boxes.enableBody = true;
    this.boxes.createMultiple(20, 'box');
    this.timer = this.game.time.events.loop(1500, this.addRowOfBoxes, this);
  },
  update: function(){
    if(this.spacebar.isDown && this.player.alive){
      this.player.body.velocity.y = -250;
    };
    if(!this.player.inWorld){
      this.restart();
    }
    this.game.physics.arcade.overlap(this.player, this.boxes, this.hitBox, null, this);
  },
  addRowOfBoxes: function(){
    var hole = Math.floor(Math.random() * 6);
    for(var i=0; i < MAX_BOX_COUNT; i++){
      if(i != hole && i != hole+1 && i != hole+2){
        this.addOneBox(400, i * 60 + 10)
      }
    }
  },
  addOneBox: function(x, y){
    var box = this.boxes.getFirstDead();
    box.reset(x, y);
    box.body.velocity.x = -200;
    box.checkWorldBounds = true;
    box.outOfBoundsKill = true;
  },
  hitBox: function(){
    if(!this.player.alive){
      return;
    }
    this.game.time.events.remove(this.timer);
    this.player.alive = false;
    this.boxes.forEachAlive(function(box){
      box.body.velocity.x = 0;
    }, this)
  },
  restart: function(){
    this.game.state.start('main');
  }
};

game.state.add('main', Main);
game.state.start('main');
