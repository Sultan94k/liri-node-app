
require('dotenv').config();
var moment = require('moment'); //Both required to use moment for node
moment().format();
var axios = require("axios");
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify); // this is what pulls the keys and id's from keys.js file

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
    case "song":
      spotifySong(value);
      break;
    case "movie-this":
      case "movie":
      movieThis(value);
      break;
    case "concert-this":
      case "concert":
      concertInfo(value);
      break;
    case "do-what-it-says":
      case "do":
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
  
  // combine these later, separate lines with \n
  console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name));  // logs the artist name
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
    console.log("Rotten Tomatoes Rating of the movie: " + JSON.stringify(response.data.Ratings[0].Value)); //! its showning "object"!!!
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



  function concertInfo(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
        if (response.data[0]) {
              console.log("------------------EVENT V---------------------");
              
              console.log("Event Veunue: " + response.data[0].venue.name);
              fs.appendFileSync("log.txt", "Name of the Venue: " + response.data[0].venue.name+"\n");
              console.log("Event Location: " + response.data[0].venue.city);
              fs.appendFileSync("./log.txt", "Event location: " + response.data[0].venue.city + "\n");
                var eventDateTime = moment(response.data[0].datetime);
                console.log("Event Date & Time: " + eventDateTime.format("dddd, MMMM Do YYYY"));
            }
            else {
                console.log("No results found.");
            }
        }
    ).catch(function (error) {
        console.log (error);
  });
}
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
  