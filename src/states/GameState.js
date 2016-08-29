import Phone from 'objects/Phone';
import Obstacle from 'objects/Obstacle';
import Usb from 'objects/Usb';
import Note from 'objects/note';

import Levels from 'levels/levels.json';

const UNITS = {
	PHONE: 10,
	USB: 8,
	NOTE: 9,
	BLOCK: 1
};

const TECH = [
	'aol',
	'excite',
	'geocities',
	'myspace',
	'netzero',
	'xerox'
];

class GameState extends Phaser.State {

	preload() {
		this.game.stage.backgroundColor = '#add8e6';
		
		this.loadImages();
		this.loadAudio();

		this.notesCollected = 0;
		this.restarting = false;
		this.groups = {};
	}

	loadImages() {
		this.game.load.spritesheet('phone', 'assets/phone-atlas.png', 50, 100);

		this.game.load.image('usb', 'assets/usb.png');
		this.game.load.image('note', 'assets/note.png');
		this.game.load.image('bg', 'assets/bgs/bg.png');
		this.game.load.image('box', 'assets/box.png');
		this.game.load.image('smoke', 'assets/smoke.png');

		this.game.load.image('aol', 'assets/companies/aol.png');
		this.game.load.image('excite', 'assets/companies/excite.png');
		this.game.load.image('geocities', 'assets/companies/geocities.png');
		this.game.load.image('myspace', 'assets/companies/myspace.png');
		this.game.load.image('netzero', 'assets/companies/netzero.png');
		this.game.load.image('xerox', 'assets/companies/xerox.png');
	}

	loadAudio() {
		this.game.load.audio('airwaves', 'assets/air_waves.mp3');
		this.game.load.audio('charge', 'assets/charge.wav');
		this.game.load.audio('hurt', 'assets/hurt.wav');
		this.game.load.audio('boost', 'assets/boost.mp3');
	}

	create() {
		this.game.add.tileSprite(50, 50, 700, 500, 'bg');

		this.initPhysics();
		this.initSounds();
		this.loadLevel( this.getLevelNumber() );
	}

	getLevelNumber() {
		return -1;
	}

