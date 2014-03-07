//Stuff to move into external files
//command based stuff
var Commands = function(){
  var commands = {
    quit: function(){
      console.log('you fall down into a listless sleep dreaming of an alternate life, goodbye.');
      process.exit(0);
    },
    speak: function(){
      console.log('A feeble croak escapes your lungs, it is unintelligable');
    },
    help: function(){
      console.log('you bleat quietly for help, there is no one to hear you. This gamei s lacking somewhat.');
    },
    look: function(){
      var filename = "locations/" + x + "/" + y + ".txt";
      fs.readFile(filename, 'utf8', function(err, data){
        if(err) throw err;
        console.log(data);
      });  
    },
    north: function(){
      travel('north');
    },
    south: function(){
      travel('south');
    },
    east: function(){
      travel('east');
    },
    west: function(){
      travel('west');
    },
    n: function(){
      travel('north');
    },
    s: function(){
      travel('south');
    },
    e: function(){
      travel('east');
    },
    w: function(){
      travel('west');
    },
    error: function(input){
      console.log('You get the feeling that ' + input + ' might be important, but you aren\'t quite sure what to do about it.');
    }
  };
  var match = function(command){
    var action = commands['error'];
    if(commands[command]){
      action = commands[command];
    }
    action(command);
  };
  var parse = function(input){
    return input.toLowerCase().replace('\n', '').replace(' ', '_');
  };
  this.process = function(string){
    match(parse(string));
  };
};

// file reading/returning based stuff

// player and player location based stuff
//imports
var events = require('events');
var fs = require('fs');
var commands = new Commands();
var x = 0;
var y = 1;


var travel = function(direction){
  console.log('You travel ' + direction);
  if(direction === "north"){
    y -= 1;
  }
  if(direction === "south"){
    y += 1;
  }
  if(direction === "east"){
    x += 1;
  }
  if(direction === "west"){
    x -= 1;
  }
  commands.process('look');
};

var input = process.openStdin();
input.setEncoding('utf8');
input.on('data', function(text){
  commands.process(text);
});

console.log('Welcome to The End, this is only the beginning.');