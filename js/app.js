/* jshint esversion: 6 */
/* Global variables, mostly for DOM items, and starting values used in later functions. */
  let card = document.getElementsByClassName("card");
  let cards = [...card];
  let moves = 0;
  const deck = document.querySelector("#card-deck");
  const counter = document.querySelector(".moves");
  const star = document.querySelectorAll(".starred");
  let stars = [...star];
  const volumeSlide = document.querySelector("#slider");
  const volReadout = document.querySelector("#volume");
  let i, gameTime, celebration;
  const matchedCard = document.getElementsByClassName("match");
  const modal = document.querySelector(".overlay");
  let openedCards = [];
  const restart = document.querySelector(".restart");
  const playAgainBtn = document.querySelector(".new-game");
  let second = 0, minute = 0;
  const min = document.querySelector(".min");
  const sec = document.querySelector(".sec");
  const soundTock = new Audio("sounds/tock.mp3");
  const matchedSound = new Audio("sounds/correct.wav");
  const unmatchedSound = new Audio("sounds/incorrect.wav");
  const win = new Audio("sounds/win.mp3");
/*
Shuffle function, courtesy of the Durstenfeld Shuffle (and later popularized by Donald Knuth). The differences: Fisher-Yates created
their algorithm in 1938 "as a method for researchers to mix stuff up with pencil and paper," according to Frank Mitchell's
blog at https://www.frankmitchell.org/2015/01/fisher-yates/. Richard Durstenfeld adapted from the Fisher-Yates shuffle in 1964,
creating a more modern, computer-oriented algorithm. Durstenfeld and Knuth only later acknowledged Fisher-Yates contributions to the shuffle
algorithm, although it's unclear the former two knew of their work when the more modern version was first puplished and then popularized. See
Durstenfeld's "Algorithm 235: Random permutation," and Knuth's "Seminumerical algorithms. The Art of Computer Programming."
*/
/*
The cards array is passed as the first paremeter to the shuffle function.
*/
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    /* While there are elements to shuffle, etc. */
    while (currentIndex != 0) {
      /*
      This picks a random element. The math is: get a number between zero and 1 that isn't also 1, then multiply it by the currenIndex value.
      Then use Math.floor to make that value a whole number by rounding down for the Math.random() * currentIndex value.
      */
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      /* This swaps the previously chosen, random element and swaps it with the next one. */
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    /* Returns the newly organized, random array. */
    return array;
  }

/* restart button's call to the startGame() function, which essentially resets the page as it would via onload. */

  restart.addEventListener("click", startGame);

/* startGame is called once the document loads. */
  document.onload = startGame();
/* startGame() first empties the openedCards array, then calls textRotate() for the typewriter h1 element effect, and then shuffles the cards array. */
  function startGame() {
    openedCards = [];
    cards = shuffle(cards);
    for (i = 0; i < cards.length; i++) {
      /* Clear the deck for the DOM and then append the cards. */
      deck.innerHTML = "";
      // To-Do: read up on forEach and determine if this empty-array approach, which calls the cards array and calls the function to append each card to the deck
      [].forEach.call(cards, function(card) {
        deck.appendChild(card);
      });
      // To-Do: Look up whether there's a pure-JS way of targeting classes by prefix so I don't have to list all of these "celebrate-" classes
    cards[i].classList.remove("show",
                              "open",
                              "match-animation",
                              "match",
                              "disabled",
                              "celebrate-ninja",
                              "celebrate-eye",
                              "celebrate-game",
                              "celebrate-glasses",
                              "celebrate-agent",
                              "celebrate-dice",
                              "celebrate-frog",
                              "celebrate-poo");
    }
    /* Since startGame() is called by other events later on, reset moves. */
    moves = 0;
    /* Set the blink element on each call of startGame(). */
    counter.innerHTML = "<span class='blink'>..waiting</span>";
    /* Set stars.length to 3 on each call of startGame(). */
    stars.length = 3;
    /*
    Ensure the stars start with only the "fas" and "fa-star" classes, which are completely filled
    stars, by first clearing any pre-existing classes and assignment default/starting classes.
    */
    for (i = 0; i < stars.length; i++) {
      stars[i].className = "";
      stars[i].classList.add("fas", "fa-star");
    }
    /* Ensure second and minute are also reset on each call of startGame(). */
    second = 0;
    minute = 0;
    /* Set the clock's innerHTML, !important for each call of startGame(). */
    min.innerHTML = "00";
    sec.innerHTML = "00";
    /* Set the volReadout innerHTML (below the slider) and then set the slider's value. */
    volReadout.innerHTML = 50 + "%";
    volumeSlide.value = 50;
    /* Call the volume function, which allows users to adjust the volume of all four audio elements playing on the page. */
    volume();
    cardClicks();
    /* Reset the interval used by gameTime further down. */
    clearInterval(gameTime);
    textRotate();
  }

