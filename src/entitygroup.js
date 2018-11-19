class EntityGroup {
    constructor( tags = [] ){
        this.entities = [];
        this.tags = tags;
    }
    tryAdd( entity ){
        for( let i = 0; i < this.tags.length; i++ ){
            let tag = this.tags[ i ];
            if( !entity.components[ tag ] ){ 
                return;
            }
        }
        this.entities.push( entity );
    }
    tryRemove( entity ){
        let index = this.entities.indexOf( entity );
        if( index < 0 ){ 
            return;
        }
        this.entities.splice( index, 1 );
    }
}

module.exports = EntityGroup;