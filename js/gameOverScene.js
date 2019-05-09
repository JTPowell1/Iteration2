class gameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameOverScene" });
  }
  create() {

    this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
      fontFamily: 'monospace',
      fontSize: 60,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);


    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "restartButton"
    );

    this.btnRestart.setInteractive();

    this.btnRestart.on("pointerover", function() {
      this.btnRestart.setTexture("restartButtonOver"); 
    }, this);

    this.btnRestart.on("pointerout", function() {
      this.setTexture("restartButton");
    });

    this.btnRestart.on("pointerdown", function() {
      this.btnRestart.setTexture("restartButtonClicked");
    }, this);

    this.btnRestart.on("pointerup", function() {
      this.btnRestart.setTexture("restartButton");
      this.scene.start("mainScene");
    }, this);

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["background1", "background2"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update() {
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}