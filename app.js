// Initialize Firebase
var config = {
	apiKey: "AIzaSyAawFegEX70qU1MknTwFYviIqHbqgS3-NQ",
	authDomain: "project1-d8c77.firebaseapp.com",
	databaseURL: "https://project1-d8c77.firebaseio.com",
	projectId: "project1-d8c77",
	storageBucket: "project1-d8c77.appspot.com",
	messagingSenderId: "510825956303"
};
firebase.initializeApp(config);

/*=========================================================================================================
GLOBAL VARS
=========================================================================================================*/

var database = firebase.database();
var food = ['pizza', 'hamburger', 'pho', 'carbonara'];
var myInfo = {name: '', creator: false};
var playersInGame;

/*=========================================================================================================
FUNCTIONS
=========================================================================================================*/

function clear() {
	database.ref('players').remove();
}

/*=========================================================================================================
FIREBASE EVENTS 
=========================================================================================================*/

//when player ref has any value
database.ref('players').on('value', function(snap) {
	playersInGame = snap.numChildren();

	if (playersInGame !== 0 ) {
		$('.notify').html('Current number of players: ' + playersInGame + '. Waiting for players...');

		$('.create').hide(); //hide create button from others when the game is created

		if (myInfo.creator !== true) {
			$('.join').css('display', 'block'); //only show join button to playrers not the creator
		}

		if (playersInGame >= 2) {
			
			if (myInfo.name !== '') {
				$('.start').css('display', 'block'); //show start button when there are 2 or more players
				$('.chat').css('display', 'block'); //only chow chat to player enter with a name
			}
		}

		if ((playersInGame === 1) && (database.ref('start'))) {
			database.ref('start').remove(); //remove in game condition if players left and only 1 player left
		}
	}
	else {
		database.ref('chat').remove();
		database.ref('winner').remove();
		database.ref('creator').remove(); //remove creator ref if 0 player
		database.ref('start').remove();

		$('.alert').html('');
		$('.messageBoard').html('');
		$('.create').hide();
		$('.join').hide();
	}

	console.log(playersInGame);
});

//when start ref has value
database.ref('start').on('child_added', function(snap) {
	$('.notify').html(snap.val() + ' has started the game!');

	$('.create').hide();
	$('.join').hide();
	$('.start').hide();
});

//play game: UNDER CONSTRUCTION

//print out messages when there is a message
database.ref('chat').on('child_added', function(snap) {
	$('.messageBoard').append(snap.val());
});

//when winner ref has value
database.ref('winner').on('child_added', function(snap) {
	$('.notify').html('The winner is ' + snap.val());


	setTimeout(clear, 1000 * 3);
});

/*=========================================================================================================
BUTTON EVENTS 
=========================================================================================================*/

//log in
$('.btnEnter').on('click', function(event) {
	event.preventDefault();

	var name = $('.name').val().trim();

	if (name) {
		myInfo.name = name;

		$('.login').hide();
		$('.hi').html('Hi ' + name);

		if (playersInGame >= 1) {

			//only show join button when there is a game and the game hasn't started yet to prevent new comers interrupt the game
			if (database.ref('start') === null) {
				$('.join').css('display', 'block');
			}
			else {
				return;
			}
			
		}
		else {
			$('.create').css('display', 'block'); //show create button if no-one in the game
		}
	}
	else {
		return;
	}
});

//create game, push name to firebase
$('.btnCreate').on('click', function() {
	var myRef = database.ref('players').push(myInfo);

	myRef.onDisconnect().remove();

	$('.join').hide(); //hide join button of creator

	myInfo.creator = true;

	/*$('.start').css('display', 'block');*/
});

//join game
$('.btnJoin').on('click', function(event) {
	event.preventDefault();

	//only allow players with name join
	if (myInfo.name === '') {
		return;
	}
	else {
		var myRef = database.ref('players').push(myInfo); //same as create for testing
	}
	
	myRef.onDisconnect().remove();

	$('.join').hide();
});

//start game
$('.btnStart').on('click', function(){
	database.ref('start').set(myInfo);
});

//create chat when a user sends a message
$('.btnSend').on('click', function(event) {
	event.preventDefault();

	var message = $('.newMessage').val().trim();

	if (message) {
		database.ref('chat').push('<p>' + myInfo.name + ': ' + message + '</p>');
	}
	else {
		return;
	}
});

//win game - just for testing (will remove this one when there is real game)
$('.btnWin').on('click', function() {
	database.ref('winner').set(myInfo);
});

/*=========================================================================================================
w3w Words Call Upon Winning UNDERCONSTRUCTION 
=========================================================================================================*/

var latLong = "38.881487,-77.116197";

	$("#getw3w").on("click", function() {

      // Supplying the Coordinates to the queryURL
      var queryURL = "https://api.what3words.com/v2/reverse?coords=" + latLong + "&display=full&format=json&key=9I7B51YQ"

      // Performing an AJAX request with the queryURL
      $.ajax({
          url: queryURL,
          method: "GET"
        })

      .done(function(response){
      	console.log(queryURL);
        console.log(response);
        console.log(response.words);

      //Place words response into div on screen
      // $("#words").text(response.words);
      $('.words').html('The 3 Word Address is: ' + response.words);
    })
});

