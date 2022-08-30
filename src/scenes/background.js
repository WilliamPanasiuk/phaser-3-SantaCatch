export default class Background extends Phaser.Scene {

    constructor() {
        super("Background");
    }

    preload() {

        if (this.sys.game.device.os.desktop) {
			this.device = "desktop"
		} else {
			this.device = "mobile"
		}
    }

    init() {
    }

    create() {

        // ksiezyc
        this.paralaxMoon = this.add.image(100, -100, 'paralax-moon');
        this.paralaxMoon.setOrigin(0, 0);
        this.paralaxMoon.setInteractive();

        this.tweens.add({
            targets: this.paralaxMoon,
            props: {
                y: {
                    value: 100,
                    duration: 600,
                    delay: 0,
                    ease: 'Back.easeOut'
                }
            }
        });

        // pagorki

        this.paralaxHills1 = this.add.sprite(-300, -500, 'paralax-hills-1');
        this.paralaxHills1.setScale(.9);
        this.paralaxHills1.setOrigin(0, 1);

        this.tweens.add({
            targets: this.paralaxHills1,
            props: {
                y: {
                    value: this.sys.game.config.height,
                    duration: 600,
                    delay: 700,
                    ease: 'Back.easeOut'
                }
            }
        });

        this.parallaxBack42 = this.add.sprite(0, this.sys.game.config.height + 800, 'paralax-hills-2');
        this.parallaxBack42.setScale(.7);
        this.parallaxBack42.setOrigin(0, .9);

        this.tweens.add({
            targets: this.parallaxBack42,
            props: {
                y: {
                    value: this.sys.game.config.height,
                    duration: 600,
                    delay: 900,
                    ease: 'Back.easeOut'
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
                    value: this.sys.game.config.height - 10,
                    duration: 600,
                    delay: 1300,
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
                    delay: 1500,
                    ease: 'Bounce.easeOut'
                }
            }
        });

        this.snowContainer = this.add.container(0, 0);
        let particles = this.add.particles('snow');
        let emitZone = new Phaser.Geom.Rectangle(-300, 0, this.sys.game.config.width * 2, 10);
        let deathZone = new Phaser.Geom.Rectangle(0, this.sys.game.config.height + 10, this.sys.game.config.width * 2, 10);

        this.snow = particles.createEmitter({
            x: 0,
            y: 0,
            speedX: {
                min: 100,
                max: 150
            },
            speed: {
                min: 15,
                max: 100
            },
            gravityY: 70,
            // angle: { min: 0, max: 90 },
            scale: {
                min: .1,
                max: .3
            },
            alpha: {
                min: .3,
                max: .9
            },
            quantity: 5,
            lifespan: 15000,
            frequency: 100,
            emitZone: {
                source: emitZone
            },
            deathZone: {
                type: 'onEnter',
                source: deathZone
            }
        });

        this.snowContainer.add(particles);

        // GB kometa

        this.gbMeteor = this.add.sprite(-100, 400, 'snow');
        this.gbMeteor.setScale(.2)

        this.tweens.add({
            targets: this.gbMeteor,
            props: {
                x: {
                    value: this.sys.game.config.width + 100,
                    duration: 4000,
                    delay: 0,
                    ease: 'Linear',
                    repeat: 0
                },
                y: {
                    value: 200,
                    duration: 4000,
                    delay: 0,
                    ease: 'Linear',
                    repeat: 0
                },
                angle: {
                    value: 360,
                    duration: 4000,
                    delay: 0,
                    repeat: 0
                }
            },
            loop: -1,
            loopDelay: 5000,
            onLoop: function (tween, targets) {
                targets[0].x = 20;
                tween.targets[0].y = 0
            }
        });

        // ogon komety

        var tail = this.add.particles('snow');

        tail.createEmitter({
            lifespan: 1000,
            gravityY: 50,
            scale: {
                start: 1,
                end: 0
            },
            alpha: {
                start: 1,
                end: 0
            },
            quantity: 1,
            follow: this.gbMeteor
        });

        this.gbMeteor.setDepth(1)
        this.paralaxMoon.setDepth(2)
        this.paralaxHills1.setDepth(2)
        this.parallaxBack42.setDepth(2)
        this.paralaxTree1.setDepth(2)
        this.paralaxTree2.setDepth(2)
        this.snowContainer.setDepth(2)

        this.cursors = this.input.keyboard.createCursorKeys();

    }

    moveBackground(scene) {

           
        if (this.device == 'desktop'){
            
            let noDestX;

            switch (scene) {
                case 'MainMenu':
                    noDestX = 0;
                    break;
                case 'TutorScene':
                    noDestX = 1;
                    break;
                case 'CreditsScene':
                    noDestX = 2;
                    break;
                case 'GameScene':
                    noDestX = 3;
                    break;
                case 'HighscoreScene':
                    noDestX = 4;
                    break;
                case 'SaveScore':
                    noDestX = 5;
                    break;
            }

            // położenie elementów tła w osi X w zależności od sceny
            // sceny po kluczu numerycznym
            this.scene.resume();
            if (scene == 'GameScene') {
                this.scene.sleep();
            } else {
                this.scene.wake();

                let destX = [
                    [400, 430, 450, 700, 1000, 1400], // ksiezyc
                    [0, -100, -200, -300, -1200, -300], // linia drzew
                    [0, -200, -400, -600, -800, -600],
                    [0, -200, -400, -600, -800, -600],
                    [-400, -800, -1400, -2000, -2600, -2000], // pagorki duze
                    [-50, -650, -1200, -1800, -2400, -1800], // drzewo lewa
                    [this.sys.game.config.width, 300, -300, -300, -300, -300], // drzewo prawa
                    [0, -200, -400, -600, -800, -1000, -600] // snieg
                ]

                this.tweens
                    .add({
                        targets: [
                            this.paralaxMoon,
                            this.parallaxBack42,
                            this.paralaxHills1,
                            this.paralaxTree1,
                            this.paralaxTree2,
                            this.snowContainer
                        ],
                        props: {
                            x: {
                                value: {
                                    getEnd: function (target, key, value, targetIndex, totalTargets, tween) {
                                        return destX[targetIndex][noDestX];
                                    }
                                },
                                duration: 1600,
                                delay: 0,
                                ease: 'Back.easeInOut'
                            }
                        },
                    })
            }
        }
        else if(this.device == 'mobile'){
            if (scene == 'GameScene') {
                this.scene.sleep();
            } 
        }
    }
}