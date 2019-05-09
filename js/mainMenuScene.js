class mainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "mainMenuScene" });
  }

  preload() {
    this.load.image("background1", "assets/background1.png");
    this.load.image("background2", "assets/background2.png");
    this.load.image("playButton", "assets/playButton.png");
    this.load.image("playButtonOver", "assets/playButtonOver.png");
    this.load.image("playButtonClicked", "assets/playButtonClicked.png");
    this.load.image("restartButton", "assets/restartButton.png");
    this.load.image("restartButtonOver", "assets/restartButtonOver.png");
    this.load.image("restartButtonClicked", "assets/restartButtonClicked.png");
  }

  create() {

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "playButton"
    );

    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("playButtonOver"); 
    }, this);

    this.btnPlay.on("pointerout", function() {
      this.setTexture("playButton");
    });

    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("playButtonClicked");
    }, this);

    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("playButton");
      this.scene.start("mainScene");
    }, this);

    this.title = this.add.text(this.game.config.width * 0.5, 128, "Spacey Shooty Shooty", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);

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