/* The volume function is called by startGame() and controls the four page audio sources via the volumeSlide values. */

  function volume() {
    soundTock.volume = volumeSlide.value / 100;
    matchedSound.volume = volumeSlide.value / 100;
    unmatchedSound.volume = volumeSlide.value / 100;
    win.volume = volumeSlide.value / 100;
  }

/*
Tied these event listeners together since each card click calls the displayCard toggling effect, the cardOpen() evaluative match() and unmatched() functions, 
as well as evaluates whether to run the gameOver() function. The latter is a bit much, so another To-Do is looking into simplifying how gameOver() is called.
*/

  function cardClicks() {
    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      card.addEventListener("click", displayCard);
      card.addEventListener("click", cardOpen);
      card.addEventListener("click", gameOver);
    }
  }

  function displayCard() {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
  };

  function cardOpen() {
    openedCards.push(this);
      var length = openedCards.length;
      if (length === 2) {
        moveCounter();
          if (openedCards[0].getAttribute("title") === openedCards[1].getAttribute("title")) {
            matched();
              if (matchedCard.length < 16) {
                matchedSound.play();
              }
          } else if (openedCards[0].getAttribute("title") != openedCards[1].getAttribute("title")) {
              unmatched();
              unmatchedSound.playbackRate = 1.65;
              unmatchedSound.play();
            }
      }
  }

  function matched() {
    openedCards[0].classList.add("match",
                                 "match-animation",
                                 "disabled");
    openedCards[1].classList.add("match",
                                 "match-animation",
                                 "disabled");
    openedCards[0].classList.remove("show",
                                    "open",
                                    "no-event");
    openedCards[1].classList.remove("show",
                                    "open",
                                    "no-event");
    openedCards = [];

  }

  function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function() {
      openedCards[0].classList.remove("show",
                                      "open",
                                      "no-event",
                                      "unmatched");
      openedCards[1].classList.remove("show",
                                      "open",
                                      "no-event",
                                      "unmatched");
      enable();
      openedCards = [];
    }, 600);
  }

  function disable() {
    Array.prototype.filter.call(cards, function(card) {
      card.classList.add('disabled');
    });
  }

  function enable() {
    Array.prototype.filter.call(cards, function(card) {
      card.classList.remove('disabled');
      for (i = 0; i < matchedCard.length; i++) {
        matchedCard[i].classList.add("disabled");
      }
    });
  }

  function moveCounter() {
    moves++;
    if (moves != 1) {
    counter.innerHTML = moves + " moves";
  } else {
    counter.innerHTML = moves + " move";
    }
    if (moves === 1) {
      second = 0;
      minute = 0;
      startTimer();
    } else if (moves > 9 && moves <= 12) {
      for (i = 0; i < 3; i++) {
        if (i === 2) {
          halfStar();
        }
      }
    } else if (moves > 12 && moves <= 15) {
      for (i = 0; i < 3; i++) {
        if (i === 2) {
          emptyStar();
        }
      }
    } else if (moves > 15 && moves <= 18) {
      for (i = 0; i < 2; i++) {
        if (i === 1) {
          halfStar();
        }
      }
    } else if (moves > 18 && moves <= 21) {
      for (i = 0; i < 2; i++) {
        if (i === 1) {
          emptyStar();
        }
      }
    } else if (moves > 21 && moves <= 24) {
      for (i = 0; i < 1; i++) {
        if (i === 0) {
          halfStar();
        }
      }
    } else if (moves > 24) {
      for (i = 0; i < 1; i++) {
        if (i === 0) {
          emptyStar();
        }
      }
    }
    return moves;
  }

  function startTimer() {
    gameTime = setInterval(function() {
    second++;
      if (second < 10) {
        sec.innerHTML = "0" + second;
      }
      if (second >= 10) {
        sec.innerHTML = second;
      }
      if (second === 60) {
        minute++;
        second = 0;
        min.innerHTML = "0" + minute;
        sec.innerHTML = "0" + second;
      }
      if (minute >= 10) {
        min.innerHTML = minute;
      }
      soundTock.play();
    }, 1000);
  }

  function halfStar() {
    stars[i].classList.remove("fa-star");
    stars[i].classList.add("fa-star-half");
  }

  function emptyStar() {
    stars[i].classList.remove("fas", "fa-star-half");
    stars[i].classList.add("far", "fa-star");
  }

  function gameOver() {
    if (matchedCard.length === 16) {
      soundTock.pause();
      win.play();
      matchAnimations();
      clearInterval(gameTime);
      let finalTime = min.innerHTML + ":" + sec.innerHTML;
      celebration = setTimeout(function() {
        modal.style.display = "block";
      }, 3000);
      let starRating = document.querySelector(".stars").innerHTML;
      let totalMoves = document.querySelector("#total-moves");
      // console.log(moves);
      if (moves >= 8 && moves <= 9) {
        totalMoves.innerHTML = "At " + moves + " moves, you had a perfect score!";
      } else if (moves > 9 && moves <= 12) {
        totalMoves.innerHTML = "At " + moves + " moves, you did great!";
      } else if (moves > 12 && moves <= 15) {
        totalMoves.innerHTML = "At " + moves + " moves, you weren't half bad!";
      } else if (moves > 15 && moves <= 18) {
        totalMoves.innerHTML = "At " + moves + " moves, you were exactly <em>half</em> good and <em>half</em> bad!";
      } else if (moves > 18 && moves <= 21) {
        totalMoves.innerHTML = "At " + moves + " moves, you're not terrible!";
      } else if (moves > 21 && moves <= 24) {
        totalMoves.innerHTML = "At " + moves + " moves, you should play again!";
      } else if (moves > 24) {
        totalMoves.innerHTML = "At " + moves + " moves, do you remember what you were playing?!";
      }
      document.querySelector(".rating").innerHTML = starRating;
      document.getElementById("totalTime").innerHTML = finalTime;
    }
  }

  /*
  To-Do: The following statements are a bit convoluted, but there's probably a more efficient, concise way of writing this. Research simplifying the code.
  For example, jQuery offers a simpler way of doing this via its wildcard syntax, but the goal here was to use pure JavaScript.
  */

  function matchAnimations() {
    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      if (cards[i].getAttribute("title") === "ninja") {
        // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-ninja");
      } else if (cards[i].getAttribute("title") === "glasses") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-glasses");
      } else if (cards[i].getAttribute("title") === "game") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-game");
      } else if (cards[i].getAttribute("title") === "frog") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-frog");
      } else if (cards[i].getAttribute("title") === "eye") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-eye");
      } else if (cards[i].getAttribute("title") === "poo") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-poo");
      } else if (cards[i].getAttribute("title") === "dice") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-dice");
      } else if (cards[i].getAttribute("title") === "agent") {
          // console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-agent");
        }
    }
  }

  playAgainBtn.addEventListener("click", reset);

  function reset() {
    modal.style.display = "none";
    win.stop();
    startGame();
  }

