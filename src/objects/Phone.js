import Actor from 'objects/Actor';

const STATE = {
	JUMPING: 'jumping',
	GROUNDED: 'grounded'
};

const SCALE = 1;
const SPEED = 8;
const JUMP_FORCE = 15;
const MAX_CHARGE = 200;
const CHARGE_RATE = 1;
const DISCHARGE_RATE = 1;

class Phone extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'phone', frame);

		this.state = STATE.GROUNDED;
		this.anchor.setTo( .5,.5 );
		this.scale.setTo( -SCALE, SCALE );
		this.battery = MAX_CHARGE;

		// compensate for anchor
		this.x += 15;

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

	    this.input.destroy = () => {
	    	this.input = null;
	    };
	}

	update() {
		this.handleInput();
		this.handleState();
		this.normalize();
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

		let boosting = this.input.space.isDown || this.input.w.isDown;
		let canBoost = this.battery > 0;
		if( boosting && canBoost ) {
			this.battery -= 1;
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

	normalize() {
		this.normalizeBattery();
	}

	normalizeBattery() {
		if( this.battery < 0 ) {
			this.battery = 0;
		}

		if( this.battery > MAX_CHARGE ) {
			this.battery = MAX_CHARGE;
		}
	}

	isPressingButtons() {
		let inputKeys = Object.keys( this.input );
		inputKeys.forEach( key => {
			if( this.input[key].isDown ) {
				return true;
			}
		});

		return false;
	}

	getChargeRate() {
		return CHARGE_RATE;
	}

	getMaxCharge() {
		return MAX_CHARGE;
	}
}

export default Phone;
