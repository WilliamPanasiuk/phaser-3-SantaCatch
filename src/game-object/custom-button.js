export class CustomButton extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        let tween;

        this.text = this.scene.add.text(config.x, config.y, config.text);
        this.text.setStyle({
            color: config.style.buttonText,
            setShadow: true,
            fontFamily: 'LuckiestGuy-Regular',
            fontSize: 30,
            metrics: false,
            align: 'center'
        });
        this.text.setOrigin(0.5)

        let bg_w = this.text.width + 100;
        let bg_h = this.text.height + 40;
        let bg_x = this.text.x - this.text.width / 2 - 50;
        let bg_y = this.text.y - this.text.height / 2 - 20;

        this.bg = this.scene.add.graphics({
            fillStyle: { color: config.style.buttonBackgroundH }
        });
        this.bg.fillStyle(config.style.buttonBackgroundH, 1);
        this.bg.fillRoundedRect(bg_x, bg_y, bg_w, bg_h, 20);

        this.border = this.scene.add.graphics();
        this.border.lineStyle(6, 0x232852, 1);
        this.border.strokeRoundedRect(bg_x, bg_y, bg_w, bg_h, 20);

        this.border.alpha = 0;

        this.border.setDepth(3)
        this.text.setDepth(2)
        this.bg.setDepth(1)

        this.add([this.bg, this.border, this.text]);

        this
            .setInteractive({
                hitArea: new Phaser.Geom.Rectangle(bg_x, bg_y, bg_w, bg_h),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            })

            .on('pointerover', function () {

                this.bg.fillStyle(0xffffff, .05);
                this.bg.fillPath();

                tween = this.scene.tweens.add({
                    targets: this.border,
                    duration: 500,
                    delay: 0,
                    alpha: 1,
                    repeat: -1,
                    yoyo: true
                });
            })

            .on('pointerout', function () {

                this.bg.fillStyle(config.style.buttonBackgroundH, 1);
                this.bg.fillPath();

                tween.remove();

                tween = this.scene.tweens.add({
                    targets: this.border,
                    duration: 0,
                    delay: 0,
                    alpha: 0,
                    repeat: 0,
                    yoyo: false,
                });

            })

            .on('pointerup', () => {
                config.callback();
            })

        config.scene.add.existing(this);
    }

    remove() {
        this.text.destroy();
        this.bg.destroy();
        this.border.destroy();
    }

};