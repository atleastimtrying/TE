var _ = require('underscore');
var Promise = require("bluebird");
var fs = require("fs");
var initialState = {player: { x:0, y:0, alive: true}, outputs: []};
var stepCommands = [];
var gameState = false;

var updateState = function(operation){
  return function( gameState ){
    var nextState = _.clone(gameState);
    return operation(nextState);
  };
};

var locationTextAtPoint = function(x, y){
  var fileName = "locations/" + x + "/" + y + ".txt";
  return fs.readFileSync(fileName, "utf8");
}

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
    nextState = move(gameState);
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
  description: updateState(function(nextState){
    nextState.outputs.push(locationTextAtPoint(gameState.player.x, gameState.player.y));
    return nextState;
  }),
  north: function(gameState){
    return actions.travel(gameState);
  },
  south: function(gameState){
    return actions.travel(gameState);
  },
  east: function(gameState){
    return actions.travel(gameState);
  },
  west: function(gameState){
    return actions.travel(gameState);
  },
  error: updateState(function(nextState){
    nextState.outputs.push('You get the feeling that ' + nextState.action + ' might be important, but you aren\'t quite sure what to do about it.');
    return nextState;
  })
};

var applyCommand = function(gameState){
  var currentState = _.clone(gameState);
  var command = actions[gameState.action] || actions['error'];
  return command(currentState); 
};

var parse = function(input){
  return input.toLowerCase().replace('\n', '').replace(' ', '_');
};

var runState = function(stepCommands, gameState){
  return _.reduce(stepCommands, function(gameState, command) { 
    return command(gameState);
  }, gameState);
};

var logState = function(gameState){
  gameState.outputs.forEach(function(element, index){
    console.log(element);
  }); 
  return gameState;
};

var cleanGameState = updateState(function(nextState){
  nextState.outputs = [];
  return nextState;
});

var persist = function(gameState){
  return gameState;
};

var input = process.openStdin();
input.setEncoding('utf8');

input.on('data', function(text){
  stepCommands.push(function(gameState){ 
    gameState.action = parse(text);
    return gameState; 
  });
  stepCommands.push(applyCommand);
  stepCommands.push(logState);
  stepCommands.push(cleanGameState);
  stepCommands.push(persist);
  gameState = runState(stepCommands, ( gameState ? gameState : initialState ));
  stepCommands = [];
});

console.log('Welcome to The End, this is only the beginning.');