	initPhysics() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 500;
	}

	initSounds() {
		this.game.sounds = {
			airwaves: this.game.add.audio('airwaves'),
			charge: this.game.add.audio('charge'),
			hurt: this.game.add.audio('hurt'),
			boost: this.game.add.audio('boost')
		};

		this.game.sounds.airwaves.volume = 0.1;
		this.game.sounds.charge.volume = 0.1;
		this.game.sounds.hurt.volume = 0.2;
		this.game.sounds.boost.volume = 0.1;
	}

	loadLevel( level_num ) {
		let mapLoader = new MapLoader( Levels[`level_${level_num}`], level_num );

		this.addPlayerGroup( mapLoader );
		this.addObstacleGroup( mapLoader );
		this.addNotesGroup( mapLoader );
		this.addUsbGroup( mapLoader );
	}

	addPlayerGroup( mapLoader ) {
		this.groups.player = this.game.add.group();

		let player = mapLoader.getUnitsById( UNITS.PHONE )[0]; 
		let phone = new Phone( this.game, player.x, player.y );

		this.groups.player.add( phone );
	}

	addObstacleGroup( mapLoader ) {
		this.groups.obstacles = this.game.add.group();

		let spriteKey = this.getSpriteKeyById( this.getLevelNumber() );

		let obstacles = mapLoader.getUnitsById( UNITS.BLOCK );
		obstacles.forEach( obs => {
			this.groups.obstacles.add( new Obstacle(this.game, obs.x, obs.y, 'box') );
		});
	}

	getSpriteKeyById( level_num ) {
		return TECH[ level_num-1 ];
	}

	addNotesGroup( mapLoader ) {
		this.groups.notes = this.game.add.group();

		let notes = mapLoader.getUnitsById( UNITS.NOTE );

		notes.forEach( note => {
			this.groups.notes.add( new Note(this.game, note.x, note.y) );
		});
	}

	addUsbGroup( mapLoader ) {
		this.groups.usb = this.game.add.group();

		let usbUnits = mapLoader.getUnitsById( UNITS.USB );

		usbUnits.forEach( usb => {
			this.groups.usb.add( new Usb(this.game, usb.x, usb.y) );
		});
	}

	update() {
		this.game.physics.arcade.overlap(this.groups.player, this.groups.notes, (p,n) => {
			if( !n.dancing ) {
				this.notesCollected++;

				n.dancing = true;

				let duration = 2000;
				this.game.add.tween(n).to( { angle: 360 }, duration, Phaser.Easing.Linear.None, true);
				this.game.add.tween(n.scale).to( { x: 0.25, y: 0.25 }, duration, Phaser.Easing.Linear.None, true);

				setTimeout( () => {
					n.kill();
				}, duration );

				this.game.sounds.airwaves.play();
			}

			if( this.notesCollected >= 4 && !p.dancing ) {
				p.dance();

				setTimeout( () => {
					let nextLevel = `Level${this.getLevelNumber() + 1}`;
					this.game.state.start( nextLevel );
				}, 3000 );
			}
		});

		this.game.physics.arcade.collide(this.groups.player, this.groups.usb, (p,u) => {
			u.collideWithPlayer(p,u,this.game.sounds);
		});

		this.game.physics.arcade.collide(this.groups.player, this.groups.obstacles, (p,o) => {
			if( !p.dancing ) {
				p.frame = 2;
				this.restartLevel(p);
			}
		});
	}

	restartLevel(p) {
		if( !this.game.restarting ) {
			this.restarting = true;
			this.game.sounds.hurt.play();

			p.body.allowGravity = false;
			p.body.velocity.setTo( 0, 0 );
			p.dancing = true;

			let duration = 2000;
			this.game.add.tween(p.scale).to( { x: 0.25, y: 0.25 }, duration, Phaser.Easing.Linear.None, true);

			setTimeout( () => {
				this.game.tallyDeath();
				this.game.state.start(`Level${this.getLevelNumber()}`,true);	
			}, duration );
		}

	}

	render() {
		if( this.getLevelNumber() === 7 ) {
			this.game.debug.text( `End`, 300, 200 );
			this.game.debug.text( `Deaths: ${this.game.getDeaths()}`, 300, 215 );
			this.game.debug.text( `Time: ${this.game.getFinalTime()}s`, 300, 230 );
		} else {
			this.game.debug.text( `Battery Power: ${this.groups.player.children[0].battery}`, 10, 15 );
			this.game.debug.text( `Deaths: ${this.game.getDeaths()}`, 10, 30 );
			this.game.debug.text( `Time: ${this.game.getTime()}s`, 10, 45 );

			this.game.debug.text( `Level: ${this.getLevelNumber()}`, 620, 15)
			let numNotes = ((this.getLevelNumber()-1) * 4) + this.notesCollected;
			this.game.debug.text( `Ringtones: ${numNotes} / 24`, 620, 30 );

			this.game.debug.text( `Controls: W,A,S,D`, 10, 580 );
		}
	}
}

class MapLoader {
	constructor( map, level_num ) {
		this.map = map.layers[0].data;
		this.level_num = level_num;

		this.unitSize = Number(map.tileheight);
		this.width = Number(map.width);
		this.height = Number(map.height);
	}

	getUnitsById( id ) {
		let units = [];

		this.map.forEach( (itemId,index) => {
			if( id === itemId ) {
				let yCoord = Math.floor(index / this.width);
				
				let offset = yCoord * this.width;
				let xCoord = index - offset;

				units.push({
					id: itemId,
					x: this.unitSize * xCoord,
					y: this.unitSize * yCoord
				});
			}
		});

		return units;
	}
}

export default GameState;
