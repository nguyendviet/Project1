// Initialize Firebase
var config = {
  apiKey: "AIzaSyA_okOYKXJMdeQXDoEl2BvsOE-SztiWL-Y",
  authDomain: "thought-for-food-a9607.firebaseapp.com",
  databaseURL: "https://thought-for-food-a9607.firebaseio.com",
  projectId: "thought-for-food-a9607",
  storageBucket: "",
  messagingSenderId: "713609455221"
};
firebase.initializeApp(config);

/*=========================================================================================================
GLOBAL VARS
=========================================================================================================*/

//=============== firebase vars ===============
var database = firebase.database();
var playersRef = database.ref('players');
var startRef = database.ref('start');
var chatRef = database.ref('chat');
var winnerRef = database.ref('winner');

var resetRef = database.ref('reset');
var locationRef = database.ref('location');

//browser vars
var playersInGame;
var myInfo = {
  name: '',
  join: false,
  food: ''
};

//=============== main game vars ===============
var food = ["Ackee","Asado","Bandeja Paisa","Buffalo Wing","Banh Mi","Bulgogi", "Carne Asada","Chicken Parm","Chilli", "Corned Beef","Couscous", "Curry", "Dim Sum","Falafel", "Hamburger", "Lasagna", "Lobster", "Masala Dosa", "Paella", "Pasta", "Pho", "Pizza", "Ramen", "Sushi", "Tacos"];

//keyboard's vars
var row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
var row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
var row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
var row4 = [' '];

//main game vars
var foodChosen = "";
var foodChosenArray = [];
var numBlanks = 0;
var foodHidden = [];
var foodDisplayed = [];
var wrongGuesses = [];
var letterGuessed = "";

//timer vars
var countDown = 6;
var intervalId;
var audio = $('.sound')[0];
var wrong = $('.wrong')[0];
var jingle = $('.jingle')[0];

//=============== googlemaps api vars ===============
var map, infoWindow, pos;
var firstRun = false;

//===============w3w api vars ===============
var reslat;
var reslong;
var latlng;
var w3wMap;
var w3wWords;

/*=========================================================================================================
FUNCTIONS
=========================================================================================================*/
function playJingle() {
    jingle.play();
}
playJingle();

function stopJingle(){
  jingle.pause();
}

function showGameInfo() {
  $('.start').css('display', 'block');
  $('.chat').css('display', 'block');
}

function winner() {
  myInfo.food = foodChosen;
  winnerRef.push(myInfo);
  initMap();
  playJingle();
}

/*=========================================================================================================
FIREBASE EVENTS
=========================================================================================================*/

//when player ref has any value
playersRef.on('value', function(snap) {
  playersInGame = snap.numChildren();

  if (playersInGame !== 0) {
		if(playersInGame === 1) {
    $('.notify').html('There is <strong>' + playersInGame + '</strong> person ready to play.');
	} else {
		$('.notify').html('There are <strong>' + playersInGame + ' </strong> people playing the game.');
	}
    $('.create').hide(); //hide create button from others when the game is created

    if (myInfo.join !== true) {
      $('.join').css('display', 'block'); //only show join button to playrers not the host
    }

    if ((playersInGame === 1) && startRef) {
      startRef.remove(); //remove in game condition if players left and only 1 player left
      $('.mainGame').hide();
    }
  }
  else {
    chatRef.remove();
    startRef.remove();
    resetRef.remove();
    locationRef.remove();

    $('.create').hide();
    $('.join').hide();
		$('#foodList').hide();
		$('.main').hide();
    $('#map').hide();
    $('.notify').html(''); //clear notification for players not in game but don't reload browser
  }
});

playersRef.on('child_removed', function(snap) {
  winnerRef.remove(); //remove winner's info whenever a user left
  $('.start').hide();

  if (startRef) {
    resetRef.push(true);
  }
});

