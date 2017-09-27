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

//firebase vars
var database = firebase.database();
var playersRef = database.ref('players');
var startRef = database.ref('start');
var chatRef = database.ref('chat');
var winnerRef = database.ref('winner');

//browser vars
var playersInGame;
var myInfo = {name: '', join: false};

console.log(myInfo);

/*=========================================================================================================
FUNCTIONS
=========================================================================================================*/

function showGameInfo() {
	$('.start').css('display', 'block'); 
	$('.chat').css('display', 'block');
}

function clear() {
	playersRef.remove(); //might not want to clear players, maybe clear start only
}

/*=========================================================================================================
FIREBASE EVENTS 
=========================================================================================================*/

//when player ref has any value
playersRef.on('value', function(snap) {
	playersInGame = snap.numChildren();

	if (playersInGame !== 0 ) {
		$('.notify').html('Current number of players: ' + playersInGame);
		$('.create').hide(); //hide create button from others when the game is created

		if (myInfo.join !== true) {
			$('.join').css('display', 'block'); //only show join button to playrers not the host
		}

		if ((playersInGame === 1) && (database.ref('start'))) {
			startRef.remove(); //remove in game condition if players left and only 1 player left
		}
	}
	else {
		chatRef.remove();
		startRef.remove();
		winnerRef.remove();

		$('.create').hide();
		$('.join').hide();
		$('.notify').html(''); //clear notification for players not in game but don't reload browser
	}

	console.log(playersInGame);
});

//prevent 4th player joins if game started and 1 out of 3 quits
playersRef.on('child_removed', function(snap) {
	startRef.remove(); //stop game

	if ((playersInGame >= 2) && (myInfo.join === true)) {
		$('.start').show(); //only show start button to player already joined
	}
	else {
		return;
	}
});

//when start ref has value
startRef.on('child_added', function(snap) {
	$('.notify').html(snap.val() + ' has started the game!');

	$('.create').hide();
	$('.join').hide();
	$('.start').hide();
});

//play game: UNDER CONSTRUCTION

//print out messages when there is a message
chatRef.on('child_added', function(snap) {
	$('.messageBoard').append(snap.val());
});

//when winner ref has value
winnerRef.on('child_added', function(snap) {
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
			//only show join button when there is a game and the game hasn't started yet to prevent new comers from interrupting the game
			if (startRef === null) {
				$('.join').css('display', 'block');
			}
			else {
				return;
			}
		}
		else {
			//show create button if no-one already in the game
			$('.create').css('display', 'block'); 
		}
	}
	else {
		return;
	}

	console.log(myInfo);
});

//create game, push name to firebase
$('.btnCreate').on('click', function() {
	var myRef = playersRef.push(myInfo);
	myInfo.join = true;

	myRef.onDisconnect().remove();

	//hide join button of host
	$('.join').hide(); 

	if (playersInGame >= 1) {
		//show start button for player created the game
		showGameInfo();
	}

	console.log(myInfo);
});

//join game
$('.btnJoin').on('click', function(event) {
	event.preventDefault();

	//only allow players with name join
	if (myInfo.name === '') {
		return;
	}
	else {
		var myRef = playersRef.push(myInfo);
		myInfo.join = true;
	}
	
	myRef.onDisconnect().remove();

	$('.join').hide();

	if (playersInGame >= 2) {
		//show start button only to players joined
		showGameInfo();
	}

	console.log(myInfo);
});

//start game
$('.btnStart').on('click', function(){

	if (playersInGame >=2 ) {
		startRef.set(myInfo);

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
		chatRef.push('<p>' + myInfo.name + ': ' + message + '</p>');
	}
	else {
		return;
	}

	//clear sent message from box
	$('.newMessage').val(''); 
});
//the blank space below is created on purpose










// JAMES'S CODE BEGINS

/*=========================================================================================================
Write letter choices on screen -- UNDERCONSTRUCTION 
=========================================================================================================*/

var row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
var row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
var row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
var row4 = [' '];


// PRINT QWERTY KEYBOARD
// =================================================================================

//print row 1
for (var i = 0; i < row1.length; i++) {
	var lBtn = $("<button>");
	
	lBtn.addClass("letter-button letter letter-button-color");
	lBtn.attr("data-letter", row1[i]);
	lBtn.text(row1[i]);
	
	$(".row1").append(lBtn);
}

//pring row 2
for (var i = 0; i < row2.length; i++) {
	var lBtn = $("<button>");
	
	lBtn.addClass("letter-button letter letter-button-color");
	lBtn.attr("data-letter", row2[i]);
	lBtn.text(row2[i]);
	
	$(".row2").append(lBtn);
}

//print row 3
for (var i = 0; i < row3.length; i++) {
	var lBtn = $("<button>");
	
	lBtn.addClass("letter-button letter letter-button-color");
	lBtn.attr("data-letter", row3[i]);
	lBtn.text(row3[i]);
	
	$(".row3").append(lBtn);
}

//print row 4
function printRow4() {
	var lBtn = $("<button>");
	
	lBtn.addClass("letter-button button-space letter letter-button-color");
	lBtn.attr("data-letter", row4);
	lBtn.text('Space');
	
	$(".row4").append(lBtn);
}

printRow4();

/*=========================================================================================================
GUESS LETTER (HANGMAN) -- UNDERCONSTRUCTION 
=========================================================================================================*/
var food = ["pho", "curry", "lasagna", "ramen"]; //for global vars, don't call them a,b,c; they are more suitable for local vars
var foodChosen = "";
var foodChosenArray = [];
var numBlanks = 0;
var foodHidden = [];
var foodDisplayed = [];
var wrongGuesses = [];
var letterGuessed = "";

function startGame() {

      foodChosen = food[Math.floor(Math.random() * food.length)];
      console.log(foodChosen);
      foodChosenArray = foodChosen.split("");
      numBlanks = foodChosenArray.length;
      foodhHidden = [];
      
      for (var i = 0; i < numBlanks; i++) {
      foodHidden.push("_");
      }
      console.log(foodHidden.join(" "));
      foodDisplayed = foodHidden.join(' ');
      $("#word-blanks").html(foodDisplayed);
}

function checkLetters(letter) {

  var letterInWord = false;
  for (var i = 0; i < numBlanks; i++) {
    if (foodChosen[i] === letter) {
      letterInWord = true;
    }
  }

  if (letterInWord) {
    for (var j = 0; j < numBlanks; j++) {
      if (foodChosen[j] === letter) {
        foodHidden[j] = letter;
      }
    }
    var join = foodHidden.join(' ');
    $("#word-blanks").html(join);

  } else{
    run()
  }
}

function gameOver(){
  if (foodChosenArray.toString() === foodHidden.toString()) {
    // win++; don't need to increase count of win, there's only 1 game
    console.log('You win!');
  }
}
startGame();

$(document).on("click", ".letter-button", function() {
		var letterPressed = $(this).attr("data-letter").toLowerCase();

            checkLetters(letterPressed);
            console.log(letterPressed);
            gameOver();        			
  });

//TIMER
var number = 6;
    var intervalId;
    function run() {
      intervalId = setInterval(decrement, 1000);
      $('button').prop('disabled', true);
}

    function decrement() {
      number--;
      $(".pause").html("<h2>" + number + "</h2>");
      if (number === 0) {
        stop();
        console.log("Resume Play");
      }
    }
    function stop() {
      clearInterval(intervalId);
      $(".pause").html("");
      $('button').prop('disabled', false);
      reset();
    }
    function reset(){
      number = 6
    }

//END OF GAME CODE 

// JAMES'S CODE ENDS