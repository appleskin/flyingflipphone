import GameState from 'states/GameState';
import Level1 from 'states/Level1';
import Level2 from 'states/Level2';
import Level3 from 'states/Level3';
import Level4 from 'states/Level4';
import Level5 from 'states/Level5';
import Level6 from 'states/Level6';
import Win from 'states/Win';

class Game extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
		
		this.state.add('Level1', Level1, false);
		this.state.add('Level2', Level2, false);
		this.state.add('Level3', Level3, false);
		this.state.add('Level4', Level4, false);
		this.state.add('Level5', Level5, false);
		this.state.add('Level6', Level6, false);
		this.state.add('Level7', Win, false);

		this.finalTime = null;
		this.deaths = 0;

		this.state.start('Level5');
	}

	tallyDeath() {
		this.deaths++;
	}

	getTime() {
		return this.round(this.time.totalElapsedSeconds(), 2);
	}

	getFinalTime() {
		if( !this.finalTime ) {
			this.finalTime = this.getTime();	
		}
		return this.finalTime;
	}

	getDeaths() {
		return this.deaths;
	}

	round( number, precision ) {
	    var factor = Math.pow(10, precision);
	    var tempNumber = number * factor;
	    var roundedTempNumber = Math.round(tempNumber);
	    return roundedTempNumber / factor;
	};
}

new Game();
