import GameState from 'states/GameState';
import Level1 from 'states/Level1';
import Level2 from 'states/Level2';
import Level3 from 'states/Level3';
import Level4 from 'states/Level4';
import Level5 from 'states/Level5';
import Level6 from 'states/Level6';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
		
		this.state.add('Level1', Level1, false);
		this.state.add('Level2', Level2, false);
		this.state.add('Level3', Level3, false);
		this.state.add('Level4', Level4, false);
		this.state.add('Level5', Level5, false);
		this.state.add('Level6', Level6, false);

		this.state.start('Level3');
	}

}

new Game();
