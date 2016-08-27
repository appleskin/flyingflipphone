class Input {

	constructor(game) {
		super(game, x, y, key, frame);

    	this.game.physics.enable( [ this ], Phaser.Physics.ARCADE);
    	this.body.collideWorldBounds = true;
	}
}

export default Input;