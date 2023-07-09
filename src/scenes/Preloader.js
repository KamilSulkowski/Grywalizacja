import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {

    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles1', 'public/Spritesheet/roguelikeSheet_transparent.png')
        this.load.image('tiles', 'public/0x72_DungeonTilesetII_v1.6.png')
        this.load.tilemapTiledJSON('dungeon', 'resources/mapa1.json')
        this.load.atlas('paul', 'public/0x72_DungeonTilesetII_v1.6.png', 'public/Paul.json')
        this.load.atlas('anne', 'public/0x72_DungeonTilesetII_v1.6.png', 'public/Anne.json')
        this.load.tilemapTiledJSON('world', 'resources/map2.json')
        this.load.audio('backgroundMusic', './music/Hunters.mp3')
    }

    create() {
        this.scene.start('game');
    }
}