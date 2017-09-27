/*=========================================================================================================
Write letter choices on screen -- UNDERCONSTRUCTION 
=========================================================================================================*/
    $(document).ready(function() {
      var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"];


      // DYNAMICALLY CREATE BUTTONS
      // =================================================================================
      for (var i = 0; i < letters.length; i++) {
        var lBtn = $("<button>");
        lBtn.addClass("letter-button letter letter-button-color");
        lBtn.attr("data-letter", letters[i]);
        lBtn.text(letters[i]);
        $("#buttons").append(lBtn);
      }
    });

/*=========================================================================================================
GUESS LETTER (HANGMAN) -- UNDERCONSTRUCTION 
=========================================================================================================*/
      var a = ["pho", "curry", "lasagna", "ramen"];
  	  var b = "";
  	  var lb = [];
  	  var numBlanks = 0;
  	  var bns = [];
  	  var wrongGuesses = [];
      var letterGuessed = "";

      var win = 0;

function startGame() {

      b = a[Math.floor(Math.random() * a.length)];
      lb = b.split("");
      numBlanks = lb.length;
      console.log(b);
      bns = [];
      for (var i = 0; i < numBlanks; i++) {
      bns.push("_");
      }
      console.log(bns.join(" "));
      var join = bns.join(' ');
      $("#word-blanks").html(join);
}

function checkLetters(letter) {

  var letterInWord = false;
  for (var i = 0; i < numBlanks; i++) {
    if (b[i] === letter) {
      letterInWord = true;
    }
  }

  if (letterInWord) {
    for (var j = 0; j < numBlanks; j++) {
      if (b[j] === letter) {
        bns[j] = letter;
      }
    }
    var join = bns.join(' ');
    $("#word-blanks").html(join);

  } else{
    run()
  }
}

function gameOver(){
  if (lb.toString() === bns.toString()) {
    win++;
    alert("You win!");
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




