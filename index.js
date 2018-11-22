const Game = require( 'proto-game' );

const ECSManager = require( './src/ecs' );

Game.ecs = new ECSManager();

module.exports = Game;