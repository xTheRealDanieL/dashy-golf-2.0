import 'phaser';                                                      
import { Boot }                 from './scenes/boot';               
import { PreloadAssets }        from './scenes/preloadAssets';      
import { AnimatedBackground }   from './scenes/animatedBackground'; 
import { MainGame }             from './scenes/mainGame';           
import { PlayGame }             from './scenes/playGame';           
import { GameOptions }          from './gameOptions';               
import './style.css';                                               

let width : number = GameOptions.gameSize.width;
let height : number = GameOptions.gameSize.height;

const windowRatio : number = window.innerWidth /  window.innerHeight;

const defaultRatio : number = width / height;

if (windowRatio > defaultRatio) {
    width = GameOptions.gameSize.height * windowRatio;
}

if (windowRatio < defaultRatio) {
    height = GameOptions.gameSize.width / windowRatio;
}

let configObject : Phaser.Types.Core.GameConfig = {
    scale : {
        mode        : Phaser.Scale.FIT,         
        autoCenter  : Phaser.Scale.CENTER_BOTH, 
        parent      : 'thegame',                
        width       : Math.round(width),        
        height      : Math.round(height)        
    },
    scene           : [
        Boot,               
        PreloadAssets,      
        MainGame,           
        AnimatedBackground, 
        PlayGame            
    ]
};
 
new Phaser.Game(configObject);