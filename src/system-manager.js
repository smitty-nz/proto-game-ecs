
class SystemManager {
    constructor(){
        this.systems = [];
    }
    add( system ){
        this.systems.push( system );
        return system;
    }
    signalAll( eventname, ...args ){
        for( let system of this.systems ){
            this.signal( system, eventname, ...args );
        }
    }
    signal( system, eventname, ...args ){
        if( system[ eventname ]){ 
            system[ eventname ]( ...args );
        }
    }
}

module.exports = SystemManager;