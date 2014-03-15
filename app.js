var fs = require('fs');
var event_queue = {};
var player = { x:0, y:0};
var gameState = {player: player};
var stepCommands = []; 
var commands = {
  quit: function(){
      return 'you fall down into a listless sleep dreaming of an alternate life, goodbye.';
      process.exit(0);
  },
  travel: function(gameState, direction){
    var nextState = _.clone(gameState);
    var moveFunctions = {
      north: function(gameState) { nextState.player.y += 1}, 
      south: function(gameState) { nextState.player.y -= 1},
      east: function(gameState) { nextState.player.x += 1},  
      west: function(gameState) { nextState.player.x -= 1}
    };
    var move = moveFunctions[direction];
    return function() {
      console.log('You travel ' + direction);
      move();
    }
  },
  
  speak: function(callback){
    callback('A feeble croak escapes your lungs, it is unintelligable');
  },
  help: function(){
    return 'you bleat quietly for help, there is no one to hear you. This game is lacking somewhat.';
  },
  look: function(){
    var filename = "locations/" + x + "/" + y + ".txt";
    fs.readFile(filename, 'utf8', function(err, data){
      if(err) throw err;
      return data;
    });  
  },
  north: function(){
    return travel('north');
  },
  south: function(){
    return travel('south');
  },
  east: function(){
    return travel('east');
  },
  west: function(){
    return travel('west');
  },
  error: function(input){
    return 'You get the feeling that ' + input + ' might be important, but you aren\'t quite sure what to do about it.';
  }
};

var match = function(command, callback){
  var action = commands['error'];
  if(commands[command]){
    action = commands[command];
  }
  return function() { 
    action(callback) 
  };
};
var normalize = function(input){
  return input.toLowerCase().replace('\n', '').replace(' ', '_');
};
var parse = function(input){
  return normalize(input);
};
var process = function(string){
  match(parse(string), callback);
};

var runState = function(stepCommands, gameState){
  return _.reduce(stepCommands, gameState); 
}

var persist = function(){
  //noop;
}

var input = process.openStdin();
input.setEncoding('utf8');

input.on('data', function(text){
  stepCommands.push(commands.process(text));
  stepCommands.push(console.log);
  stepCommands.push(persist);
  runState(stepCommands, gameState);
});

console.log('Welcome to The End, this is only the beginning.');