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
		this.groups = {};
	}

	loadImages() {
		this.game.load.image('phone', '../assets/phone.png');
		this.game.load.image('usb', '../assets/usb.png');
		this.game.load.image('note', '../assets/note.png');
		this.game.load.image('bg', '../assets/bgs/bg.png');


		this.game.load.image('aol', '../assets/companies/aol.png');
		this.game.load.image('excite', '../assets/companies/excite.png');
		this.game.load.image('geocities', '../assets/companies/geocities.png');
		this.game.load.image('myspace', '../assets/companies/myspace.png');
		this.game.load.image('netzero', '../assets/companies/netzero.png');
		this.game.load.image('xerox', '../assets/companies/xerox.png');
	}

	loadAudio() {
		this.game.load.audio('airwaves', '../assets/air_waves.mp3');
		this.game.load.audio('charge', '../assets/charge.wav');
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
		this.sounds = {
			airwaves: this.game.add.audio('airwaves'),
			charge: this.game.add.audio('charge')
		};
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
			this.groups.obstacles.add( new Obstacle(this.game, obs.x, obs.y, spriteKey) );
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
		this.game.physics.arcade.collide(this.groups.player, this.groups.obstacles);
		
		this.game.physics.arcade.collide(this.groups.player, this.groups.usb, (p,u) => {
			u.collideWithPlayer(p,u,this.sounds);
		});
		
		this.game.physics.arcade.overlap(this.groups.player, this.groups.notes, (p,n) => {
			n.collideWithPlayer(p,n,this.sounds);

			this.notesCollected++;
			if( this.notesCollected >= 4 ) {
				let nextLevel = `Level${this.getLevelNumber() + 1}`;
				this.game.state.start( nextLevel );
			}
		});
	}

	render() {
		//this.game.debug.body( this.groups.player.children[0] );
		this.game.debug.text( `Battery Power: ${this.groups.player.children[0].battery}`, 70, 70 );
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
