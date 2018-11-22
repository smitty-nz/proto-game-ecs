const Events        = require( 'events' );
const EntityManager = require( './entity-manager' );

class ECSManager extends Events.EventEmitter {
    constructor( game ){
        super();
        this.entities = new EntityManager();
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
    system( events ){

    }
    controller( events ){

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