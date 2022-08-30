export default class Preloader extends Phaser.Scene {

	constructor() {
		let files = [];

		super({
			key: "Preloader",
			pack: {
				files: files
			}
		});
	}

	onProgress(value) {
		this.loadingbar_fill.clear();
		this.loadingbar_fill.fillStyle(0xffffff, 1);
		this.loadingbar_fill.fillRoundedRect(this.sys.game.config.width / 2 - 145, this.sys.game.config.height / 2 + 53, 290 * value, 3, 3);
	}

	onFileProgress(file) {

	}

	preload() {

		this.loadingbar_bg = this.add.graphics();

		this.loadingbar_bg.fillStyle(0xFF8300, 1);
		this.loadingbar_bg.fillRoundedRect(this.sys.game.config.width / 2 - 150, this.sys.game.config.height / 2 + 50, 300, 9, 5);

		this.loadingbar_fill = this.add.graphics();

		this.loadingbar_fill.fillStyle(0xffffff, 1);
		this.loadingbar_fill.fillRoundedRect(this.sys.game.config.width / 2 - 145, this.sys.game.config.height / 2 + 53, 290, 3, 3);

		this.load.on('progress', this.onProgress, this);
		this.load.on('fileprogress', this.onFileProgress, this);

		this.load
			.spritesheet('saint',
				'./src/assets/sprites/saint-spritesheet.png', {
				frameWidth: 160,
				frameHeight: 240,
			})
			.image('ground-img', './src/assets/sprites/ground.png')
			.image('tray', './src/assets/sprites/tray.png')
			.image('paralax-moon', './src/assets/sprites/paralax-moon.png')
			.image('paralax-hills-1', './src/assets/sprites/paralax-hills-1.png')
			.image('paralax-hills-2', './src/assets/sprites/paralax-hills-2.png')
			.image('paralax-tree-1', './src/assets/sprites/paralax-tree-1.png')
			.image('paralax-tree-2', './src/assets/sprites/paralax-tree-2.png')
			.image('gift-1', './src/assets/sprites/gift-1.png')
			.image('gift-2', './src/assets/sprites/gift-2.png')
			.image('gift-3', './src/assets/sprites/gift-3.png')
			.image('gift-4', './src/assets/sprites/gift-4.png')
			.image('gift-5', './src/assets/sprites/gift-5.png')
			.image('gift-6', './src/assets/sprites/gift-6.png')
			.image('gift-7', './src/assets/sprites/gift-7.png')
			.image('snow', './src/assets/sprites/snow.png')
			.image('arrow', './src/assets/sprites/arrow.png')

			.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

			.audio('soundtrack', './src/assets/sound/265549__vikuserro__cheap-flash-game-tune.mp3')
			.audio('collect', './src/assets/sound/337049__shinephoenixstormcrow__320655-rhodesmas-level-up-01.mp3')
			.audio('fail', './src/assets/sound/249616__vincentm400__function-fail.mp3')
			.audio('buttonSnd', './src/assets/sound/cartoon-flip_0mhhTzj.mp3', {
			})

		this.load.on('complete', this.onLoadComplete, this);

	}
	create() {
		if (!this.buttonSnd) {
			this.buttonSnd = this.sound.add('buttonSnd');
		}

		if (!this.soundtrack) {
			this.soundtrack = this.sound.add("soundtrack");
			this.soundtrack.play({
				loop: true,
				volume: .5
			});
		}
	}

	onLoadComplete(loader, totalComplete, totalFailed) {

		let _this = this;

		WebFont.load({
			custom: {
				families: ['LuckiestGuy-Regular'],
				urls: ['./src/assets/fonts/LuckiestGuy-Regular.css'],
			},
			active: function () {
				_this.scene.transition({
					target: 'MainMenu',
					duration: 1000,
					moveAbove: true,
					onUpdate: this.transitionOut
				});

				// scena tła
				
				_this.scene.launch('Background')
				_this.scene.sendToBack('Background');		

			}
		});
		this.events.on('transitionout', targetScene => {
			this.tweens.add({
				targets: [this.loadingbar_fill, this.loadingbar_bg],
				props: {
					y: {
						value: this.sys.game.config.height + 500,
						duration: 800,
						delay: 0,
						ease: 'Back.easeIn'
					}
				}
			});
		});
	}
}