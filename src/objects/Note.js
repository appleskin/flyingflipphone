import Actor from 'objects/Actor';

class Note extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'note', frame);

		this.body.allowGravity = false;
		this.dancing = false;

		this.pulseOut = false;
		this.pulseIn = true;

		this.game.stage.addChild(this);
	}

	update() {
		if( this.pulseOut ) {
			this.pulseOut = false;
			this.game.add.tween(this.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true);
			setTimeout( () => {
				this.pulseIn = true;
			}, 1000 );
		}

		if( this.pulseIn ) {
			this.pulseIn = false;
			this.game.add.tween(this.scale).to( { x: 0.75, y: 0.75 }, 1000, Phaser.Easing.Linear.None, true);
			setTimeout( () => {
				this.pulseOut = true;
			}, 1000 );
		}
	}
}

export default Note;