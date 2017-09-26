// Initialize Firebase
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
      // ================================================================================
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

function startGame() {

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
      // Fill up the blanksAndSuccesses list with appropriate number of blanks.
      for (var i = 0; i < numBlanks; i++) {
      blanksAndSuccesses.push("_");
      }
      console.log(blanksAndSuccesses.join(" "));
      // Prints the blanks at the beginning of each round in the HTML.
      //document.getElementById("word-blanks").innerHTML = blanksAndSuccesses.join(" ");
      var join = blanksAndSuccesses.join(' ');
      $("#word-blanks").html(join);
}

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
    var join = blanksAndSuccesses.join(' ');
    $("#word-blanks").html(join);

  }

}

// Starts the Game by running the startGame() function
startGame();

$(document).on("click", ".letter-button", function() {
		var letterPressed = $(this).attr("data-letter").toLowerCase();

            checkLetters(letterPressed);
            
        
		    console.log(letterPressed);        
			
  });
