import Actor from 'objects/Actor';

class Usb extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'usb', frame);

		this.body.allowGravity = false;
		this.body.immovable = true;

		this.scale.setTo( 0.5, 0.5 );

		this.game.stage.addChild(this);
	}

}

export default Usb;