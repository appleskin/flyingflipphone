import Actor from 'objects/Actor';

const STATE = {
	JUMPING: 'jumping',
	GROUNDED: 'grounded'
};

const SCALE = 1;
const SPEED = 8;
const JUMP_FORCE = 15;

class Phone extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'phone', frame);

		this.state = STATE.GROUNDED;
		this.anchor.setTo( .5,.5 );
		this.scale.setTo( -SCALE, SCALE );

		this.initInput();

		this.game.stage.addChild(this);
	}

	initInput() {
	    this.input = {
	    	w: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
	    	a: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
	    	s: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
	    	d: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
	    	space: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
	    };
	}

	update() {
		this.handleInput();
		this.handleState();
	}

	handleInput() {
		if( this.input.a.isDown ) {
			if( this.body.velocity.x > 0 ) {
				this.body.velocity.x = 0;
			}

			this.body.velocity.x -= SPEED;
			this.scale.setTo( SCALE, SCALE );
		}

		if( this.input.d.isDown ) {
			if( this.body.velocity.x < 0 ) {
				this.body.velocity.x = 0;
			}

			this.body.velocity.x += SPEED;
			this.scale.setTo( -SCALE, SCALE );
		}

		if( this.input.space.isDown || this.input.w.isDown ) {
			this.body.velocity.y -= JUMP_FORCE;
		}
	}

	handleState() {
		if( this.body.velocity.y !== 0 ) {
			this.state = STATE.JUMPING;
		} else {
			this.state = STATE.GROUNDED;
		}
	}
}

export default Phone;
