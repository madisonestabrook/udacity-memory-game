### General Notes

Welcome to my stab at completing Udacity's Front-End Web Developer nanodegree Project #2: Memory Game. Udacity provided the barebones HTML and portions of the foundational CSS, but everything else has been customized according to my particular style (for good or ill). 

### Demo

A live demo is available <a href="jasonmwhite.com/memory-game/index.html">here</a>. 

### Download and Installation

Use GitHub's "Clone or Download" option to nab a copy of Memory Game — from there, you can clone the files to your own GitHub repo, download the files to your computer, or use a command shell tool, such as git bash, to clone from the URL available via the "Clone or Download" button directly to your computer. Make sure not to alter the folder structure! While not complex, the styling and JavaScript, as well as the background image, are all contained in their respective directory folders and referenced accordingly. Simply open up the `index.html` file and enjoy!

### Gameplay

The game is fairly simple and mirrors many online puzzle games: click or touch an item, which cues and plays an event, and work your way toward the finish line (in this game, crossing that line takes between 30 and 60 seconds, on average). Memory Game offers users 16 cards, with eight matching pairs. The objective is to match all eight pairs. 

### About the Code

The Knuth (Fisher-Yates) shuffling algorithm is used to shuffle the deck when the game is loaded. The user can play another game by clicking the Play Again button after a win, or they can restart the game at any time. A congratulatory animation plays at the end of the game, once all  pairs have been matched, and separate animations play during both correct and incorrect guesses. Additionally, sounds are provided — a ticking clock that begins once a user completes their first matching attempt, as well as when users correctly match a pair or guess incorrectly. To offset user annoyance, a convenient volume slider has been provided, which offers textual feedback as to volume level. Upon successfully completing the game, users are shown a breakdown of their score: A star rating, which is actively tracked during gameplay, the final time upon winning a game, and a special message reflective of their star rating (and my sense of humor).  

### Dependencies and Contributions

There are no library dependencies in this project. However, many resources were consulted during this project's development. The header was adapted (including updating syntax to ES6 and simplying code) via the Codepen.io link in the JavaScript file. Other sources of inspiration are cited/attributed, too. Udacity Front-End Web Developer Slack channels' awesome and helpful students deserve mention for their words of wisdom. External to Udacity, though, MDN was used extensively, as well as W3C.org, various blog posts and educational materials, and the council of wise Youtubers. As is typical of my approach to this program, I attempt to deliver a bit more than what's required, and while the end result isn't exactly awe-inspiring, the underlying work and subtle flourishes do, in fact, make me quite proud. 

## Direct Dependencies
Font-Awesome 4.6.1 for the Game Icons
Google Fonts for the Coda Font Family

### TODOs

I aim to continue working on it over time, including applying MVC application design prinicples to make the structure of the app less, well, unstructured. Additionally, there are a few issues that I'm still working on: simplifying code, generally, bringing everything up to ES6 while providing fallbacks, and — at some point — offering one or two extra versions of the game. For example, giving users 24 cards to match under a time limit. I'll also continue improving the logic and animations. 

### Thanks!

If you play the game, enjoy! If you have any suggestions whatsoever, hit me up!

### The Udacity rubric for Project #2: Memory Game follows 

# Memory Game Project Specifications

## Game Behavior

| CRITERIA | MEETS SPECIFICATIONS |
| -------- | -------------------- |
| Memory Game Logic | The game randomly shuffles the cards. A user wins once all cards have successfully been matched. |
| Congratulations Popup | When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It should also tell the user how much time it took to win the game, and what the star rating was. |
| Restart Button | A restart button allows the player to reset the game board, the timer, and the star rating. |
| Star Rating | <p>The game displays a star rating (from 1 to at least 3) that reflects the player's performance. At the beginning of a game, it should display at least 3 stars. After some number of moves, it should change to a lower star rating. After a few more moves, it should change to a even lower star rating (down to 1).</p><p>| The number of moves needed to change the rating is up to you, but it should happen at some point.</p> |
| Timer | When the player starts a game, a displayed timer should also start. Once the player wins the game, the timer stops. |
| Move Counter | Game displays the current number of moves a user has made. |

## Interface Design

| CRITERIA | MEETS SPECIFICATIONS |
| -------- | -------------------- |
| Styling | Application uses CSS to style components for the game. |
| Usability | All application components are usable across modern desktop, tablet, and phone browsers. |

## Documentation

| CRITERIA | MEETS SPECIFICATIONS |
| -------- | -------------------- |
| README | A README file is included detailing the game and all dependencies. |
| Comments | Comments are present and effectively explain longer code procedure when necessary. |
| Code Quality | Code is formatted with consistent, logical, and easy-to-read formatting as described in the [Udacity JavaScript Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html). |

---

| ## Suggestions to Make Your Project Stand Out! |
| --- |
| <ul><li>Add CSS animations when cards are clicked, unsuccessfully matched, and successfully matched.</li><li>Add unique functionality beyond the minimum requirements (Implement a leaderboard, store game state using local storage, etc.)</li><li>Implement additional optimizations that improve the performance and user experience of the game (keyboard shortcuts for gameplay, etc).</li></ul> |
