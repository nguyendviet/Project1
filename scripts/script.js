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
var myInfo = {name: '', join: false};
var playersInGame;

console.log(myInfo);

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
		$('.notify').html('Current number of players: ' + playersInGame);

		$('.create').hide(); //hide create button from others when the game is created

		if (myInfo.join !== true) {
			$('.join').css('display', 'block'); //only show join button to playrers not the host
		}

		if ((playersInGame === 1) && (database.ref('start'))) {
			database.ref('start').remove(); //remove in game condition if players left and only 1 player left
		}
	}
	else {
		database.ref('chat').remove();
		database.ref('winner').remove();
		database.ref('start').remove();

		// $('.notify').html('');
		// $('.messageBoard').html('');
		$('.create').hide(10000);
		$('.join').hide(10000);
	}

	console.log(playersInGame);
});

//build: prevent 4th player joins if game started and 1 out of 3 quits
database.ref('players').on('child_removed', function(snap) {
	database.ref('start').remove();

	if ((playersInGame >= 2) && (myInfo.join === true)) {
		$('.start').show(); //only show start button to player already joined
	}
	else {
		return;
	}
});

//when start ref has value
database.ref('start').on('child_added', function(snap) {
	$('.notify').html(snap.val() + ' has started the game!');

	$('.create').hide(1000);
	$('.join').hide(1000);
	$('.start').hide(1000);
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

	console.log(myInfo);
});

//create game, push name to firebase
$('.btnCreate').on('click', function() {
	var myRef = database.ref('players').push(myInfo);

	myRef.onDisconnect().remove();

	$('.join').hide(); //hide join button of host

	myInfo.join = true;

	console.log(myInfo);

	if (playersInGame >= 1) {
		$('.start').css('display', 'block'); //show start button for player created the game
		$('.chat').css('display', 'block');
	}
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
		myInfo.join = true;
	}

	myRef.onDisconnect().remove();

	$('.join').hide();

	if (playersInGame >= 2) {
		$('.start').css('display', 'block'); //show start button only to players joined but not the creator
		$('.chat').css('display', 'block');
	}

	console.log(myInfo);
});

//start game
$('.btnStart').on('click', function(){

	if (playersInGame >=2 ) {
		database.ref('start').set(myInfo);

		console.log(myInfo);
	}
	else {
		return;
	}
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

	//clear sent message from box
	$('.newMessage').val('');
});

//win game - just for testing (will remove this one when there is real game)
$('.btnWin').on('click', function() {
	database.ref('winner').set(myInfo);
});
