import { Levels }                       from '../levels';
import { GameOptions }                  from '../gameOptions';
import { GameBoard, TileType, Block }   from '../gameBoard';
import { submitScore, fetchLeaderboard, LeaderboardEntry } from '../leaderboard';

enum SoundToPlay {
    SHOOT,  
    HOLE   
}

enum SpriteLayer {
    BACKGROUND,  
    STATIC_ACTORS,
    MOVING_ACTORS 
}

enum TileFrame {
    WALL,          
    DARK_GRASS,    
    LIGHT_GRASS,  
    CRATE,       
    BLOCK_ON,      
    BLOCK_OFF,
    BALL,
    HOLE
}

export class PlayGame extends Phaser.Scene {
   
    constructor() {
        super('PlayGame');
    }

    board               : GameBoard;
    golfTilesGroup      : Phaser.GameObjects.Group;  
    levelText           : Phaser.GameObjects.BitmapText; 
    gameSounds          : Phaser.Sound.BaseSound[];       
    
    create() : void {

         this.data.set({
            level       : 0,
            moves       : 0, 
            canRestart  : false
        });
        this.gameSounds = [this.sound.add('shoot'), this.sound.add('hole')];
        this.golfTilesGroup = this.add.group();
        this.board = new GameBoard();
        const keyboard : Phaser.Input.Keyboard.KeyboardPlugin = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin; 
        keyboard.on('keydown', (event : any) => {
            switch (event.code) {
                
                case 'KeyW' :
                case 'ArrowUp' :
                    this.move(-1, 0);
                    break;

                case 'KeyS' :
                case 'ArrowDown' :
                    this.move(1, 0);
                    break;

                case 'KeyA' :
                case 'ArrowLeft' :
                    this.move(0, -1);
                    break;

                case 'KeyD' :
                case 'ArrowRight' :
                    this.move(0, 1);
                    break;

                case 'KeyR' :
                    if (this.data.get('canRestart')) {
                        this.data.set('canRestart', false);
                        this.tweens.killAll();
                        this.board.ball.canMove = false;
                        this.tweens.add({
                            targets     : this.golfTilesGroup.getChildren(),
                            scale       : 0,
                            duration    : 500,
                            onComplete  : () => {

                                this.golfTilesGroup.getChildren().forEach((child : Phaser.GameObjects.GameObject) => {
                                    this.golfTilesGroup.killAndHide(child);
                                });

                                this.buildLevel(this.data.get('level'));    
                            }  
                        });
                    }
                    break;
            }
        });

        this.buildLevel(this.data.get('level'));  
        this.add.sprite(0, this.game.config.height as number - 20, 'info').setOrigin(0, 1);
        this.add.sprite(this.game.config.width as number / 2, 0, 'title').setOrigin(0.5, 0);
        this.levelText = this.add.bitmapText(this.game.config.width as number / 2, 120, 'font', '').setOrigin(0.5, 1);
        this.updateLevelText();
    }

