class Entity {
    constructor( manager ){
        this.components = {};
        this.manager = manager;
    }
    attach( component ){
        this.manager.initComponent( this, component );
    }
    detach( component ){
        this.manager.destroyComponent( this, component );
    }
    get( componentType ){
        let type = componentType.name || componentType;
        let component = this.components[ type ];
        return component;
    }
    as( componentType, method ){
        let type = componentType.name || componentType;
        let component = this.components[ type ];
        if( component === undefined ) return;
        if( method ) method( component );
        return component;
    }
}

module.exports = Entity;

