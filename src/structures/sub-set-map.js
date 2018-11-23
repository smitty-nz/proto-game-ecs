let normalizeKeys = ( keys )=>{
    let normal = keys
        .filter( ( k, i ) => { return keys.indexOf( k ) == i } )
        .sort();
    return {
        keys    : normal,
        name    : normal.join( '∩' ),
    }
}

class SuperSet extends Set {
    constructor(){
        super();
        this.children = [];
    }
    add( value ){
        super.add( value );
        for( let child of this.children ){
            child.add( value );
        }
        return this;
    }
    delete( value ){    
        super.delete( value );
        for( let child of this.children ){
            child.delete( value );
        }
        return this;
    }
}

class SubSet extends Set {
    constructor( ...parents ){
        super();
        this.parents = parents;
        if( parents.length > 0 ){
            let smallest = parents[ 0 ];
            for( let parent of parents ){
                parent.children.push( this );
                if( parent.size < smallest.size ){
                    smallest = parent;
                }
            }
            smallest.forEach( e => this.add( e ) );
        }
    }
    add( value ){
        for( let parent of this.parents ){
            if( parent.has( value ) === false ){
                return this;
            }
        }
        return super.add( value );
    }
}

class SubSetMap {
    constructor(){
        this.sets = {};
    }
    /**
     * Add the value to the set with index
     * @param {Array<String>} index 
     * @param {Object} value 
     */
    add( index, value ){
        let { keys, name  } = normalizeKeys( index );

        if( keys.length === 0 ){
            return this;
        }

        for( let key of keys ){
            if( this.sets[ key ] === undefined ){
                this.sets[ key ] = new SuperSet();
            }
            this.sets[ key ].add( value );
        }

        return this;
    }
    /**
     * Get the set with index
     * Creates a new set with index if none exists currently
     * @param {Array<String>} index 
     */
    get( index ){
        let { keys, name } = normalizeKeys( index );

        if( keys.length === 0 ){
            return undefined;
        }

        if( this.sets[ name ] ){
            return this.sets[ name ];
        }

        let supers = [];

        for( let key of keys ){
            if( this.sets[ key ] === undefined ){
                this.sets[ key ] = new SuperSet();
            }
            supers.push( this.sets[ key ] );
        }

        if( keys.length === 1 ){
            return this.sets[ name ];
        }

        this.sets[ name ] = new SubSet( ...supers );
        return this.sets[ name ];
    }
    /**
     * Removes the object from the set specified by index
     * @param {Array<String>} index 
     * @param {Object} value 
     */
    delete( index, value ){
        let { keys, name } = normalizeKeys( index );

        if( keys.length === 0 ){
            return;
        }

        for( let key of keys ){
            if( this.sets[ key ] ){
                this.sets[ key ].delete( value );
            }
        }
    }    
}

module.exports = SubSetMap;

