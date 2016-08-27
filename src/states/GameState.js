import Phone from 'objects/Phone';
import Obstacle from 'objects/Obstacle';
import Usb from 'objects/Usb';
import Note from 'objects/note';

import Levels from 'levels/levels.json';

class GameState extends Phaser.State {

	preload() {
		this.game.stage.backgroundColor = '#add8e6';
		this.game.load.image('phone', '../assets/phone.png');
		this.game.load.image('usb', '../assets/usb.png');
		this.game.load.image('note', '../assets/note.png');
		this.game.load.audio('airwaves', '../assets/air_waves.mp3');

		this.levels = Levels.default;

		this.level = 1;
		this.groups = {};
	}

	create() {
		this.initPhysics();
		this.initSounds();
		this.loadLevel( this.level );
	}

	initPhysics() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 500;
	}

	initSounds() {
		console.log( 'sounds');
		this.sounds = {
			airwaves: this.game.add.audio('airwaves')
		};
	}

	loadLevel( level_num ) {
		let map = Levels[`level_${level_num}`];

		this.addPlayerGroup( map );
		this.addObstacleGroup( map );
		this.addNotesGroup( map );
		this.addUsbGroup( map );
	}

	addPlayerGroup( map ) {
		let phone = new Phone( this.game, map.player.x, map.player.y );

		this.groups.player = this.game.add.group();
		this.groups.player.add( phone );
	}

	addObstacleGroup( map ) {
		this.groups.obstacles = this.game.add.group();

		map.obstacles.forEach( obs => {
			this.groups.obstacles.add( new Obstacle(this.game, obs.x, obs.y, obs.key) );
		});
	}

	addNotesGroup( map ) {
		this.groups.notes = this.game.add.group();

		map.notes.forEach( note => {
			this.groups.notes.add( new Note(this.game, note.x, note.y) );
		});
	}

	addUsbGroup( map ) {
		let usb = new Usb( this.game, map.usb.x, map.usb.y );

		this.groups.usb = this.game.add.group();
		this.groups.usb.add( usb );
	}

	update() {
		this.game.physics.arcade.collide(this.groups.player, this.groups.obstacles);
		this.game.physics.arcade.collide(this.groups.player, this.groups.usb);
		this.game.physics.arcade.overlap(this.groups.player, this.groups.notes, (p,n) => { n.collideWithPlayer(p,n,this.sounds); } );
	}

	render() {
		this.game.debug.body( this.groups.player.children[0] );
	}

}

export default GameState;
