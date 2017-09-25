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
		$('.create').hide();
		$('.join').hide();
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
<<<<<<< HEAD
});
=======
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

/*=========================================================================================================
Write letter choices on screen -- UNDERCONSTRUCTION 
=========================================================================================================*/
    $(document).ready(function() {

      // Here we are provided an initial array of letters.
      // Use this array to dynamically create buttons on the screen.
      var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"];


      // DYNAMICALLY CREATE BUTTONS
      // =================================================================================

      // 1. Create a for-loop to iterate through the letters array.
      for (var i = 0; i < letters.length; i++) {

        // Inside the loop...

        // 2. Create a variable named "letterBtn" equal to $("<button>");
        var letterBtn = $("<button>");

        // 3. Then give each "letterBtn" the following classes: "letter-button" "letter" "letter-button-color".
        letterBtn.addClass("letter-button letter letter-button-color");

        // 4. Then give each "letterBtn" a data-attribute called "data-letter".
        letterBtn.attr("data-letter", letters[i]);

        // 5. Then give each "letterBtns" a text equal to "letters[i]".
        letterBtn.text(letters[i]);

        // 6. Finally, append each "letterBtn" to the "#buttons" div (provided).
        $("#buttons").append(letterBtn);

      }

      //ATTACH ON-CLICK EVENTS TO "LETTER" BUTTONS
      // =================================================================================

      // 7. Create an "on-click" event attached to the ".letter-button" class.
      $(".letter-button").on("click", function() {

        // Inside the on-click event...

        // Converts all key clicks to lowercase letters.
        letterGuessed = $(this).attr("data-letter");

        // Runs the code to check for correct guesses.
        checkLetters(letterGuessed);

		// Runs the code that ends each round.
		roundComplete();

      });

    });

/*=========================================================================================================
GUESS LETTER (HANGMAN) -- UNDERCONSTRUCTION 
=========================================================================================================*/
	  // Array of food Options (all lowercase).
      var foodList = ["pho", "curry", "lasagna", "ramen"];

	  // Computer selected solution will be held here.
	  var chosenWord = "";

	  // This will break the solution into individual letters to be stored in array.
	  var lettersInChosenWord = [];

	  // This will be the number of blanks we show based on the solution.
	  var numBlanks = 0;

	  // Holds a mix of blank and solved letters (ex: 'n, _ _, n, _').
	  var blanksAndSuccesses = [];

	  // Holds all of the wrong guesses.
	  var wrongGuesses = [];

	  // Holds the letters guessed
      var letterGuessed = "";

      // Game counters
      var winCounter = 0;
      var lossCounter = 0;
      var numGuesses = 9;

      // Solution chosen randomly from wordList.
      chosenWord = foodList[Math.floor(Math.random() * foodList.length)];

  	  // The word is broken into individual letters.
      lettersInChosenWord = chosenWord.split("");

      // We count the number of letters in the word.
      numBlanks = lettersInChosenWord.length;

      // We print the solution in console (for testing).
      console.log(chosenWord);

        // CRITICAL LINE
      // Here we *reset* the guess and success array at each round.
      blanksAndSuccesses = [];

      // CRITICAL LINE
      // Here we *reset* the wrong guesses from the previous round.
      wrongGuesses = [];

      // Fill up the blanksAndSuccesses list with appropriate number of blanks.
      for (var i = 0; i < numBlanks; i++) {
      blanksAndSuccesses.push("_");
      }

      console.log(blanksAndSuccesses);
      // Prints the blanks at the beginning of each round in the HTML.
      document.getElementById("word-blanks").innerHTML = blanksAndSuccesses.join(" ");


//Function to check if the Letter chosen is in the word
function checkLetters(letter) {

  // This boolean will be toggled based on whether or not
  // a user letter is found anywhere in the word.
  var letterInWord = false;

  // Check if a letter exists inside the array at all.
  for (var i = 0; i < numBlanks; i++) {

    if (chosenWord[i] === letter) {

      // If the letter exists then toggle this boolean to true.
      // This will be used in the next step.
      letterInWord = true;
    }
  }

  // If the letter exists somewhere in the word,
  // then figure out exactly where (which indices).
  if (letterInWord) {

    // Loop through the word
    for (var j = 0; j < numBlanks; j++) {

      // Populate the blanksAndSuccesses with every instance of the letter.
      if (chosenWord[j] === letter) {

        // Here we set specific blank spaces to equal the correct letter
        // when there is a match.
        blanksAndSuccesses[j] = letter;
      }
    }

    // Log the current blanks and successes for testing.
    console.log(blanksAndSuccesses);
  }

  // If the letter doesn't exist at all...
  else {

    // Then we add the letter to the list of wrong letters.
    wrongGuesses.push(letter);

    // We also subtract one of the guesses.
    numGuesses--;

  }

}

// Here we will have all of the code that needs to be run after each guess is made.
function roundComplete() {

// This will print the array of guesses and blanks onto the page.
  document.getElementById("word-blanks").innerHTML = blanksAndSuccesses.join(" ");

  // If our hangman string equals the solution.
  // (meaning that we guessed all the letters to match the solution)...
  if (lettersInChosenWord.toString() === blanksAndSuccesses.toString()) {

    // Give the user an alert
    alert("You win!");

  }

}

  
>>>>>>> 8e5fc6a7b9c1cc1c6b19cf53d77ba80d52a70511
