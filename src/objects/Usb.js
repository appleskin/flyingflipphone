import Actor from 'objects/Actor';

class Usb extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'usb', frame);

		this.body.allowGravity = false;
		this.body.immovable = true;
		//this.body.friction = 0;

		//this.scale.setTo( 0.5, 0.5 );

		this.game.stage.addChild(this);
	}

	collideWithPlayer( player, usb, sounds ) {
		this.chargePhone( player, sounds );
	}

	chargePhone( player, sounds ) {
		player.updateChargeFrame();


		if( !player.isPressingButtons() ) {
			player.body.velocity.y = 0;	
			player.body.velocity.x = 0;

			if( player.battery < player.getMaxCharge() ) {
				player.battery += player.getChargeRate();

				if( !sounds.charge.isPlaying ) {
					sounds.charge.play();
				}
			}
		}
	}
}

export default Usb;