resetRef.on('child_added', function() {
  $('.notify').html('A player has quit during the game, please reset the game.');
  $('.join').hide();
  $('.chat').hide();
  $('#foodList').hide();

	if (myInfo.join === true) {
		$('.reset').show();
	}
});

//when start ref has value
startRef.on('child_added', function(snap) {
  $('.notify').html(snap.val() + ' has started the game!');
  gameOn = true;

  $('.create').hide();
  $('.join').hide();
  $('.start').hide();

  if (myInfo.join === true) {
    $('.mainGame').css('display', 'block'); //only show word and keyboard to joined players
    stopJingle();
  }
});

//print out messages when there is a message
chatRef.on('child_added', function(snap) {
  $('.messageBoard').append(snap.val());
  $('.messageBoard').scrollTop($('.messageBoard')[0].scrollHeight); //always show new message on board
});

//when winner ref has value
winnerRef.on('child_added', function(snap) {
  var name = snap.val().name;
  var food = snap.val().food;

  $('.notify').html('The winner is ' + name + ', and the chosen food is: ' + food);

  $('.mainGame').hide();
});

locationRef.on('child_added', function(snap) {
  var name = snap.val().name;
  var address = snap.val().address;
  var w3wLink = snap.val().w3wMap;
  var w3wWordsShown = snap.val().w3wWords;

  //final message: name of chosen restaurant and address
  $('.notify').html('The chosen restaurant is <b>' + name + '</b> and the address is <b>' + address + '</b><br/>The address in 3 words: ' + '<a href="' + w3wLink + '" target="_blank">' + w3wWordsShown + '</a>');
});

/*=========================================================================================================
BUTTON EVENTS
=========================================================================================================*/

//log in
$('.btn-submit').on('click', function(event) {
	event.preventDefault();
	var hi = $('<div class="hi text-center">');
	var name = $('.name').val().trim();
	if (name) {
		myInfo.name = name;


		$('.login').hide();
		$('.instructions').hide();
		$('.login-container').append(hi.html('<h3 class="mt-2">Hi <p class="inline">'+ name + "</p>.</h3>" + '<p class="text-center mb-2">Are you ready to start?</p>'));

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
});

//join game
$('.btnJoin').on('click', function(event) {
  event.preventDefault();

  //only allow players with name join
  if (myInfo.name === '') {
    return;
  } else {
    var myRef = playersRef.push(myInfo);
    myInfo.join = true;
  }

  myRef.onDisconnect().remove();

  $('.join').hide();

  if (playersInGame >= 2) {
    //show start button only to players joined
    showGameInfo();
  }
});

//start game
$('.btnStart').on('click', function() {

  if (playersInGame >= 2) {
    startRef.set(myInfo);
  } else {
    return;
  }
});

//create chat when a user sends a message
$('.btnSend').on('click', function(event) {
  event.preventDefault();

  var message = $('.newMessage').val().trim();

  if (message) {
    chatRef.push('<p class="clear"><strong>' + myInfo.name + '</strong>: ' + message + '</p>');
  } else {
    return;
  }

	//clear sent message from box
	$('.newMessage').val('');
});

$('.btnReset').on('click', function() {
  location.reload();
});

/*=========================================================================================================
MAIN GAME BEGINS
=========================================================================================================*/
// PRINT QWERTY KEYBOARD
//print row 1
for (var i = 0; i < row1.length; i++) {
	var lBtn = $("<button>");

	lBtn.addClass("letter-button letter letter-button-color");
	lBtn.attr("data-letter", row1[i]);
	lBtn.text(row1[i]);

	$(".row1").append(lBtn);
}

//print row 2
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

function startGame() {
	$('#myModal').modal('show')
	$('#myModal').on('hidden.bs.modal', function (e) {
		$('.main.container').show()
})
  foodChosen = food[Math.floor(Math.random() * food.length)];
  console.log(foodChosen); //food name cheat
  foodChosenArray = foodChosen.split("");
  numBlanks = foodChosenArray.length;
  foodhHidden = [];

  for (var i = 0; i < numBlanks; i++) {
    foodHidden.push("_");
  }

  foodDisplayed = foodHidden.join(' ');
  $(".word-blanks").html(foodDisplayed);
}

function checkLetters(letter) {

  var letterInWord = false;

  for (var i = 0; i < numBlanks; i++) {
    if (foodChosen[i].toLowerCase() === letter) {
      letterInWord = true;
    }
  }

  if (letterInWord) {
    for (var j = 0; j < numBlanks; j++) {
      if (foodChosen[j].toLowerCase() === letter) {
        foodHidden[j] = foodChosen[j];
      }
    }
    foodDisplayed = foodHidden.join(' ');
    $(".word-blanks").html(foodDisplayed);

    audio.play();
  } else {
    timer();
    wrong.play();
  }
}

function gameOver() {
  if (foodChosenArray.toString() === foodHidden.toString()) {
    winner();
  }
}

//TIMER's functions
function timer() {
  intervalId = setInterval(decrement, 1000);
  $('button').prop('disabled', true);
}

function decrement() {
  countDown--;
  $(".pause").html("<h2>" + countDown + "</h2>");
  if (countDown === 0) {
    stop();
  }
}

function stop() {
  clearInterval(intervalId);
  $(".pause").html("");
  $('button').prop('disabled', false);
  countDown = 6;
}

// main game operation
startGame();

$(".letter-button").on("click", function() {
  var letterPressed = $(this).attr("data-letter").toLowerCase();

  checkLetters(letterPressed);
  gameOver();

});
/*=========================================================================================================
MAIN GAME ENDS
=========================================================================================================*/

/*=========================================================================================================
GOOGLE API BEGINS
=========================================================================================================*/

// GOOGLE MAPS API
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.8721803,
      lng: -77.1892915
    },
    zoom: 12
  });
  if (firstRun) {
    $("#map").show();
		$("#map").addClass('mapStyles');
    $("#map").width("100%").height("300");
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        listRestaurants(pos);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
              lat: pos.lat,
              lng: pos.lng
            },
            zoom: 12
            // map.setCenter(pos);
          }),
          function() {
            handleLocationError(true, infoWindow, map.getCenter());
          };
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
  firstRun = true;
};

