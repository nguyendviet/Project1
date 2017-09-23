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
var foodChosen = food[Math.floor(Math.random() * food.length)];

console.log('food chosen: ', foodChosen);



//if create game, copy key

//push chosen food to firebase

//build hangman game

//push winner name

//firebase show all users winner name + chosen food
