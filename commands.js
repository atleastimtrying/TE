module.exports = function(){
  var commands = {
    quit: function(){
      console.log('you fall down into a listless sleep dreaming of an alternate life, goodbye.');
      process.exit(0);
    },
    speak: function(){
      console.log('A feeble croak escapes your lungs, it is unintelligable');
    },
    help: function(){
      console.log('you bleat quietly for help, there is no one to hear you. This game is lacking somewhat.');
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
      return 'You get the feeling that ' + input + ' might be important, but you aren\'t quite sure what to do about it.';
    }
  };
  var match = function(command){
    var action = commands['error'];
    if(commands[command]){
      action = commands[command];
    }
    return function() { 
      action(command) 
    };
  };
  var normalize = function(input){
    return input.toLowerCase().replace('\n', '').replace(' ', '_');
  };
  var parse = function(input){
    return normalize(input);
  };
  this.process = function(string){
    match(parse(string));
  };
};