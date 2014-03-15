var Events = function(){
  var events = {};
  var addMethod = function(eventName, method){
    var methodArr = events[eventName];
    if(!methodArr){
       methodArr = events[eventName] = [];
    }
    methodArr.push(method);
  };

  var removeMethod = function(eventName, method ){
    var methodArr = events[eventName];
    if(!methodArr) return false;
    var position = methodArr.indexOf(method);
    methodArr.splice(position, 1);
    return true;
  };

  var fireEvent = function(eventName, data){
    var methodArr = events[eventName];
    var fired = false;
    methodArr.forEach(function(element){
      if(data){
        element(data);
      }else{
        element();
      }
      fired = true;
    });
    return fired;
  };
  
  return {
    add: addMethod,
    remove: removeMethod,
    fire: fireEvent
  };
}();

module.exports = Events;