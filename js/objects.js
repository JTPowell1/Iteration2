class objects extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
    this.setData("isDead", false);
  }

  explode(canDestroy) {
    if (!this.getData("isDead")) {
      this.setTexture("explosion");  
      this.play("explosion"); 
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
      this.setAngle(0);
      this.body.setVelocity(0, 0);
      this.on('animationcomplete', function() {
        if (canDestroy) {
          this.destroy();
        }
        else {
          this.setVisible(false);
        }
      }, this);
      this.setData("isDead", true);
    }
  }
}

class Player extends objects {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "player");
	this.setScale(5);
    this.setData("speed", 1000);

    this.setData("isShooting", true);
    this.setData("timerShootDelay", 10);
      this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
      this.scene.input.on('pointerdown', this.handlePointer, this);
      this.scene.input.on('pointermove', this.handlePointer, this);
  }

    handlePointer(pointer) {
        this.x = pointer.x;
        this.y = pointer.y;
    }

  moveUp() {
    this.body.velocity.y = -this.getData("speed");
  }
  moveDown() {
    this.body.velocity.y = this.getData("speed");
  }
  moveLeft() {
    this.body.velocity.x = -this.getData("speed");
  }
  moveRight() {
    this.body.velocity.x = this.getData("speed");
  }

  onDestroy() {
    this.scene.time.addEvent({
      delay: 1000,
      callback: function() {
        this.scene.scene.start("gameOverScene");
      },
      callbackScope: this,
      loop: false
    });
  }

  update() {
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); 
      }
      else { 
        var laser = new PlayerLaser(this.scene, this.x, this.y);
        this.scene.playerLasers.add(laser);
      
        this.setData("timerShootTick", -30);
      }
    }
  }
}

class PlayerLaser extends objects {
  constructor(scene, x, y) {
    super(scene, x, y, "playerLaser");
    this.body.velocity.y = -2000;
	this.setScale(5);
  }
}

class EnemyLaser extends objects {
  constructor(scene, x, y) {
    super(scene, x, y, "enemyLaser");
    this.body.velocity.y = 600;
  }
}

class ChaserShip extends objects {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy2", "ChaserShip");

    this.body.velocity.y = Phaser.Math.Between(100, 200);

    this.states = {
      MOVE_DOWN: "MOVE_DOWN",
      CHASE: "CHASE"
    };
    this.state = this.states.MOVE_DOWN;
  }

  update() {
    if (!this.getData("isDead") && this.scene.player) {
      if (Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y
      ) < 320) {

        this.state = this.states.CHASE;
      }

      if (this.state == this.states.CHASE) {
        var dx = this.scene.player.x - this.x;
        var dy = this.scene.player.y - this.y;

        var angle = Math.atan2(dy, dx);

        var speed = 100;
        this.body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );

        if (this.x < this.scene.player.x) {
          this.angle -= 5;
        }
        else {
          this.angle += 5;
        } 
      }
    }
  }
}

class GunShip extends objects {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy1", "GunShip");
    this.play("enemy1");

    this.body.velocity.y = Phaser.Math.Between(100, 200);

    this.shootTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: function() {
        var laser = new EnemyLaser(
          this.scene,
          this.x,
          this.y
        );
        laser.setScale(this.scaleX);
        this.scene.enemyLasers.add(laser);
      },
      callbackScope: this,
      loop: true
    });
  }

  onDestroy() {
    if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }
  }
}

class CarrierShip extends objects {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy3", "CarrierShip");
    this.play("enemy3");

    this.body.velocity.y = Phaser.Math.Between(100, 200);
  }
}

class ScrollingBackground {
  constructor(scene, key, velocityY) {
    this.scene = scene;
    this.key = key;
    this.velocityY = velocityY;

    this.layers = this.scene.add.group();

    this.createLayers();
  }

  createLayers() {
    for (var i = 0; i < 2; i++) {
      var layer = this.scene.add.sprite(0, 0, this.key);
      layer.y = (layer.displayHeight * i);
      var flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
      var flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
      layer.setScale(flipX * 2, flipY * 2);
      layer.setDepth(-5 - (i - 1));
      this.scene.physics.world.enableBody(layer, 0);
      layer.body.velocity.y = this.velocityY;

      this.layers.add(layer);
    }
  }

  update() {
    if (this.layers.getChildren()[0].y > 0) {
      for (var i = 0; i < this.layers.getChildren().length; i++) {
        var layer = this.layers.getChildren()[i];
        layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
      }
    }
  }
}