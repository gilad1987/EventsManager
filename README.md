# Events manager ( by Gilad takoni )

## Get start

**(1)** Get instance:
```javascript

var eventsManager = new EventsManager();

```

**(2)** Subscribe to an event:

```javascript
function handler(){console.log('node1');}

eventsManager.on('test',handler);
```

You can pass a target
```javascript
var targetElement = document.getElementById('test');

// event name
// handler to apply
// context that handler will be apply with
// target 

eventsManager.on('eventName',handler,null,targetElement);
```

**(3)** Trigger event:

You can pass arguments to a function

```javascript

// event name
// target 

eventsManager.trigger('eventName',targetElement,'param1','param2','param3','etc ...');
```

**(4)** Unsubscribe to an event:
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

    var testElement = document.getElementById('test');

    eventsManager
        .off('test',node1)
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
```
