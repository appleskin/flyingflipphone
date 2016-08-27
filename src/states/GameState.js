import RainbowText from 'objects/RainbowText';
import Phone from 'objects/Phone';

class GameState extends Phaser.State {

	preload() {
		this.game.stage.backgroundColor = '#add8e6';

		this.game.load.image('phone', '../assets/phone.png');
	}

	create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 800;

		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let phone = new Phone( this.game, center.x, center.y );


	}

}

export default GameState;
