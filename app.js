var game = new Phaser.Game(400, 490, Phaser.AUTO, '')
var MAX_BOX_COUNT = 8;

function Main() {};

Main.prototype = {
  preload: function(){
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

    this.score = 0;
    this.scoreText = this.game.add.text(20, 20, "Score: 0", {font: "24px Arial", fill: "#ffffff"});
    this.startTime = this.game.time.time;
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
    this.addScore();
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
    this.game.state.start('gameOver', true, false, {previousScore: this.score});
  },
  addScore: function(){
    this.score += Math.floor((this.game.time.time - this.startTime)/100);
    this.scoreText.text = "Score: " + this.score;
  }
};

function Menu(){};

Menu.prototype = {
  preload: function(){
    this.game.load.image('helicopter', 'assets/helicopter.png');
    this.game.load.image('box', 'assets/box.png');
    this.game.stage.backgroundColor = "#f77777";
  },
  create: function(){
    this.game.add.text("75", "200", "Press Spacebar to start", {font: "24px Arial", fill: "#FFFFFFF"});
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function(){
    if(this.spacebar.isDown){
      this.game.state.start('main');
    }
  }
}

function GameOver(){};

GameOver.prototype = {
  init: function(params){
    this.previousScore = params.previousScore;
  },
  preload: function(){
  },
  create: function(){
    this.game.add.text("120", "100", "Game Over", {font: "32px Arial", fill: "#FFFFFFF"});
    this.game.add.text("155", "200", "Score: " + this.previousScore, {font: "24px Arial", fill: "#FFFFFFF"});
    this.game.add.text("65", "300", "Press Spacebar to restart", {font: "24px Arial", fill: "#FFFFFFF"});
    this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function(){
    if(this.spacebar.isDown){
      this.game.state.start('main');
    }
  }
}
game.state.add('menu', Menu);
game.state.add('main', Main);
game.state.add('gameOver', GameOver);
game.state.start('menu');
