

//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var spotify = new Spotify({
  id: '14f597623ef24d5895f19fcc50ed584a',
  secret: '783bfcfc7792498ea0526b28b981f7c4'
});

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else {
    x = x + nodeArgv[i];
  }
}
// this works FINE
//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("Dazed and Confused");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

//working with 20 responses, NEED TO LOG TO log.txt

function showTweets (){

var twitterKeys = keys.twitterKeys;

var client = new twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

var params = {screen_name: "ACHarrison77", count:20};

client.get("statuses/user_timeline", params, function(error, tweets, response) {
  if (error) {
    console.log(error);
  }

  for(var i = 0; i < tweets.length; i++){
    console.log("-----------------------");
    console.log(tweets[i].text);
    console.log("-----------------------");
  }

});
}

//working with 1 response, deprecation warning
function spotifySong(song) {
    spotify.search({
        'type': 'track',
        'query': song 
    }, function (error, data) {
        if (error) {
            console.log(error + "\n");
        }
        else {
                console.log("-----------------------");
                console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
                console.log('Song Name: ' + data.tracks.items[0].name);
                console.log('Preview URL: ' + data.tracks.items[0].preview_url);
                console.log('Album Name: ' + data.tracks.items[0].album.name);
                console.log("-----------------------");
               
                // adds text to log.txt
            
                fs.appendFile('log.txt', data.tracks.items[0].album.artists[0].name);
                fs.appendFile('log.txt', data.tracks.items[0].name);
                fs.appendFile('log.txt', data.tracks.items[0].preview_url);
                fs.appendFile('log.txt', data.tracks.items[0].album.name);    
             
        }
    });
}

// deprecation, need to fix this

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + movie + '&plot=short&tomatoes=true';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
     
      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title);
      fs.appendFile('log.txt', "Release Year: " + body.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
      fs.appendFile('log.txt', "Country: " + body.Country);
      fs.appendFile('log.txt', "Language: " + body.Language);
      fs.appendFile('log.txt', "Plot: " + body.Plot);
      fs.appendFile('log.txt', "Actors: " + body.Actors);
      
    } else{
      console.log('Error occurred.')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
      console.log("-----------------------");

      //adds text to log.txt
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
      }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}



