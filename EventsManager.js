
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
    this._eventsMap = {};
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

    var _this = this;

    if(typeof handler != 'function'){
        return false;
    }

    if(typeof this._eventsMap[eventName] == 'undefined'){
        this._eventsMap[eventName] = [];
    }

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

        if(typeof target === 'undefined' || target === null || this.target === target){
            this.handler.apply(this.context, arguments);
        }

        if(this.next){
            this.next.applyHandler.apply(this.next,arguments);
        }
    };

    var handlers = this._eventsMap[eventName];

    handlers.push(node);


    if(handlers.length>1){
        var prev = handlers[ handlers.length -2];
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

    if(this._eventsMap[eventName]==='undefined' || this._eventsMap[eventName].length==0){
        return;
    }

    var events = this._eventsMap[eventName],
        length = events.length,
        i=0;


    for(;i<length;i++){

        if(events[i].handler === handler){

            var prev = events[i].previous;
            var next = events[i].next;

            events.splice(i,1);

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

    if(typeof this._eventsMap[eventName] == 'undefined'){
        return;
    }

    var args = [].slice.call(arguments,1);
    var node = this._eventsMap[eventName][0];

    node.applyHandler.apply(node,args);

    return this;
};


document.addEventListener('DOMContentLoaded',function(){

    var eventsManager = new EventsManager();


    function node1(){console.log('node1');}
    function node2(){console.log('node2');}
    function node3(){console.log('node3');}
    function node4(){console.log('node4');}
    function node5(){console.log('node5');}
    function node6(){console.log('node6');}

    var testElement = document.getElementById('test');

    eventsManager
        .on('test',node1)
        .on('test',node2)
        .on('test',node3)
        .off('test',node3)
        .on('test',node4)
        .on('test',node5,null,testElement)
        .off('test',node5)
        .on('test',node6,null,testElement)
        .trigger('test',testElement,'param1','param2','param3','param4','etc ...');

});