/*
jshint throws up an error when using the HTMLAudioElement prototype to create my own stop function. Not sure why. I imagine this is more
troubling for larger web applications, but the simpler size of this one shouldn't present any issues; in testing, it hasn't (so far).
*/

  HTMLAudioElement.prototype.stop = function() {
    this.pause();
    this.currentTime = 0.0;
  };


/* Event listeners. */

  volumeSlide.addEventListener("input", volume);
  volumeSlide.addEventListener("input", function(e) {
    volumeSlide.textContent = e.currentTarget.value;
    if (volumeSlide.value > 0) {
      volReadout.innerHTML = volumeSlide.textContent + "%";
    } else {
      volReadout.innerHTML = "<i class='fas fa-volume-off'></i>";
      }
  });

///////////////////////////////////////////////////////
/* Popular typing text effect borrowed from https://codepen.io/gschier/pen/jkivt */
///////////////////////////////////////////////////////

function textRotate() {
  var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };

  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span>'+this.txt+'</span>';

    var that = this;
    var delta = 300 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function() {
      that.tick();
    }, delta);
  };

  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
  };
}

/////////////////////////////////////////////////
/* Local Storage of User's gameplay information */
/////////////////////////////////////////////////

// const userStorage = window.localStorage;
//
// /* Test whether local storage is available on current user, from MDN at https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API */
//
// function storageAvailable(type) {
//   try {
//     let storage = window[type],
//     x = '__storage_test__';
//     storage.setItem(x, x);
//     storage.removeItem(x);
//     return true;
//   }
//   catch(e) {
//     return e instanceOf DOMException && (
//       // everything except for Firefox
//       e.code === 22 ||
//       // Firefox
//       e.code === 1014 ||
//       // test name field, too, because code might not be present
//     )
//   }
// }
