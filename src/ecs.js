const Events        = require( 'events' );
const Registry      = require('./class/registry' );
const EntityManager = require( './entity-manager' );
const SystemManager = require( './system-manager' );

class ECSManager extends Events.EventEmitter {
    constructor( game ){
        super();
        this.game = game;
        this.entities = new EntityManager( game );
        this.systems = new SystemManager( game );
        this.register( game );
    }
    register( game ){
        game.on( 'update', ( delta ) =>{
            this.systems.signalAll( 'update', delta );
        } )
        game.pointer.on( 'move', ( position ) =>{
            this.systems.signalAll( 'pointerMove', position );
        } )
        game.pointer.on( 'press', ( button, position ) =>{
            this.systems.signalAll( 'pointerPress', button, position );
        } )
        game.pointer.on( 'release', ( button, position ) =>{
            this.systems.signalAll( 'pointerRelease', button, position );
        } )
        game.pointer.on( 'wheel', ( direction ) =>{
            this.systems.signalAll( 'pointerWheel', direction );
        } )
        this.entities.on( 'new', ( entity )=>{
            this.systems.signalAll( 'entityNew', entity );
        } )
        this.entities.on( 'destroy', ( entity )=>{
            this.systems.signalAll( 'entityDestroy', entity );
        } )
    }
    /**
     * Creates a new entity with the given components
     * and initializes the components
     * @param  {...Component} components 
     */
    entity( ...components ){
        return this.entities.new( ...components );
    }
    /**
     * Returns the set of entities that have the supplied
     * component types.
     * @param  {...any} componentTypes array of class constructors or class name strings
     * @return {Set} Reference to the set of entities with the given component types
     */
    having( ...components ){
        return this.entities.having( ...components );
    }
    exists( ...components ){
        return this.entities.having( ...components ).size > 0;
    }
    first( ...components ){
        let entities = this.entities.having( ...components );
        if( entities.size < 1 ){
            return undefined;
        }
        return entities.values().next().value;
    }
    system( system ){
        let entities = this.having( '*' );
        for( let e of entities ){
            this.systems.signal( system, 'entityNew', e );
        }
        return this.systems.add( system );
    }
    controller( controller ){
        return this.system( controller );
    }
    renderer( renderer ){
        return this.system( renderer );
    }
    registry(){
        return new Registry();
    }
    /**
     * Destroys the given entity
     * also destroys any components it holds
     * @param {Entity} entity 
     */
    destroy( entity ){
        this.entities.destroy( entity );
    }
}

module.exports = ECSManager;