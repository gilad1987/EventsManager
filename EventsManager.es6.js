class EventsManager {
    constructor() {

        /**
         * Mapping of all event as subscribe in the instance
         * @type {{}}
         * @private
         */
        this._eventsMap = {};
    }

    on(eventName, handler, context, target) {

        const _this = this;

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

            if(typeof target === 'undefined' || target === null || this.target === target){
                this.handler.apply(this.context, arguments);
            }

            if(this.next){
                this.next.applyHandler.apply(this.next, arguments);
            }
        };

        const handlers = this._eventsMap[eventName];

        handlers.push(node);


        if(handlers.length>1){
            const prev = handlers[ handlers.length -2];
            node.previous = prev;
            prev.next = node;
        }
    }

    off(eventName, handler) {

        if(this._eventsMap[eventName]==='undefined' || this._eventsMap[eventName].length==0){
            return;
        }

        let events = this._eventsMap[eventName], length = events.length, i=0;


        for(;i<length;i++){

            if(events[i].handler === handler){

                const prev = events[i].previous;
                let next = events[i].next;

                events.splice(i, 1);

                if(prev && typeof prev.next !== null){
                    prev.next = next;
                }

                if( next && typeof next.previous !== null){
                    next.previous = prev;
                }

                break;
            }
        }


    }

    trigger(eventName, target) {

        if(typeof this._eventsMap[eventName] == 'undefined'){
            return;
        }

        const args = [].slice.call(arguments,1);
        const node = this._eventsMap[eventName][0];

        node.applyHandler.apply(node, args);
    }
}