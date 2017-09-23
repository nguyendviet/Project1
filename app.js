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
var ref = database.ref();

var food = ['pizza', 'hamburger', 'pho', 'carbonara'];
var myInfo = {name: '', gameID: ''};
var foodChosen = food[Math.floor(Math.random() * food.length)];

console.log('food chosen: ', foodChosen);

function enterName() {
	var name = $('.name').val().trim();

	if (name) {
		console.log('name: ', name);

		myInfo.name = name;

		console.log('myInfo: ', myInfo);

		$('.userLogin').html('Hi ' + name + '!');
		$('.choice').css('display', 'block');
	}
	else {
		return;
	}
}

ref.on('child_added', function(snap) {
	myInfo.gameID = snap.key;

	console.log('game ID: ', snap.key);
	console.log('myInfo: ', myInfo);
});

$('.btnEnter').on('click', function(event) {
	event.preventDefault();

	enterName();
});

$('.btnCreate').on('click', function(event) {
	event.preventDefault();

	database.ref().push({Player1: myInfo.name});

	console.log('push to firebase: ', myInfo.name);

	$('.choice').hide();
	$('.game').css('display', 'block');
	$('.gameID').html('Your game ID: ' + myInfo.gameID)
});

$('.btnJoin').on('click', function(event) {
	event.preventDefault();

	var name = $('.gameID').val().trim();

	if (name) {
		console.log('existing game ID: ', name);
	}
	else {
		return;
	}
});

//if create game, copy key

//push chosen food to firebase

//build hangman game

//push winner name

//firebase show all users winner name + chosen food
