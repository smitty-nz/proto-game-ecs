class Entity {
    constructor( manager ){
        this.components = {};
        this.manager = manager;
    }
    attach( component ){
        let type = component.constructor.name;
        this.components[ type ] = component;
        if( component.attach ) component.attach( this );
        this.manager.initComponent( this, component );
    }
    detach( component ){
        let type = component.constructor.name;
        delete this.components[ type ];
        if( component.detach ) component.detach( this );
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
    destroy(){
        this.manager.destroy( this );
    }
}

module.exports = Entity;

