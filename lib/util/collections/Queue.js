'use strict';


module.exports = (function(){
  var queue = [];
  var size;
  function Queue(pSize){
    size = pSize;
  }

  Queue.prototype.add = function(val) {
    if(size !== undefined && queue.length === size){
      queue.shift();
    }
    return queue.push(val);
  };

  Queue.prototype.next = function(){
    return queue.shift();
  };

  Queue.prototype.size = function(){
    return queue.length;
  };

  Queue.prototype.isFull = function(){
    return queue.length === size;
  };

  Queue.prototype.isEmpty = function(){
    return queue.length === 0;
  };

  Queue.prototype.content = function(){
   return queue.slice(0);
  };


  return Queue;
})();


