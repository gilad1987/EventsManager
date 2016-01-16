
function EventsManager(){
    this._eventsMap = {};
}

EventsManager.prototype.on = function on(eventName, handler, context, target){

    var _this = this;

    if(typeof handler != 'function'){
        return false;
    }

    if(typeof this._eventsMap[eventName] == 'undefined'){
        this._eventsMap[eventName] = [];
    }

    var node = {
        next:null,
        previous:null,
        handler:handler,
        context:context?context:null,
        target:target
    };

    node.applyHandler = function applyHandler(){

        var context = this.context ? this.context : node;

        this.handler.apply(context,arguments);

        if(this.next){
            this.next.applyHandler.apply(this.next,arguments);
        }
    };

    var handlers = this._eventsMap[eventName];

    handlers.push(node);

    if(handlers.length>=2){
        var prev = handlers[ handlers.length -2];
        node.previous = prev;
        prev.next = node;
    }
};

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


};

EventsManager.prototype.trigger = function trigger(eventName){

    if(typeof this._eventsMap[eventName] == 'undefined'){
        return;
    }

    var args = [].slice.call(arguments,1);
    var node = this._eventsMap[eventName][0];

    node.applyHandler.apply(node,args);
};

var eventsManager = new EventsManager();


function node1(){console.log('node1');}
function node2(){console.log('node2');}
function node3(){console.log('node3');}
function node4(){console.log('node4');}
function node5(){console.log('node5');}

eventsManager.on('test',node1);
eventsManager.on('test',node2);
eventsManager.on('test',node3);
//eventsManager.off('test',node3);

eventsManager.on('test',node4);



eventsManager.on('test',node5);

eventsManager.off('test',node5);

eventsManager.trigger('test','bla','asdasdasd','asda','qweqwe');
