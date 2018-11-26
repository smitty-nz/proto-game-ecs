class Registry {
    constructor(){
        this.elements = {};
        this.__removeQueue = [];
        this.__addQueue = [];
    }
    add( entity, element ){
        this.__addQueue.push( {
            entity : entity,
            element : element,
        } );
    }
    remove( entity ){
        this.__removeQueue.push( {
            entity : entity
        } );
    }
    get( entity ){
        this.__pump();
        let id = entity.id;
        return this.elements[ id ];
    }
    getAll(){
        this.__pump();
        let elements = Array.from( Object.values( this.elements ) );
        return elements;
    }
    use( entity, callback ){
        let element = this.get( entity );
        if( element ){
            callback( element );
        }
    }
    useAll( callback ){
        let elements = this.getAll();
        callback( elements );
    }
    __pump(){
        while( this.__removeQueue.length > 0 ){
            let e = this.__removeQueue.pop();
            delete this.elements[ e.entity.id ];
        }
        while( this.__addQueue.length > 0 ){
            let e = this.__addQueue.pop();
            this.elements[ e.entity.id ] = e.element;
        }     
    }
}

module.exports = Registry;