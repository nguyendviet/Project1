# Project1

## Overview
* George Washington University Group Project.
* Project name: Thought for food.

An app that helps users find a food dish and location by playing a word game.

### WHY WE BUILT THIS APP?

This app was created to solve a real problem:

Groups of people often have a hard time deciding where to go for dinner. We decided to solve this problem in a fun and interactive way. We built a *real-time multiplayer game* that asks players to solve the name of a food dish. When a player guesses the dish correctly, the **Google Places API** does a search for restaurants with that dish nearby, the winner selects the restaurant. The app will forward the address and the **What 3 Words API** displays the “3 Word Address” assigned to that location. The winner of the game chooses the restaurant they will go to from the list, and the other players receive the location that the winner chose.

### Demo
* Github IO: [Thought for Food](https://nguyendviet.github.io/Project1/)
<img src="https://github.com/nguyendviet/Project1/blob/master/github.png" width="800"/>

### Logic
* Everyone signs in with names.
* The game can only be started if there're 2 players or more.
* If a player quits after joining, the existing players will have to reset the game.
* Players can chat during game.
* Whoever gets the word first becomes the winner.
* The winner then chooses a restaurant from a list of nearby restaurants.
* When the destination has been chosen, it will be shown to all players.

## Technologies
* Google Firebase
* jQuery
* Google Places API, What 3 Words API

## Authors
* [James](https://github.com/jimboneely)
* [Mike](https://github.com/MikeYencha)
* [Rolando](https://github.com/rcintron1)
* [Viet](https://github.com/nguyendviet)