export class Boot extends Phaser.Scene {

    constructor() {
        super('Boot');
    }

    preload() : void {
        
    }

    create() : void {
        this.scene.start('PreloadAssets');
    }
}