function addMapMarker(pos) {
  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Congrats'
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);

}

function listRestaurants(pos) {
  if (myInfo.join) {
    $('#foodList').css('display', 'block'); // only show food list for joined users
  }
	
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pos,
    radius: 8000,
    type: ['restaurant'],
    keyword: foodChosen,
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {

    var list = $("<ul class='mt-2 mb-2'>");

    for (var i = 0; i < results.length; i++) {
      list.append($("<li class=foodLink name='" + results[i].name
			+ "' address='" + results[i].vicinity + "'>")
			.html(results[i]
			.name + "<br>" + results[i].vicinity));
      reslat = results[i].geometry.location.lat();
      reslong = results[i].geometry.location.lng();
      latlng = String(reslat)+","+String (reslong);
      w3w();
    }

    $("#foodList").html(list);

    addMapMarker(pos);

    $("#foodList").on("click",".foodLink",function(){
			var name = $(this).attr("name");
			var address = $(this).attr("address");
      var chosenRestaurant = {name: name, address: address, w3wMap: w3wMap, w3wWords: w3wWords};

      locationRef.push(chosenRestaurant);
      $('#foodList').hide();
		});
  }
}

/*=========================================================================================================
GOOGLE API ENDS
=========================================================================================================*/

/*=========================================================================================================
w3w API
=========================================================================================================*/

function w3w() {
     var queryURL = "https://api.what3words.com/v2/reverse?coords=" + latlng + "&display=full&format=json&key=9I7B51YQ"
      $.ajax({
          url: queryURL,
          method: "GET"
        })
      .done(function(response){
        w3wWords = response.words;
        w3wMap = response.map;
    })
};

/*=========================================================================================================
w3w API ENDS
=========================================================================================================*/