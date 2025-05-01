export class MainGame extends Phaser.Scene {

    constructor() {
        super('MainGame');
    }

    create() : void {

        this.scene.launch('AnimatedBackground');
        this.scene.launch('PlayGame');
    }
}