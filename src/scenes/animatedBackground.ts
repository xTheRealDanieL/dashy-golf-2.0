export class AnimatedBackground extends Phaser.Scene {

    constructor() {
        super({
            key : 'AnimatedBackground'
        });
    }

    create() : void {

        const background : Phaser.GameObjects.TileSprite = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'background');
        background.setOrigin(0);
        this.tweens.addCounter({
            from        : 0,
            to          : 256,
            duration    : 15000,   
            repeat      : -1,       
            onUpdate    : tween => {   

                background.setTilePosition(tween.getValue(), -tween.getValue());    
            }
        })    
    }
}