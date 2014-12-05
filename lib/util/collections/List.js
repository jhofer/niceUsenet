'use strict';


module.exports = (function(){
  var queue = [];
  var size;
  function List(pSize){
    size = pSize;
  }

  List.prototype.add = function(val) {
    if(size !== undefined && queue.length === size){
      queue.shift();
    }
    return queue.push(val);
  };

  List.prototype.next = function(){
    return queue.shift();
  };

  List.prototype.size = function(){
    return queue.length;
  };

  List.prototype.isFull = function(){
    return queue.length === size;
  };

  List.prototype.isEmpty = function(){
    return queue.length === 0;
  };

  List.prototype.content = function(){
   return queue.slice(0);
  };


  return List;
})();


