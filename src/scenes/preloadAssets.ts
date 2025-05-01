import { GameOptions } from "../gameOptions";

export class PreloadAssets extends Phaser.Scene {
   
    constructor() {
        super({
            key : 'PreloadAssets'
        });
    }
    
     init() : void {
        
        const barX : number = (this.game.config.width as number - GameOptions.preloadBar.size.width) / 2;
        const barY : number = (this.game.config.height as number - GameOptions.preloadBar.size.height) / 2;        
        const bar : Phaser.GameObjects.Rectangle = this.add.rectangle(barX, barY, 1, GameOptions.preloadBar.size.height, GameOptions.preloadBar.color.fill);
        bar.setOrigin(0);        

        this.add.rectangle(barX, barY, GameOptions.preloadBar.size.width, GameOptions.preloadBar.size.height).setStrokeStyle(GameOptions.preloadBar.size.border, GameOptions.preloadBar.color.container).setOrigin(0);        
        
        this.load.on('progress', (progress : number) => {
            bar.width = GameOptions.preloadBar.size.width * progress;
        });
    }
  
    preload() : void {

        this.load.image('background', 'assets/sprites/background.png');
        this.load.image('info', 'assets/sprites/info.png');
        this.load.image('title', 'assets/sprites/title.png');
        
        this.load.spritesheet('tiles', 'assets/sprites/tiles.png', {
            frameWidth  : GameOptions.tileSize,
            frameHeight : GameOptions.tileSize
        });

        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');    

        this.load.audio('shoot', ['assets/sounds/shoot.mp3', 'assets/bounce/shoot.ogg']);  
        this.load.audio('hole', ['assets/sounds/hole.mp3', 'assets/bounce/hole.ogg']);     
    }
    create() : void {

        this.scene.start('MainGame');
    }
}