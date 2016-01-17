class EventsManager {
    constructor() {

        /**
         * Mapping of all event as subscribe in the instance
         * @type {{}}
         * @private
         */
        this._eventsMap = new Map();
    }

    on(eventName, handler, context, target) {

        if(typeof handler != 'function'){
            return false;
        }

        let map = this._eventsMap, handlersCollection;

        if( !map.has(eventName) ){
            handlersCollection = map.set(eventName,[]);
        }

        handlersCollection = map.get(eventName);
        /**
         *
         * @type {{next: null, previous: null, handler: *, context: null, target: *, applyHandler: node.applyHandler}}
         */
        const node = {
            next:null,
            previous:null,
            handler:handler,
            context:context?context:handler,
            target:target
        };


        /**
         *
         * @param target
         */
        node.applyHandler = function applyHandler(target) {

            if( target == 'undefined' || target === null || this.target === target){
                this.handler.apply(this.context, arguments);
            }

            if(this.next){
                this.next.applyHandler.apply(this.next, arguments);
            }
        };

        handlersCollection.push(node);


        if(handlersCollection.length>1){
            const prev = handlersCollection[ handlersCollection.length -2];
            node.previous = prev;
            prev.next = node;
        }

        return this;
    }

    off(eventName, handler) {

        const map = this._eventsMap, collectionHandlers = map.get(eventName);

        if( (collectionHandlers == 'undefined')  || collectionHandlers.length == 0 ){
            return;
        }

        let length = collectionHandlers.length, i=0;


        for(;i<length;i++){

            if(collectionHandlers[i].handler === handler){

                const prev = collectionHandlers[i].previous;
                let next = collectionHandlers[i].next;

                collectionHandlers.splice(i, 1);

                if(prev && typeof prev.next !== null){
                    prev.next = next;
                }

                if( next && typeof next.previous !== null){
                    next.previous = prev;
                }

                break;
            }
        }

        return this;

    }

    trigger(eventName, target) {


        if(this._eventsMap.has(eventName)===false){
            return;
        }

        const args = [].slice.call(arguments,1);
        const node = this._eventsMap.get(eventName)[0];

        node.applyHandler.apply(node, args);

        return this;
    }
}