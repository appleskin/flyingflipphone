import Actor from 'objects/Actor';

class Obstacle extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, key, frame);

		this.body.allowGravity = false;
		this.body.immovable = true;

		this.game.stage.addChild(this);
	}

}

export default Obstacle;