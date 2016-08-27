import Actor from 'objects/Actor';

class Note extends Actor {

	constructor(game, x, y, key, frame) {
		super(game, x, y, 'note', frame);

		this.body.allowGravity = false;

		this.game.stage.addChild(this);
	}

	collideWithPlayer( player, note, sounds ) {
		this.kill();

		sounds.airwaves.play();
	}

}

export default Note;