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

var database = firebase.database();

var food = ['pizza', 'hamburger', 'pho', 'carbonara'];

var myInfo = {name: '', creator: false};

var playersInGame;

//log in

//type in name. hit enter
//name stored local
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
			$('.create').css('display', 'block');
		}
	}
	else {
		return;
	}
});

//create game:
//push name to firebase
$('.btnCreate').on('click', function() {
	var myRef = database.ref('players').push(myInfo);

	myRef.onDisconnect().remove();

	$('.join').hide();

	myInfo.creator = true;

	/*$('.start').css('display', 'block');*/
});

$('.btnJoin').on('click', function(event) {
	event.preventDefault();

	var myRef = database.ref('players').push(myInfo); //same as create for testing

	myRef.onDisconnect().remove();

	$('.join').hide();
});


//when 2 or more players join, open chat, open start button

database.ref('players').on('value', function(snap) {
	playersInGame = snap.numChildren();

	if (playersInGame !== 0 ) {
		$('.notify').html('Current number of players: ' + playersInGame);

		$('.create').hide();

		if (myInfo.creator !== true) {
			$('.join').css('display', 'block'); //only show join button to playrers not the creator
		}

		if (playersInGame >= 2) {
			$('.start').css('display', 'block'); //show start button when there are 2 or more players
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
	}

	console.log(playersInGame);
});

//play game

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

database.ref('chat').on('child_added', function(snap) {
	$('.messageBoard').append(snap.val());
});

$('.btnWin').on('click', function() {
	database.ref('winner').set(myInfo);
});

database.ref('winner').on('child_added', function(snap) {
	$('.notify').html('The winner is ' + snap.val());

	setTimeout(clear, 1000 * 3);
});

function clear() {
	database.ref('players').remove();
}

$('.btnStart').on('click', function(){
	database.ref('start').set(myInfo);
});

database.ref('start').on('child_added', function(snap) {
	$('.notify').html(snap.val() + 'has started the game!');
});

database.ref('start').on('value', function() {
	$('.create').hide();
	$('.join').hide();
	$('.start').hide();
});