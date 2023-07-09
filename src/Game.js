import Phaser from 'phaser';
import dialogData from '../dialogs/dialogData.js';

export default class Game extends Phaser.Scene {
	constructor() {
		super('game');
		this.cursors = null;
		this.paul = null;
		this.anne = null;
		this.currentDialog = null;
		this.dialogIndex = 0;
		this.dialogText = null;
		this.dialogInProgress = false;
		this.paulDialogText = null;
		this.anneDialogText = null;
		this.map1 = null;
		this.map2 = null;
		this.currentMap = null;
		this.worldGroundLayer = null;
		this.worldForestLayer = null;
		this.worldDungeonLayer = null;
		this.worldCampLayer = null;
		this.dungCitylayer = null;
		this.dungLayer = null;
		this.wallsLayer = null;
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create() {
		// ------------MUSIC---------------
		const backgroundMusic = this.sound.add('backgroundMusic', { loop: true });

		// Dodaj odtwarzacz audio jako zmienną lokalną, dostępną dla całej funkcji create()
		let audioPlayer;

		// Utwórz funkcję, która uruchomi odtwarzacz audio po interakcji użytkownika
		const startAudioContext = () => {
			audioPlayer = backgroundMusic.play();
			// Usuń zdarzenie, aby nie wywoływać startAudioContext() ponownie po kolejnych interakcjach
			document.removeEventListener('click', startAudioContext);
		};

		// Dodaj nasłuchiwanie zdarzenia kliknięcia na dokument, aby wywołać startAudioContext()
		document.addEventListener('click', startAudioContext);

		// ------------SCENA 1---------------
		const cityMap = this.make.tilemap({ key: 'dungeon' });
		const tileSetCity = cityMap.addTilesetImage('WorldCity', 'tiles1');

		const map = this.make.tilemap({ key: 'dungeon' });
		const tileSet = map.addTilesetImage('world', 'tiles');

		this.dungCitylayer = cityMap.createLayer('Ground', tileSetCity);
		this.dungLayer = map.createLayer('Ground', tileSet);
		this.wallsLayer = map.createLayer('Walls', tileSet);



		// ------------SCENA 2---------------
		const worldMap = this.make.tilemap({key: 'world'});
		const tileSetWorldMap = worldMap.addTilesetImage('WorldCityMap', 'tiles1')

		this.worldGroundLayer = worldMap.createLayer('world_ground', tileSetWorldMap);
		this.worldForestLayer = worldMap.createLayer('world_forest', tileSetWorldMap);
		this.worldDungeonLayer = worldMap.createLayer('world_dungeon', tileSetWorldMap);
		this.worldCampLayer = worldMap.createLayer('world_camp', tileSetWorldMap);

		this.worldGroundLayer.visible = false;
		this.worldForestLayer.visible = false;
		this.worldDungeonLayer.visible = false;
		this.worldCampLayer.visible = false;
		// ------------WYBIERANIE MAP---------------
		this.map1 = map;
		this.map2 = worldMap;
		this.currentMap = this.map1;


		// ------------KOLIZJA---------------

		this.wallsLayer.setCollisionByProperty({ collides: true });

		// ------------CHARACTERS---------------
		this.paul = this.physics.add.sprite(128, 41, 'paul', 'Paul-0');
		this.anne = this.physics.add.sprite(630, 70, 'anne', 'Anne-0');
		this.anne.flipX = true;
		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.physics.add.collider(this.paul, this.wallsLayer);

		this.anims.create({
			key: 'Anne-idle',
			frames: this.anims.generateFrameNames('anne', { start: 0, end: 1, prefix: 'Anne-' }),
			repeat: -1,
			frameRate: 1,
		});
		this.anims.create({
			key: 'Anne-walk-left',
			frames: this.anims.generateFrameNames('anne', { start: 1, end: 3, prefix: 'Anne-' }),
			repeat: -1,
			frameRate: 6,
		});
		this.anims.create({
			key: 'Anne-walk-right',
			frames: this.anims.generateFrameNames('anne', { start: 1, end: 3, prefix: 'Anne-' }),
			repeat: -1,
			frameRate: 6,
		});

		this.anne.anims.play('Anne-idle');

		this.anims.create({
			key: 'Paul-idle',
			frames: this.anims.generateFrameNames('paul', { start: 0, end: 1, prefix: 'Paul-' }),
			frameRate: 1,
		});

		this.anims.create({
			key: 'Paul-move-right',
			frames: this.anims.generateFrameNames('paul', { start: 1, end: 3, prefix: 'Paul-' }),
			repeat: -1,
			frameRate: 6,
		});

		this.anims.create({
			key: 'Paul-move-left',
			frames: this.anims.generateFrameNames('paul', { start: 1, end: 3, prefix: 'Paul-' }),
			repeat: -1,
			frameRate: 6,
		});

		// Create text for dialog
		this.dialogText = this.add.text(16, 16, '', {
			fontFamily: 'Verdana',
			fontSize: '10px',
			fill: '#fff',
			wordWrap: {
				width: 100
			}
		} );
		this.paulDialogText = this.add.text(0, 0, '', {
			fontFamily: 'Verdana',
			fontSize: '10px',
			fill: '#fff',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			wordWrap: {
				width: 100
			}
		});
		this.anneDialogText = this.add.text(0, 0, '', {
			fontFamily: 'Verdana',
			fontSize: '10px',
			fill: '#fff',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			wordWrap: {
				width: 100
			}
		});

		const keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		keyP.on('down', () => {
			this.startFollowingPaul(this.anne);
		});

		const keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		keyE.on('down', this.changeMap, this);

		// Start the first dialog after spacebar is pressed
		this.input.keyboard.on('keydown-SPACE', () => {
			if (!this.dialogInProgress) {
				if (!this.currentDialog) {
					this.startDialog('dialog1');
				} else {
					this.nextDialog();
				}
			}
		});

		// Start the conversation with Anne after 'f' key is pressed
		this.input.keyboard.on('keydown-F', () => {
			if (!this.dialogInProgress) {
				if (!this.currentDialog) {
					this.startDialog('dialog2');
				} else {
					this.nextDialog();
				}
			}
		});
		this.input.keyboard.on('keydown-G', () => {
			if (!this.dialogInProgress) {
				if (!this.currentDialog) {
					this.startDialog('dialog3');
				} else {
					this.nextDialog();
				}
			}
		});

	}

	update(time, delta) {
		if (!this.cursors || !this.paul) {
			return;
		}

		const speed = 100;

		if (this.cursors.left?.isDown) {
			this.paul.setVelocityX(-speed);
			this.paul.flipX = true;
			this.paul.anims.play('Paul-move-left', true);
		} else if (this.cursors.right?.isDown) {
			this.paul.setVelocityX(speed);
			this.paul.flipX = false;
			this.paul.anims.play('Paul-move-right', true);
		} else if (this.cursors.up?.isDown) {
			this.paul.setVelocityY(-speed);
			this.paul.anims.play('Paul-move-right', true);
		} else if (this.cursors.down?.isDown) {
			this.paul.setVelocityY(speed);
			this.paul.anims.play('Paul-move-right', true);
		} else {
			this.paul.setVelocity(0);
			this.paul.anims.play('Paul-idle', true);
		}

		this.cameras.main.scrollX = this.paul.x - this.cameras.main.width / 2;
		this.cameras.main.scrollY = this.paul.y - this.cameras.main.height / 2;

		// Dialog interaction logic
		if (this.dialogInProgress) {
			return;
		}

		if (this.currentDialog) {
			if (this.cursors.space.isDown || this.cursors.F.isDown) {
				this.nextDialog();
			}
		}
	}
	startFollowingPaul(anne) {
		if (this.followTween) {
			this.followTween.stop(); // Zatrzymaj poprzedni Tween, jeśli istnieje
		}

		anne.anims.play('Anne-walk-right', true); // Rozpocznij animację ruchu Anne w prawo
		anne.flipX = false; // Obróć Anne w prawo

		// Tworzenie tweena, aby Anne śledziła postać Paula
		this.followTween = this.tweens.add({
			targets: anne,
			x: this.paul.x - 10,
			y: this.paul.y - 10,
			duration: 2000, // Czas trwania tweena (2 sekundy)
			onComplete: () => {
				anne.anims.play('Anne-idle'); // Zatrzymaj animację ruchu Anne
			},
			onCompleteScope: this, // Ustawienie kontekstu dla funkcji onComplete
			onUpdate: () => {
				// Aktualizacja pozycji kamery na Anne podczas śledzenia
				this.cameras.main.scrollX = anne.x - this.cameras.main.width / 2;
				this.cameras.main.scrollY = anne.y - this.cameras.main.height / 2;
			}
		});
	}
	changeMap() {
		if (this.currentMap === this.map1) {
			// Przeniesienie postaci do mapy 2
			this.currentMap = this.map2;
			this.paul.x = 90;
			this.paul.y = 100;
			this.anne.x = 105;
			this.anne.y = 100;
			this.worldGroundLayer.visible = true;
			this.worldForestLayer.visible = true;
			this.worldDungeonLayer.visible = true;
			this.worldCampLayer.visible = true;
			this.dungCitylayer.visible = false;
			this.dungLayer.visible = false;
			this.wallsLayer.visible = false;
			this.wallsLayer.setCollisionByProperty({ collides: false });
		} else {
			// Przeniesienie postaci do mapy 1
			this.currentMap = this.map1;
			this.paul.x = 128;
			this.paul.y = 41;
			this.anne.x = 630;
			this.anne.y = 70;

		}

		// Przeniesienie kamery do nowej mapy i ustawienie pozycji kamery na postaci
		this.cameras.main.centerOn(this.paul.x, this.paul.y);
		this.cameras.main.startFollow(this.paul);
	}

	startDialog(dialogKey) {
		if (dialogData.hasOwnProperty(dialogKey)) {
			this.currentDialog = dialogData[dialogKey];
			this.dialogIndex = 0;
			this.dialogInProgress = true;
			this.displayDialog();
		}
	}

	displayDialog() {
		const currentEntry = this.currentDialog[this.dialogIndex];
		const { speaker, text } = currentEntry;

		this.dialogText.setText('');
		this.paulDialogText.setText('');
		this.anneDialogText.setText('');

		if (speaker === 'Paul') {
			this.paulDialogText.setText('Paul: ' + text);
			this.positionDialogTextAboveCharacter(this.paul, this.paulDialogText);
		} else if (speaker === 'Anne') {
			this.anneDialogText.setText('Anne: ' + text);
			this.positionDialogTextAboveCharacter(this.anne, this.anneDialogText);
		}

		this.time.addEvent({
			delay: 4000, // Opóźnienie 2000ms (2 sekundy)
			callback: this.nextDialog,
			callbackScope: this,
		});
	}

	positionDialogTextAboveCharacter(character, dialogText) {
		dialogText.x = (character.x - dialogText.width / 2) - 20;
		dialogText.y = (character.y - character.displayHeight) + 35;
	}

	nextDialog() {
		this.dialogIndex++;

		if (this.dialogIndex < this.currentDialog.length) {
			this.displayDialog();
		} else {
			this.endDialog();
		}
	}

	endDialog() {
		this.currentDialog = null;
		this.dialogIndex = 0;
		this.dialogInProgress = false;
		this.dialogText.setText('');
		this.paulDialogText.setText('');
		this.anneDialogText.setText('');
	}

}


