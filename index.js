const Game          = require( 'proto-game' );
const ECSManager    = require( './src/ecs' );

Game.ecs = new ECSManager( Game );

module.exports = Game;