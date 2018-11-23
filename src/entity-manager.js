const Events    = require( 'events' );
const Entity    = require( './class/entity' );
const SubSetMap = require( './sub-set-map' )

class EntityManager extends Events.EventEmitter {
    constructor(){
        super();
        this.componentSets = new SubSetMap();
    }
    /**
     * Creates a new entity with the given components
     * and initializes the components
     * @param  {...Component} components 
     */
    new( ...components ){
        let entity = new Entity( this );

        for( let component of components ){
            this.initComponent( entity, component );
        }

        this.componentSets.add( [ '*' ], entity );
        this.emit( 'new', entity );

        return entity;
    }
    /**
     * Destroys the given entity
     * also destroys any components it holds
     * @param {Entity} entity 
     */
    destroy( entity ){
        let components = entity.components;

        for( let [ key, component ] of Object.entries( components ) ){
            this.destroyComponent( entity, component );
        }

        this.componentSets.delete( [ '*' ], entity );
        this.emit( 'destroy', entity );
    }
    /**
     * Returns the set of entities that have the supplied
     * component types.
     * @param  {...any} componentTypes array of class constructors or class name strings
     * @return {Set} Reference to the set of entities with the given component types
     */
    having( ...componentTypes ){
        componentTypes = componentTypes.map( c => { return c.name || c; } )
        return this.componentSets.get( componentTypes );
    }
    /**
     * Attaches the given component to the given entity
     * and initialized the component in the ECS manager.
     * @param {Entity} entity 
     * @param {Component} component 
     */
    initComponent( entity, component ){
        let name = component.constructor.name;

        // add to the entity
        entity.components[ name ] = component;
        if( component.attach ) component.attach( entity );

        // add to setmap
        this.componentSets.add( [ name ], entity );
    }
    /**
     * Removes the given component from the given entity
     * and from the ECS manager.
     * @param {Entity} entity 
     * @param {Component} component 
     */
    destroyComponent( entity, component ){
        let name = component.constructor.name;
        
        // remove from entitiy
        delete entity.components[ name ];
        if( component.detach ) component.detach( entity );

        // remove from setmap
        this.componentSets.delete( [ name ], entity );
    }
}

module.exports = EntityManager;