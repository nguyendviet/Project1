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

var myInfo = {name: ''};

//log in

//type in name. hit enter
//name stored local
$('.btnEnter').on('click', function(event) {
	event.preventDefault();

	var name = $('.name').val().trim();

	if (name) {
		myInfo.name = name;

		console.log('my name is', name);
	}
	else {
		return;
	}
});

//create or join game

//create game:
//push name to firebase
$('.btnCreate').on('click', function() {
	var myRef = database.ref('players').push(myInfo.name);

	myRef.onDisconnect().remove();
});

//when 2 or more players join, open chat, open start button

database.ref('players').on('value', function(snap) {
	var playersInGame = snap.numChildren();

	if (playersInGame !== 0 ) {
		$('.alert').html('Current number of players: ' + playersInGame);
	}
	else {
		database.ref('chat').remove();
		$('.messageBoard').html('');
	}

	console.log(playersInGame);
});

//game start: play

//join game:
//push name to firebase

//guess word

//show result

//send message
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