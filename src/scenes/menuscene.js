import { CustomButton } from '../game-object/custom-button';


export default class MainMenu extends Phaser.Scene {

    constructor() {
        super({ key: "MainMenu" });
    }

    preload() {

    }

    init(data) {  

    }



   create() {

        var style = {};

        style.buttonBackgroundH = '0xFF8300';
        style.buttonText = '#ffffff';
        style.buttonFont = 'LuckiestGuy-Regular';

        this.btnstart = new CustomButton({
            scene: this,
            style: style,
            x: this.sys.game.config.width / 2,
            y: -100,
            text: "Play ›",
            callback: this.doStart
        });

        this.btnstart.on('pointerover', function () {
            let preloader = this.scene.get('Preloader');
            preloader.buttonSnd.play({
                loop: false,
                volume: 1
            });
        }, this);

        this.events.on('transitionout', targetScene => {
            this.tweens.timeline({
                targets: [this.btnstart],
                tweens: [
                    {
                        y: this.sys.game.config.height + 200,
                        yoyo: false,
                        repeat: 0,
                        ease: 'Back.easeIn',
                        duration: 400,
                        delay: 0                        
                    }
                ]
            });
        });

        this.events.on('transitioncomplete', targetScene => {
            this.introanimation();
        });
    }

    introanimation() {
        let middleY = this.sys.game.config.height / 2;

        this.tweens.add({
            targets: this.btnstart,
            props: {
                y: {
                    value: middleY + 200,
                    duration: 800,
                    delay: 800,
                    ease: 'Back.easeOut'
                }
            }
        })

        this.tweens.add({
            targets: this.btnstart,
            yoyo: true,
            repeat: -1,
            rotation: {
                value: 0.02,
                yoyo: true,
                repeat: -1,
                duration: 1000,
                ease: 'Sine.easeInOut'
            },
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: this.tweens.stagger(
                100, {
            })
        })
    }

    doStart() {    
        this.scene.goToScene('GameScene'); 
    }

    goToScene(targetScene) {
        this.scene.transition({
            target: targetScene,
            duration: 1000,
            moveAbove: true,   
            onUpdate: this.transitionOut,
            data: { delay: 0 },
            remove: false,
            sleep: false
        });

        let backgroundScene = this.scene.get('Background');
        backgroundScene.moveBackground(targetScene);
    
    }
}