    buildLevel(level : number) : void {
       
        this.board.loadLevel(Levels[level]);

        const levelWidth : number = this.board.getColumns() * GameOptions.tileSize;
        const levelHeight : number = this.board.getRows() * GameOptions.tileSize;

        const deltaX : number = (this.game.config.width as number - levelWidth + GameOptions.tileSize) / 2;
        const deltaY : number = (this.game.config.height as number - levelHeight + GameOptions.tileSize) / 2;

        for (let i : number = 0; i < this.board.getRows(); i ++) { 
            for (let j : number = 0; j < this.board.getColumns(); j ++) {
                const posX : number = deltaX + j * GameOptions.tileSize;
                const posY : number = deltaY + i * GameOptions.tileSize; 
                switch (this.board.getValueAt(i, j)) {

                    case TileType.WALL :
                        this.addTile(posX, posY, TileFrame.WALL, SpriteLayer.BACKGROUND);                       
                        break;

                    case TileType.GRASS :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, SpriteLayer.BACKGROUND);
                        break;

                    case TileType.BALL :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, SpriteLayer.BACKGROUND);
                        this.board.ball.data = this.addTile(posX, posY, TileFrame.BALL, SpriteLayer.MOVING_ACTORS);
                        break;

                    case TileType.HOLE :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, SpriteLayer.BACKGROUND);
                        this.addTile(posX, posY, TileFrame.HOLE, SpriteLayer.STATIC_ACTORS);   
                        break;

                    case TileType.CRATE :
                        this.addTile(posX, posY, (i + j) % 2 == 0 ? TileFrame.DARK_GRASS : TileFrame.LIGHT_GRASS, 0);
                        this.board.crates[this.board.tiles[i][j].crateIndex].data = this.addTile(posX, posY, TileFrame.CRATE, SpriteLayer.MOVING_ACTORS);
                        break;

                    case TileType.BLOCK_OFF :
                        this.board.blocks[this.board.tiles[i][j].blockIndex].data = this.addTile(posX, posY, TileFrame.BLOCK_OFF, SpriteLayer.STATIC_ACTORS);
                        break;

                    case TileType.BLOCK_ON :
                        this.board.blocks[this.board.tiles[i][j].blockIndex].data = this.addTile(posX, posY, TileFrame.BLOCK_ON, SpriteLayer.STATIC_ACTORS);
                        break;                       
                }
            }
        }

        this.tweens.add({
            targets     : this.golfTilesGroup.getChildren(),
            scale       : 1,
            duration    : 500,
            onComplete  : () => {
                this.board.ball.canMove = true;
                this.data.set('canRestart', true);
            }    
        });        
    }

    updateLevelText() : void {
        this.levelText.setText('LEVEL: ' + (this.data.get('level') + 1) + '    MOVES: ' + this.data.get('moves'));
    }

    addTile(x : number, y : number, frame : number, depth : number) : Phaser.GameObjects.Sprite {
        return this.golfTilesGroup.get(x, y, 'tiles').setFrame(frame).setActive(true).setScale(0).setVisible(true).setDepth(depth);    
    }

    playSound(sfx : Phaser.Sound.BaseSound) : void {
        sfx.play({
            rate : Phaser.Math.FloatBetween(0.9, 1.1)
        });
    }

    move(deltaRow : number, deltaColumn : number) : void {

        if (!this.board.ball.canMove) {
            return;
        }
        this.board.ball.canMove = false;
        const movement : any = this.board.move(deltaRow, deltaColumn);
        if (movement.ballMovement.delta.row != 0 || movement.ballMovement.delta.column != 0 || movement.crateMovement.delta.row != 0 || movement.crateMovement.delta.column != 0) {

            if (this.data.get('level') < Levels.length - 1) {
                this.data.inc('moves');
            }
            this.playSound(this.gameSounds[SoundToPlay.SHOOT]);
            this.updateLevelText();
            this.board.blocks.forEach((block : Block) => {
                block.data.setFrame(block.active ? 4 : 5);
            })
        }

        if (movement.ballMovement.delta.row != 0 || movement.ballMovement.delta.column != 0) {
            this.moveBall(movement);   
        }
        else {
            this.moveCrate(movement.crateMovement);
        }
    }

    moveBall(movement : any) : void {

        this.tweens.add({
            targets     : this.board.ball.data,
            x           : this.board.ball.data.x + GameOptions.tileSize * movement.ballMovement.delta.column,
            y           : this.board.ball.data.y + GameOptions.tileSize * movement.ballMovement.delta.row,
            duration    : GameOptions.ballSpeed * (Math.abs(movement.ballMovement.delta.row) + Math.abs(movement.ballMovement.delta.column)),
            onComplete  : () => {

                if (this.board.ball.isInHole) {
                    this.data.set('canRestart', false);
                    this.playSound(this.gameSounds[SoundToPlay.HOLE]);
                    this.tweens.add({
                        targets     : this.board.ball.data,
                        scale       : 0,
                        duration    : 500,
                        onComplete  : () => {

                            this.tweens.add({
                                targets     : this.golfTilesGroup.getChildren(),
                                scale       : 0,
                                duration    : 500,
                                onComplete  : () => {
                                    this.golfTilesGroup.getChildren().forEach((child : Phaser.GameObjects.GameObject) => {
                                        this.golfTilesGroup.killAndHide(child);
                                    });

                                    const currentLevel = this.data.get('level');
                                    const isFinalLevel = currentLevel >= Levels.length - 1;

                                    if (isFinalLevel) {
                                        const moves = this.data.get('moves');
                                        const name = prompt("Congrats! You finished all levels.\nEnter your name for the leaderboard:");
                                        if (name) {
                                          submitScore({ name, moves });
                                        }
                            
                                        fetchLeaderboard().then((entries: LeaderboardEntry[]) => {
                                          const container = document.createElement('div');
                                          container.id = 'leaderboard';
                                          container.innerHTML = `
                                            <h2 style="color:white;">🏆 Final Leaderboard</h2>
                                            <ul style="color:white;">
                                              ${entries
                                                .sort((a, b) => a.moves - b.moves)
                                                .slice(0, 10)
                                                .map((entry) => `<li>${entry.name}: ${entry.moves} moves</li>`)
                                                .join('')}
                                            </ul>
                                            <button id="restart-btn" style="margin-top: 10px;">Restart Game</button>
                                          `;
                            
                                          document.getElementById('leaderboard')?.remove();
                                          document.body.appendChild(container);
                            
                                          document.getElementById('restart-btn')?.addEventListener('click', () => {
                                            location.reload();
                                          });
                                        });
                                      } else {

                                    this.data.inc('level');

                                    this.updateLevelText();

                                    this.buildLevel(this.data.get('level'));    
                                }  
                                }    
                            });
                        }
                    });
                }
                else {
                    this.moveCrate(movement.crateMovement);
                }
            } 
        }) 
    }

    moveCrate(movement : any) : void {
        if (movement.delta.row != 0 || movement.delta.column != 0) {
            const sprite : Phaser.GameObjects.Sprite = this.board.crates[this.board.tiles[movement.to.row][movement.to.column].crateIndex].data;
            this.tweens.add({
                targets : sprite,
                x           : sprite.x + GameOptions.tileSize * movement.delta.column,
                y           : sprite.y + GameOptions.tileSize * movement.delta.row,
                duration    : GameOptions.ballSpeed * (Math.abs(movement.delta.row) + Math.abs(movement.delta.column)),
                onComplete  : () => {

                    this.board.ball.canMove = true;
                }
            })
        }
        else {
            this.board.ball.canMove = true;    
        }
    }
}