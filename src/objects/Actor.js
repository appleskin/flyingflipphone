class Actor extends Phaser.Sprite {

	constructor(game, x, y, key, frame) {
		super(game, x, y, key, frame);

    	this.game.physics.enable( [ this ], Phaser.Physics.ARCADE);
    	this.body.collideWorldBounds = true;
	}
}

export default Actor;



