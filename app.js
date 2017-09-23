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
var players = {player1: '', player2: '', player3: '', player4: '', player5: '', player6: '', player7: '', player8: '', player9: '', player10: ''};
var playerCount = 0;
var myInfo = {name: '', gameID: '', food: ''};
var foodChosen = food[Math.floor(Math.random() * food.length)];

console.log('food chosen: ', foodChosen);

function enterName() {
	var name = $('.name').val().trim();

	if (name) {
		console.log('name: ', name);

		myInfo.name = name;

		console.log('myInfo: ', myInfo);

		switch (playerCount) {
			case 0:
				database.ref(myInfo.gameID + '/players').update({player1: myInfo.name});
			break;

			case 1:
				database.ref(myInfo.gameID + '/players').update({player2: myInfo.name});
			break;
		}
		
		playerCount++;
	}
	else {
		return;
	}
}

database.ref().on('child_added', function(snap) {
	myInfo.gameID = snap.key;
	
	$('.notification').html('Your game ID: ' + snap.key);

	console.log(snap.key);
});

$('.btnEnter').on('click', function(event) {
	event.preventDefault();

	enterName();
});

$('.btnCreate').on('click', function(event) {
	event.preventDefault();

	database.ref().push({players});

	/*console.log('current no of players: ', playerCount);*/

	/*console.log('push to firebase: ', myInfo.name);*/

	/*$('.choice').hide();
	$('.game').css('display', 'block');*/
	/*$('.gameID').html('Your game ID: ' + myInfo.gameID)*/
});

/*$('.btnJoin').on('click', function(event) {
	event.preventDefault();

	var id = $('.gameID').val().trim();

	if (id) {
		console.log('existing game ID: ', id);

		database.ref(id + '/players').update({player2: myInfo.name});
	}
	else {
		return;
	}
});*/

//build hangman game

//push winner name

//firebase show all users winner name + chosen food
