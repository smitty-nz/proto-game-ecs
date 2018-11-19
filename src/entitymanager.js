const Events        = require( 'events' );

const Entity        = require( './entity' );
const EntityGroup   = require( './entitygroup' );

class EntityManager extends Events.EventEmitter {
    constructor( game ){
        super();
        this.singularGroup = { all : new EntityGroup() };
        this.composedGroup = new Map();
    }
    new( ...components ){
        let entity = new Entity( this );
        components.forEach( c =>{
            entity.attach( c );
        })
        
        this.singularGroup.all.tryAdd( entity );
        
        this.emit( 'new', entity );
        
        return entity;
    }
    having( ...components ){    
        let names = components.map( c => c.name || c ).sort();

        if( names.length === 0 ){ 
            return [];
        }
        
        if( names.length === 1 ){
            let name = names[ 0 ];
            if( this.singularGroup[ name ] ){
                return this.singularGroup[ name ].entities;
            }
            return []; 
        }
        
        let group = this.composedGroup.get( names );

        if( group === undefined ){
            group = new EntityGroup( names );
            this.singularGroup.all.entities.forEach( e => {
                group.tryAdd( e );
            })  
            this.composedGroup.set( names, group );
        } 
        return group.entities;
    }
    destroy( entity ){
        let components = entity.components;
        Object.entries( components ).forEach( ([name, component]) => {
            if( component.detach ) component.detach( entity );
        })
        Object.entries( components ).forEach( ([name, component]) => {
            delete entity.components[ name ]; 
        })
        this.singularGroup.all.tryRemove( entity );
    }
    initComponent( entity, component ){
        let name = component.constructor.name;

        if( !this.singularGroup[ name ] ){ 
            this.singularGroup[ name ] = new EntityGroup( [ name ] );
        }
        this.singularGroup[ name ].tryAdd( entity );
        
        this.composedGroup.forEach( ( group, key )=>{
            if( key.includes( name ) ){
                group.tryAdd( entity );
            }
        } )
    }
    destroyComponent( entity, component ){
        let name = component.constructor.name;
        
        if( this.singularGroup[ name ] ){
            this.singularGroup.tryRemove( entity );
        }

        this.composedGroup.forEach( ( group, key )=>{
            if( key.includes( name ) ){
                group.tryRemove( entity );
            }
        } )
    }
}

module.exports = EntityManager;