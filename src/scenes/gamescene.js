
import {
    CustomButton
} from '../game-object/custom-button';

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    init() {
        if (this.sys.game.device.os.desktop) {
            this.device = "desktop"
        } else {
            this.device = "mobile"
        }
    }

    create() {
        this.gameOptions = {
            timeLimit: 60,      // time of the game (second)            
            frictionAir: 0.2,
            friction: 1,
            frictionStatic: 1,
            mass: 50,
            restitution: 1,
            density: .001,
            bounce: .5,

            dropCounter: 0,
            workingAreaHeight: 1000,
            minGiftScale: .6,
            maxGiftScale: 1.1,
            velocity: 0,
            maxVelocity: 5,
            acceleration: .25,
            score: 0
        }

        this.matter.world.update30Hz();
        this.canDrop = true;
        this.timer = 0;
        this.catch = 0;
        this.timerEvent = null;
        this.giftGroup = this.add.group();
        this.giftGroupOnHead = this.add.group();
        this.fallingGiftPhysics = this.matter.add.gameObject;
        this.prevStepPlayerX;
        this.gifts = [
            this.textures.get('gift-1'),
            this.textures.get('gift-2'),
            this.textures.get('gift-3'),
            this.textures.get('gift-4'),
            this.textures.get('gift-5'),
            this.textures.get('gift-6'),
            this.textures.get('gift-7')
        ];

        this.actGiftScale;
        this.isEndGame = false;
        this.isMoveLeft = false;
        this.isMoveRight = false;

        this.actionCamera = this.cameras.add(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        this.addBackground();
        this.addPlayer();

        this.keyboardFollow();

        // mobile:
        if (this.device == 'mobile') {
            this.mobileFollow();
        }

        this.timeTextContainer = this.add.container(30, 30);

        this.tween;

        var timeTxt = this.add.text(0, 60, 'TIME: ', {
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: '24px'
        });

        this.timeText = this.add.text(timeTxt.width, 0, this.gameOptions.timeLimit.toString(), {
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: '88px'
        });

        this.stext = this.add.text(this.timeText.x + this.timeText.width + 5, 60, 's', {
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: '24px'
        });

        this.timeTextContainer.add(timeTxt);
        this.timeTextContainer.add(this.timeText);
        this.timeTextContainer.add(this.stext);

        /////

        this.pointsTextContainer = this.add.container(this.sys.game.config.width - 200, 30);

        var punktytext = this.add.text(0, 60, 'SCORE:', {
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: '24px'
        });
        this.catchText = this.add.text(punktytext.width + 5, 0, '0', {
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: '88px'
        });

        this.pointsTextContainer.add(punktytext);
        this.pointsTextContainer.add(this.catchText);

        this.matter.world.on("collisionstart", this.checkCollision, this);
        this.matter.world.on("collisionactive", this.collisionActive, this);
        this.matter.world.on("beforeupdate", this.beforeUpdate, this);
        this.matter.world.on("afterupdate", this.afterUpdate, this);

        // this.matter.world.on('sleepend', this.sleepend, this);
        // this.matter.world.on('sleepstart', this.sleepstart, this);

        this.actionCamera.ignore([
            this.timeTextContainer,
            this.pointsTextContainer
        ]);

        this.cameras.main.ignore([
            this.ground,
            this.movingGift,
            this.player,
            this.tray,
            this.paralaxMoon,
            this.paralaxHills2,
            this.paralaxHills1,
            this.paralaxTree1,
            this.paralaxTree2
        ]);

        this.collectSnd = this.sound.add("collect");
        this.failSnd = this.sound.add("fail");

        this.events.on('transitionwake', targetScene => {
            this.scene.restart();
        });

        this.actionCamera.fadeIn(500)

    }

    playAgain() {
        this.scene.restart();
    }

    addBackground() {

        this.paralaxMoon = this.add.image(200, 100, 'paralax-moon');
        this.paralaxMoon.setOrigin(0, 0);

        this.paralaxHills1 = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height + 200, 'paralax-hills-2');
        this.paralaxHills1.setOrigin(.5, 1);
        this.paralaxHills1.setScale(.8);
        this.tweens.add({
            targets: this.paralaxHills1,
            props: {
                y: {
                    value: this.sys.game.config.height,
                    duration: 600,
                    delay: 0,
                    ease: 'Circ.easeOut'
                }
            }
        });

        this.paralaxHills2 = this.add.sprite(this.sys.game.config.width / 2 - 200, this.sys.game.config.height + 200, 'paralax-hills-1');
        this.paralaxHills2.setOrigin(.5, 1);
        this.tweens.add({
            targets: this.paralaxHills2,
            props: {
                y: {
                    value: this.sys.game.config.height,
                    duration: 600,
                    delay: 0,
                    ease: 'Circ.easeOut'
                }
            }
        });

        this.paralaxTree1 = this.add.image(-50, 0, 'paralax-tree-1');
        this.paralaxTree1.setScale(.8);
        this.paralaxTree1.setOrigin(0, 1);

        this.tweens.add({
            targets: this.paralaxTree1,
            props: {
                y: {
                    value: this.sys.game.config.height - 50,
                    duration: 600,
                    delay: 0,
                    ease: 'Bounce.easeOut'
                }
            }
        });

        this.paralaxTree2 = this.add.image(this.sys.game.config.width, 0, 'paralax-tree-2');
        this.paralaxTree2.setScale(.8);
        this.paralaxTree2.setOrigin(.7, 1);

        this.tweens.add({
            targets: this.paralaxTree2,
            props: {
                y: {
                    value: this.sys.game.config.height,
                    duration: 600,
                    delay: 0,
                    ease: 'Bounce.easeOut'
                }
            }
        });

        this.ground = this.matter.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 17, "ground-img");
        this.ground.setOrigin(.5, .5);
        this.ground.setStatic(true);
        this.ground.setFriction(1);
        this.ground.setFrictionStatic(1);
    }

    addPlayer() {

        var Bodies = Phaser.Physics.Matter.Matter.Bodies;

        this.player = this.add.sprite(this.sys.game.config.width / 2, this.ground.getBounds().top, 'saint', null, {});
        this.player.setOrigin(0.5, 1);

        // correction empty space around the player
        let playerWidth = this.player.width - 20;
        let playerHeight = this.player.height - 8;

        this.tray = this.matter.add.sprite(0, 0, 'tray', null, {});

        let rectPlayer = Bodies.rectangle(0, this.ground.getBounds().top, playerWidth, playerHeight, {
            label: 'rectPlayer'
        });

        let rectTray = Bodies.rectangle(0, rectPlayer.bounds.min.y, playerWidth, 2, {
            isSensor: true,
            label: 'rectTray'
        });

        let compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            label: 'compoundBody____1',
            parts: [rectPlayer, rectTray],
            inertia: Infinity,
            mass: 10
        });

        this.tray.setExistingBody(compoundBody);

        this.player.setDepth(1);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('saint', {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'saint',
                frame: 2
            }],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('saint', {
                start: 0,
                end: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.player.anims.play('turn');
    }

    // mouse
    // mouseFollow() {

    //     this.input.on('pointermove', function (pointer) {

    //         this.target.x = pointer.x;
    //         this.target.y = pointer.y;

    //         this.tween = this.tweens.add({
    //             targets: this.player,
    //             x: pointer.x,
    //             duration: this.gameOptions.velocity,
    //             ease: 'Linear',

    //             onUpdate: function () {

    //             },
    //             onUpdateScope: this
    //         });

    //     }, this);
    // }

    // keyboard
    keyboardFollow() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.addDropGift();
    }

    // touch devices
    mobileFollow() {

        var btnright = this.add.sprite(this.sys.game.config.width - 100, this.sys.game.config.height - 120, "arrow")
        var btnleft = this.add.sprite(100, this.sys.game.config.height - 120, "arrow")
        btnleft.angle = 180
        btnleft.setInteractive();
        btnright.setInteractive();
        btnleft.setDepth(2)
        btnright.setDepth(2)

        btnleft.on('pointerdown', function () {
            this.isMoveLeft = true;
        }, this)
        btnright.on('pointerdown', function () {
            this.isMoveRight = true;
        }, this)
        btnleft.on('pointerup', function () {
            this.isMoveLeft = false;
        }, this)
        btnright.on('pointerup', function () {
            this.isMoveRight = false;
        }, this)

    }

    addDropGift() {

        let randomGift = Math.floor(Math.random() * (this.gifts.length - 0)) + 0;
        let destX = Math.floor(Math.random() * (this.sys.game.config.width - 400)) + 200;
        let destY = this.actionCamera.worldView.top;

        let giftScale = Math.random() * (this.gameOptions.maxGiftScale - this.gameOptions.minGiftScale) + this.gameOptions.minGiftScale;

        this.movingGift = this.add.sprite(0, 0, this.gifts[randomGift].key);
        this.movingGift.x = destX;
        this.movingGift.y = destY
        this.movingGift.scaleX = this.movingGift.scaleY = giftScale;

        this.actGiftScale = giftScale;

        if (this.canDrop && this.timer < this.gameOptions.timeLimit) {
            this.dropCounter++;
            this.addTimer();
            this.canDrop = false;
            this.movingGift.destroy();

            var fallignSprite = this.add.sprite(0, 0, this.gifts[randomGift].key, null, {});
            fallignSprite.scaleX = fallignSprite.scaleY = giftScale;

            let destWidth = fallignSprite.displayWidth;
            let destHeight = fallignSprite.displayHeight;

            var giftContainer = this.add.container(destX, destY);
            giftContainer.label = "giftContainer"

            giftContainer.add(fallignSprite);
            giftContainer.setSize(destWidth, destHeight);

            this.fallingGiftPhysics = this.matter.add.gameObject(giftContainer, {
                shape: {
                    type: 'rectangle',
                    x: destX,
                    y: destY,
                    width: destWidth,
                    height: destHeight,
                    velocity: 10
                }
            });

            this.fallingGiftPhysics.label = "fallingGiftPhysics";
            this.fallingGiftPhysics.active = true;
            this.fallingGiftPhysics.restitution = this.gameOptions.restitution;
            this.fallingGiftPhysics.setFrictionAir(this.gameOptions.frictionAir);
            this.fallingGiftPhysics.setFriction(this.gameOptions.friction);
            this.fallingGiftPhysics.setFrictionStatic(this.gameOptions.frictionStatic);
            this.fallingGiftPhysics.setDensity(this.gameOptions.density);
            this.fallingGiftPhysics.setBounce(this.gameOptions.bounce);

            this.fallingGiftPhysics.body.isGift = true;
            this.fallingGiftPhysics.body.hit = false;
            this.fallingGiftPhysics.body.isonhead = false;
            this.fallingGiftPhysics.body.isonground = false;

            this.giftGroup.add(this.fallingGiftPhysics);

            this.cameras.main.ignore(this.fallingGiftPhysics);
        }
    }

    nextGift() {
        this.zoomCamera();
        this.canDrop = true;
        this.fallingGiftPhysics = this.matter.add.gameObject;
        this.addDropGift();
    }

    removeGift(gift) {
        if (this.giftGroup.getChildren().length > 0) {
            gift.active = false;
            gift.destroy();
        }
    }

    addToHead(gift) {

        if (!gift.body.hit) {
            this.collectSnd.play();
        }
        gift.body.isonhead = true;
        gift.body.hit = true;

        this.giftGroupOnHead.add(gift);

    }

    collisionActive(event) {

        for (var i = 0; i < event.pairs.length; i++) {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;

            if ((bodyA.isSensor || bodyB.isSensor) && (bodyA.isGift || bodyB.isGift)) {

                var tileBody = (bodyA.isGift && !bodyA.isonhead) ? bodyA.gameObject : bodyB.gameObject;

                this.addToHead(tileBody);

            } else if ((bodyA.isGift && bodyB.isGift)) {

                if ((bodyA.isonhead || bodyB.isonhead)) {

                    var tileBody = (bodyA.isGift && !bodyA.isonhead) ? bodyA.gameObject : bodyB.gameObject;

                    this.addToHead(tileBody)
                } else {

                    var tileBody = (bodyA.isGift && !bodyA.isonground) ? bodyA.gameObject : bodyB.gameObject;

                    if (!tileBody.body.isonground) {
                        this.actionCamera.shake(200, 0.008);
                        this.failSnd.play({
                            volume: .7
                        });
                        bodyA.isonground = true;
                        bodyB.isonground = true;

                    }
                }
            } else if ((bodyA.isGift || bodyB.isGift) && (bodyA.isStatic || bodyB.isStatic)) {

                this.matter.world.remove(bodyB);
                bodyB.position.y = bodyB.position.y + 2;

                var tileBody = (bodyA.isGift) ? bodyA.gameObject : bodyB.gameObject;
                tileBody.body.hit = true;

                if (!tileBody.body.isonground) {
                    this.actionCamera.shake(200, 0.01);
                    tileBody.body.isonground = true;
                    this.failSnd.play({
                        volume: .7
                    });
                }
            }
        }
    }

    checkCollision(event, bodyA, bodyB) {
        if (bodyB == this.fallingGiftPhysics.body && !this.isEndGame) {
            this.nextGift();
        }
    }

    beforeUpdate(event) {

        this.giftGroupOnHead.getChildren().forEach(function (gift) {

            gift.body.isonhead = false;

        });

        this.giftGroupOnHead.clear(false);

    }

    afterUpdate(event) {

        this.giftGroup.getChildren().forEach(function (gift) {

        });

        this.giftGroupOnHead.getChildren().forEach(function (gift) {

        });
    }

    update() {

        let velocity = this.gameOptions.velocity;
        let destX = this.player.x;

        if (this.isMoveLeft || this.cursors.left.isDown) {

            velocity < 0 ? velocity -= this.gameOptions.acceleration : velocity -= this.gameOptions.acceleration * 3;
            destX += velocity;

            if (this.player.x <= 130) {
                velocity = 0;
            }

        } else if (this.isMoveRight || this.cursors.right.isDown) {

            velocity > 0 ? velocity += this.gameOptions.acceleration : velocity += this.gameOptions.acceleration * 3;
            destX += velocity;

            if (this.player.x >= this.sys.game.config.width - 120) {
                velocity = 0
            }

        } else {

            if (velocity != 0) {
                if (velocity > 1) {
                    velocity -= this.gameOptions.acceleration * 2;
                } else if (velocity < -1) {
                    velocity += this.gameOptions.acceleration * 2;
                } else {
                    velocity = 0;
                }
                destX += velocity;
            }
        }

        velocity = Math.min(Math.max(-this.gameOptions.maxVelocity, velocity), this.gameOptions.maxVelocity);

        this.player.x += velocity;

        if (this.player.x < 130) {
            this.player.x = 130
        } else if (this.player.x >= this.sys.game.config.width - 120) {
            this.player.x = this.sys.game.config.width - 120
        }

        if (velocity < 0) {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        } else if (this.gameOptions.velocity > 0) {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        } else {
            this.player.anims.play('turn');
        }

        this.gameOptions.velocity = velocity;

        this.tray.x = this.player.x;


        this.giftGroupOnHead.getChildren().forEach(function (gift) {

            gift.setPosition(gift.x + (this.player.x - this.prevStepPlayerX), gift.y);

        }, this);

        this.prevStepPlayerX = this.player.x;

        // parallax
        var destX2 = ((this.player.x - this.sys.game.config.width / 2)) * -.02 + 200;
        var destX3 = ((this.player.x - this.sys.game.config.width / 2)) * -.05 + this.sys.game.config.width / 2;
        var destX4 = ((this.player.x - this.sys.game.config.width / 2)) * -.1 + this.sys.game.config.width / 2 + 200;
        var destX5 = ((this.player.x - this.sys.game.config.width / 2)) * -.25 - 50;
        var destX6 = ((this.player.x - this.sys.game.config.width / 2)) * -.15 + (this.sys.game.config.width - 120);

        this.tweens.add({
            targets: this.paralaxMoon,
            x: destX2,
            duration: velocity,
            ease: 'Linear',
        });

        this.tweens.add({
            targets: this.paralaxHills2,
            x: destX4 - 800,
            duration: velocity,
            ease: 'Linear',
        });

        this.tweens.add({
            targets: this.paralaxHills1,
            x: destX4 + 300,
            duration: velocity,
            ease: 'Linear',
        });

        this.tweens.add({
            targets: this.paralaxTree1,
            x: destX5,
            duration: velocity,
            ease: 'Linear',
        });

        this.tweens.add({
            targets: this.paralaxTree2,
            x: destX6,
            duration: velocity,
            ease: 'Linear',
        });

        if (!this.isEndGame) {

            this.catchText.text = this.giftGroupOnHead.getChildren().length;

            this.giftGroup.getChildren().forEach(function (gift) {
                if (gift.y > this.sys.game.config.height + gift.displayHeight) {
                    this.removeGift(gift);
                }
            }, this);
        }
    }

    addTimer() {

        if (this.timerEvent == null) {
            this.timerEvent = this.time.addEvent({
                delay: 1000,
                callback: this.tick,
                callbackScope: this,
                loop: true
            });
        }
    }

    tick() {

        this.timer++;
        this.timeText.text = (this.gameOptions.timeLimit - this.timer).toString();
        this.stext.x = this.timeText.x + this.timeText.width + 5;
        if (this.timer >= this.gameOptions.timeLimit) {
            this.endGame();
        }

    }

    endGame() {

        this.isEndGame = true;
        this.timerEvent.remove();
        let score = this.giftGroupOnHead.getChildren().length;
        this.gameOptions.score = score;
        if (score > 1) {
            var counText = "boxes"
        } else if (score == 1) {
            var counText = "box"
        }

        let endText;
        if (!score == 0) {
            endText = 'you caught ' + score + " " + counText;
        } else {
            endText = ' You did not catch anything';
        }

        this.endText = this.add.text(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2 - 300,
            endText, {
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: '80px',
            stroke: '#232753',
            strokeThickness: 10,
            align: 'center',
            padding: {
                x: 10,
                y: 10
            },
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#13162e',
                blur: 0,
                stroke: true,
                fill: true
            }
        });

        this.endText.setOrigin(0.5);
        this.cameras.main.ignore(this.endText);

        this.tweens.timeline({
            targets: [this.endText],
            tweens: [{
                y: 200,
                rotation: -0.05,
                yoyo: false,
                repeat: 0,
                ease: 'Back.easeOut',
                duration: 800
            },
            {
                y: '-=1',
                yoyo: true,
                repeat: -1,
                rotation: {
                    value: 0.05,
                    yoyo: true,
                    repeat: -1,
                    duration: 1500,
                    ease: 'Sine.easeInOut'
                },
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: this.tweens.stagger(
                    100, {})
            }
            ]
        });

        var style = {};
        style.buttonBackgroundH = '0xFF8300';
        style.buttonText = '#ffffff';
        style.buttonFont = 'LuckiestGuy-Regular';

        this.btnstart = new CustomButton({
            scene: this,
            style: style,
            x: this.sys.game.config.width / 2,
            y: this.sys.game.config.height / 2 + 100,
            text: "Play again",
            callback: this.doStart
        });

        this.btnstart.on('pointerover', function () {
            let preloader = this.scene.get('Preloader');
            preloader.buttonSnd.play({
                loop: false,
                volume: 1
            });
        }, this);

        this.add.existing(this.btnstart);
        this.btnstart.setDepth(100);

        this.actionCamera.zoomTo(1, 3500);
        this.actionCamera.pan(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 3500)

        this.cameras.main.ignore(this.btnstart.text);
        this.cameras.main.ignore(this.btnstart.bg);
        this.cameras.main.ignore(this.btnstart.border);

    }

    zoomCamera() {

        let maxHeight = 0;

        this.giftGroup.getChildren().forEach(function (gift) {
            maxHeight = Math.max(maxHeight, Math.round((this.player.getBounds().top - gift.getBounds().top) / this.actGiftScale));
        }, this);

        this.movingGift.y = this.ground.getBounds().top - maxHeight * (this.actGiftScale) - this.gameOptions.workingAreaHeight;
        let zoomFactor = this.gameOptions.workingAreaHeight / (this.ground.getBounds().top - this.movingGift.y);

        this.actionCamera.zoomTo(zoomFactor, 500);
        let newHeight = this.sys.game.config.height / zoomFactor;

        this.actionCamera.pan(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - (newHeight - this.sys.game.config.height) / 2, 500)
    }

    doStart() {
        this.scene.playAgain();
    }

    goToScene(targetScene) {

        this.scene.transition({
            target: targetScene,
            duration: 0,
            moveAbove: true,
            onUpdate: this.transitionOut,
            data: {
                delay: 1500
            },
            remove: false,
            sleep: true,
        });

    }
}