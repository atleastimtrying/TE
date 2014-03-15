var fs = require('fs');
var _ = require('underscore');
var gameState = {player: { x:0, y:0, alive: true}, outputs: []};
var stepCommands = []; 

var updateState = function(operation){
  var nextState = _.clone(gameState);
  return function( nextState ){ return operation(nextState) }
}

var locationTextAtPoint = function(x, y, callback){
  var filename = "locations/" + x + "/" + y + ".txt";
  var results;
  fs.readFile(filename, 'utf8', function(err, data){
    results = callback(data);
  });
  return results;
}

var changeGameState = function(gameState, callback){
  nextState = _.clone(gameState);
  nextState.shit = 'poop';
  callback(nextState);
};

var actions = {
  quit: updateState(function(nextState){
      nextState.outputs.push('you fall down into a listless sleep dreaming of an alternate life, goodbye.');
      nextState.player.alive = false;
      return nextState;
  }),
  travel: function(gameState){
    var moveFunctions = {
      north: updateState( function(nextState) { nextState.player.y += 1; return nextState;}), 
      south: updateState( function(nextState) { nextState.player.y -= 1; return nextState;}),
      east: updateState( function(nextState) { nextState.player.x += 1; return nextState;}),  
      west: updateState( function(nextState) { nextState.player.x -= 1; return nextState;})
    };
    var move = moveFunctions[gameState.action];
    nextState = move(nextState);
    nextState.outputs.push('you travel' + gameState.action);
    return nextState;
  },
  
  speak: updateState(function(nextState){
    nextState.outputs.push('A feeble croak escapes your lungs, it is unintelligable');
    return nextState;
  }),
  help: updateState(function(nextState){
    nextState.outputs.push('you bleat quietly for help, there is no one to hear you. This game is lacking somewhat.');
    return nextState;
  }),

  description: function(gameState){
    return function(gameState){
      var nextState = _.clone(gameState);
      locationTextAtPoint(gameState.player.x, gameState.player.y, function(locationText){
        nextState.outputs.push(locationText);
        return nextState;
      });  
    };
  },
  north: function(gameState){
    return travel(gameState);
  },
  south: function(gameState){
    return travel(gameState);
  },
  east: function(gameState){
    return travel(gameState);
  },
  west: function(gameState){
    return travel(gameState);
  },
  error: updateState(function(nextState){
    nextState.outputs.push('You get the feeling that ' + nextState.action + ' might be important, but you aren\'t quite sure what to do about it.');
    return nextState;
  })
};

var applyCommand = function(gameState){
  var currentState = _.clone(gameState);
  var command = actions[gameState.action] || actions['error'];
  return function() { 
    return command(currentState); 
  }
};

var parse = function(input){
  return input.toLowerCase().replace('\n', '').replace(' ', '_');
};

var runState = function(stepCommands, gameState){
  return _.reduce(stepCommands, function( gameState, command ) { 
    return command(gameState) 
  }, gameState);
};

var logState = function(gameState){
  console.log(gameState); 
  return gameState;
}

var persist = function(gameState){
  return gameState;
};

var input = process.openStdin();
input.setEncoding('utf8');

input.on('data', function(text){
  stepCommands.push(function(gameState){ gameState.action = parse(text); });
  stepCommands.push(applyCommand);
  stepCommands.push(logState);
  stepCommands.push(persist);
  gameState = runState(stepCommands, gameState);
  stepCommands = [];
});

console.log('Welcome to The End, this is only the beginning.');