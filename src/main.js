import Phaser from 'phaser';

import Preloader from "./scenes/Preloader.js";
import Game from './Game.js';

export default new Phaser.Game({
	type: Phaser.AUTO,
	parent: 'app',
	width: 1600,
	height: 1600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		},
	},
	scene: [Preloader, Game],
	scale: {
		zoom: 4

	}
})
