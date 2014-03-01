//imports
var events = require('events');
//beginnings

var parseInput = function(string){
  if(string === "quit\n"){
    console.log('you fall down into a listless sleep dreaming of an alternate life, goodbye.');
    process.exit(0);
  }else{
    console.log('you just said \n' + string);
  }
};

var input = process.openStdin();
input.setEncoding('utf8');
input.on('data', parseInput);

console.log('Welcome to The End, this is only the beginning.');