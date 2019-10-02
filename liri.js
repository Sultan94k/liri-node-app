
require('dotenv').config();
var axios = require("axios");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify); // this is what pulls the keys and id's from keys.js file

var keys = require("./keys.js");
var fs = require('fs');

var action = process.argv[2];
var value = process.argv[3];

//console.log(process.env);  //this is to log the API keys.

//Execute function
UserExicutes(action, value);

//FUNCTIONS
function UserExicutes(action, value) {
  switch (action) {
    case "spotify-this-song":
      spotifySong(value);
      break;
    case "movie-this":
      movieThis(value);
      break;
    case "concert-this":
      concertInfo(value);
      break;
    case "do-what-it-says":
      doWhatItSays(value);
		
      break;
    default:
      console.log("invaild entry");
  }
};

function spotifySong() {
  var trackName = process.argv.slice(2).join(" ");
console.log(trackName);

spotify.search({ type: 'track', query: trackName }, function(err, data) { 
  if (err) {
    return console.log('Error occurred: ' + err);
  } else 
  (
  // combine these later, separate lines with \n
  console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name)));  // logs the artist name
  console.log(data.tracks.items[0].name)  // logs the track name
  console.log(data.tracks.items[0].album.name)  // logs the album of the track
  console.log(data.tracks.items[0].preview_url)  // logs the preview link of the track
});
};
//todo OMDB Movies

function movieThis(value) {
// Then run a request with axios to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";
// This line is just to help us debug against the actual URL.
//console.log(queryUrl); 
axios.get(queryUrl).then(
  function(response) {
    console.log("Title: " + response.data.Title);
    console.log("Release Year: " + response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log(JSON.stringify("Rotten Tomatoes Rating of the movie: " + response.data.Ratings)); //! its showning "object"!!!
    console.log("Country: " + response.data.Country);
    console.log("Language: " + response.data.Language);
    console.log("Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
    
  })
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
};

  //todo Concerts



  function concertInfo(value) {
    
      var queryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
      request(queryUrl, function(error, response, body) {
      // If the request is successful
      if (!error && response.statusCode === 200) {
          var concerts = JSON.parse(body);
          for (var i = 0; i < concerts.length; i++) {  
              console.log("------------Event info-----------");  
              fs.appendFileSync("log.txt", "------------Event info-----------\n");//Append in log.txt file
              console.log(i);
              fs.appendFileSync("log.txt", i+"\n");
              console.log("Name of the Venue: " + concerts[i].venue.name);
              fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
              console.log("Venue Location: " +  concerts[i].venue.city);
              fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
              console.log("Date of the Event: " +  concerts[i].datetime);
              fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
              console.log("_____________________________________");
              fs.appendFileSync("log.txt", "_____________________________________"+"\n");
          }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
};

  //todo liri

  function doWhatItSays(){
    fs.readFile('random.txt', 'utf8', function(err, data){
      if (err){ 
        return console.log(err);
      }
          var dataArr = data.split(',');
          UserExicutes(dataArr[0], dataArr[1]);
    });
};
  