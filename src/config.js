import Preloader from './scenes/preloader'
import Background from './scenes/background'
import MainMenu from './scenes/menuscene'
import GameScene from './scenes/gamescene'

export default {
    type: Phaser.AUTO, 
    backgroundColor: '#232852',
    dom: {
        createContainer: true
    },
    audio: {
        noAudio: false,
        disableWebAudio: false
    },
    scale: {
        parent: 'the_game',
        mode: Phaser.NONE,
        width:1500,
        height:875
    },
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            debug: false,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugBodyColor: 0xffff00,
            debugBodyFillColor: 0xe3a7e3,
            debugStaticBodyColor: 0x0000ff,
            debugVelocity: true,
            debugVelocityColor: 0x00ff00,
            debugShowJoint: true,
            debugJointColor: 0x000000,
            debugWireframes: true,
            debugShowInternalEdges: true,
            debugShowConvexHulls: true,
            debugConvexHullColor: 0xaaaaaa,
            debugShowSleeping: false,
            gravity: {
                y: 1.5
            }
        }
    },
    plugins: {},
    scene: [Preloader, Background, MainMenu, GameScene]
}