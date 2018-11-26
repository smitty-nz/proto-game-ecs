class Entity {
    constructor( manager ){
        this.id = [ '', '', '', '' ].map( s =>{ return Math.random().toString(36).substr(2, 5).toUpperCase() } ).join( '-' );
        this.components = {};
        this.manager = manager;
    }
    attach( component ){
        this.manager.initComponent( this, component );
    }
    detach( component ){
        this.manager.destroyComponent( this, component );
    }
    get( ...componentTypes ){
        componentTypes = componentTypes.map( c =>{ return c.name || c } );
        componentTypes = componentTypes.map( c =>{ return this.components[ c ] } );
        componentTypes.push( this.id );
        return componentTypes;
    }
    has( ...componentTypes ){
        componentTypes = componentTypes.map( c =>{ return c.name || c } );
        for( let c of componentTypes ){
            if( this.components[ c ] === undefined ){
                return false;
            }
        }
        return true;
    } 
}

module.exports = Entity;

