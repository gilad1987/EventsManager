
/**
 *
 * @constructor
 */
function EventsManager(){

    /**
     * Mapping of all event as subscribe in the instance
     * @type {{}}
     * @private
     */
    this._eventsMap = new Map();
}

/**
 * Subscribe to event.
 * @param eventName
 * @param handler
 * @param context
 * @param target
 * @returns {boolean}
 */
EventsManager.prototype.on = function on(eventName, handler, context, target){

    if(typeof handler != 'function'){
        return false;
    }

    var map = this._eventsMap,
        handlersCollection;

    if( !map.has(eventName) ){
        handlersCollection = map.set(eventName,[]);
    }

    handlersCollection = map.get(eventName);
    /**
     *
     * @type {{next: null, previous: null, handler: *, context: null, target: *, applyHandler: node.applyHandler}}
     */
    var node = {
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
    node.applyHandler = function applyHandler(target){

        if( target == 'undefined' || target === null || this.target === target){
            this.handler.apply(this.context, arguments);
        }

        if(this.next){
            this.next.applyHandler.apply(this.next,arguments);
        }
    };

    handlersCollection.push(node);


    if(handlersCollection.length>1){
        var prev = handlersCollection[ handlersCollection.length -2];
        node.previous = prev;
        prev.next = node;
    }

    return this;
};

/**
 * Remove subscribe function
 * @param eventName
 * @param handler
 */
EventsManager.prototype.off = function off(eventName, handler){

    var map = this._eventsMap,
        collectionHandlers = map.get(eventName);

    if( (collectionHandlers == 'undefined')  || collectionHandlers.length == 0 ){
        return;
    }

    var length = collectionHandlers.length,
        i=0;


    for(;i<length;i++){

        if(collectionHandlers[i].handler === handler){

            var prev = collectionHandlers[i].previous;
            var next = collectionHandlers[i].next;

            collectionHandlers.splice(i,1);

            if(prev && typeof prev.next !== null){
                prev.next = next;
            }

            if( next && typeof next.previous !== null){
                next.previous=prev;
            }

            break;
        }
    }

    return this;

};

/**
 * Trigger of all subscribe function of event name, if pass the target
 * only function as subscribe with the target will be apply
 *
 * @param eventName
 * @param target
 */
EventsManager.prototype.trigger = function trigger(eventName, target){


    if(this._eventsMap.has(eventName)===false){
        return;
    }

    var args = [].slice.call(arguments,1);
    var node = this._eventsMap.get(eventName)[0];

    node.applyHandler.apply(node,args);

    return this;
};



