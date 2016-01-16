# Events manager ( by Gilad takoni )

## Get start

**(1)** Get instance:
```javascript

var eventsManager = new EventsManager();

```

**(2)** Subscribe to event:

```javascript
function handler(){console.log('node1');}

eventsManager.on('test',handler);
```

You can pass the target
```javascript
var targetElement = document.getElementById('test');

// event name
// handler to apply
// context that handler will be apply with
// target 

eventsManager.on('eventName',handler,null,targetElement);
```

**(3)** Trigger event:
```javascript

// event name
// target 

You can pass params form the third params

eventsManager.trigger('eventName',targetElement,'param1','param2','param3','etc ...');
```

**(4)** Unsubscribe to event:
```javascript
eventsManager.off('eventName',handler);
```



```javascript
document.addEventListener('DOMContentLoaded',function(){

    var eventsManager = new EventsManager();


    function node1(){console.log('node1');}
    function node2(){console.log('node2');}
    function node3(){console.log('node3');}
    function node4(){console.log('node4');}
    function node5(){console.log('node5');}
    function node6(){console.log('node6');}

    eventsManager.on('test',node1);
    eventsManager.on('test',node2);
    eventsManager.on('test',node3);
    eventsManager.off('test',node3);

    eventsManager.on('test',node4);

    var testElement = document.getElementById('test');

    eventsManager.on('test',node5,null,testElement);

    eventsManager.off('test',node5);

    eventsManager.on('test',node6,null,testElement);


    eventsManager.trigger('test',testElement,'param1','param2','param3','param4','etc ...');

});
```
