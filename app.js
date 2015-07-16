var game = new Phaser.Game(400, 490, Phaser.AUTO, '')

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
  },
  update: function(){
    if(this.spacebar.isDown){
      this.player.body.velocity.y = -250;
    }
  }
};

game.state.add('main', Main);
game.state.start('main');
