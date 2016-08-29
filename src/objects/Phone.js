import Actor from 'objects/Actor';

const STATE = {
	JUMPING: 'jumping',
	GROUNDED: 'grounded'
};

const FRAMES = {
	DEFAULT: 0,
	CHARGING: 1,
	CLOSED: 2
};

const SCALE = 1;
const SPEED = 8;
const JUMP_FORCE = 15;
const MAX_CHARGE = 200;
const CHARGE_RATE = 1;
const DISCHARGE_RATE = 1;

class Phone extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'phone', FRAMES.DEFAULT);

		this.state = STATE.GROUNDED;
		this.anchor.setTo( .5,.5 );
		this.scale.setTo( -SCALE, SCALE );
		this.battery = MAX_CHARGE;
		this.dancing = false;

		this.body.setSize( 35, 90, 7, 8 );

		// compensate for anchor
		this.x += 15;

    	this.emitter = this.game.add.emitter(0, 0, 200);
    	this.emitter.makeParticles('smoke');
    	this.emitter.setScale(1, 2.5, 1, 2.5, 6000, Phaser.Easing.Quintic.Out);
    	this.emitter.gravity = -600;

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
		if( this.dancing ) return;

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
			this.emitSmoke();
			if( !this.game.sounds.boost.isPlaying ) {
				this.game.sounds.boost.play();
			}
			this.battery -= 1;
			this.body.velocity.y -= JUMP_FORCE;
		}
	}

	emitSmoke() {
		this.emitter.x = this.body.x + this.body.width/2;
		this.emitter.y = this.body.y + this.body.height + 5;
		this.emitter.start(true, 3000, null, 1);
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

		if( this.battery >= MAX_CHARGE ) {
			this.battery = MAX_CHARGE;
		}

		if( this.state !== STATE.GROUNDED ) {
			this.frame = FRAMES.DEFAULT;
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

	dance() {
		this.dancing = true;

		this.body.allowGravity = false;
		this.body.velocity.setTo( 0, 0 );

		this.frame = FRAMES.CHARGING;

		let duration = 3000;
		this.anchor.setTo( 0.5, 0.75 );
		this.game.add.tween(this).to( { angle: 360 }, duration, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.scale).to( { x: 5, y: 5 }, duration, Phaser.Easing.Linear.None, true);
	}

	updateChargeFrame() {
		if( this.battery < MAX_CHARGE ) {
			this.frame = FRAMES.CHARGING;
		} else {
			this.frame = FRAMES.DEFAULT;
		}
	}

	getChargeRate() {
		return CHARGE_RATE;
	}

	getMaxCharge() {
		return MAX_CHARGE;
	}
}

export default Phone;
