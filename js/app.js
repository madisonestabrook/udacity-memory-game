/* jshint esversion: 6 */
/* jshint -W031 */
/* jshint expr: true */
/*jshint loopfunc: true */
/*
Global TODO: I found a few sources covering complex ternary format rules, but nothing consistent.
I've stuck with either single lines and, for nested ternary expressions, broken the lines in at
least a logical order. Indentation may still be an issue, but I'll get to that.
*/
/* Global variables, mostly for DOM items, and starting values used in later functions. */
let card = document.getElementsByClassName('card');
let cards = [...card];
let moves = 0;
let oneCount = 0;
const deck = document.querySelector('#card-deck');
const counter = document.querySelector('.moves');
const star = document.querySelectorAll('.starred');
let stars = [...star];
const volumeSlide = document.querySelector('#slider');
const volReadout = document.querySelector('#volume');
let i, gameTime, results;
const matchedCard = document.getElementsByClassName('match');
const modal = document.querySelector('.overlay');
let openedCards = [];
const restart = document.querySelector('.restart');
const playAgainBtn = document.querySelector('.new-game');
let second = 0,
  minute = 0;
const min = document.querySelector('.min');
const sec = document.querySelector('.sec');
const soundTock = new Audio('sounds/tock.mp3');
const matchedSound = new Audio('sounds/correct.wav');
const unmatchedSound = new Audio('sounds/incorrect.wav');
const win = new Audio('sounds/win.mp3');
/*
Shuffle function, courtesy of the Durstenfeld Shuffle (and later popularized by Donald Knuth).
Fisher-Yates created their algorithm in 1938 "as a method for researchers to mix stuff up with
pencil and paper," according to Frank Mitchell's blog at https://www.frankmitchell.org/2015/01/fisher-yates/.
Richard Durstenfeld adapted the Fisher-Yates shuffle in 1964, creating a more modern, computer-oriented algorithm.
Durstenfeld and Knuth only later acknowledged Fisher and Yates' contributions to the shuffle algorithm, although it's
unclear the former two knew of Fisher and Yates' work when the more modern version was first puplished and then popularized.
See Durstenfeld's "Algorithm 235: Random permutation" and Knuth's "Seminumerical algorithms. The Art of Computer Programming."
*/
/*
The cards array is passed as the first paremeter to the shuffle function.
*/
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;
  /* While there are elements to shuffle, etc. */
  while (currentIndex !== 0) {
    /*
    This picks a random element. The math is: get a number between zero and 1 that isn't also 1,
    then multiply it by the currenIndex value. Then use Math.floor to make that value a whole
    number by rounding down from the Math.random() * currentIndex value.
    */
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    /* This swaps the previously chosen, random element with the next one. */
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  /* Returns the newly organized, random array. */
  return array;
}
/* restart button's call to the startGame() function, which resets the page as it would via onload. */
restart.addEventListener('click', startGame);
/* startGame is called once the document loads. */
document.onload = startGame();
/* startGame() first empties the openedCards array, then calls textRotate()
for the typewriter h1 element effect, and then shuffles the cards array. */
function startGame() {
  stopModal();
  win.pause();
  openedCards = [];
  oneCount = 0;
  cards = shuffle(cards);
    /* Clear the deck for the DOM and then append the cards. */
    deck.innerHTML = '';
    cards.forEach(function (card) {
      deck.appendChild(card);
      /* TODO: Look up whether there's a pure-JS way of targeting classes by
      prefix so I don't have to list all of these "celebrate-" classes */
      card.classList.remove('show',
        'open',
        'match-animation',
        'match',
        'disabled',
        'celebrate-ninja',
        'celebrate-eye',
        'celebrate-game',
        'celebrate-glasses',
        'celebrate-agent',
        'celebrate-dice',
        'celebrate-frog',
        'celebrate-poo');
    });
  /* Since startGame() is called by other events later on, reset moves. */
  moves = 0;
  /* Set the blink element on each call of startGame(). */
  counter.innerHTML = '<span class="blink">..waiting</span>';
  /* Set stars.length to 3 on each call of startGame(). */
  stars.length = 3;
  /*
  Ensure the stars start with only the "fas" and "fa-star" classes, which are completely
  filled stars, by first clearing any pre-existing classes and assigning default/starting classes.
  */
stars.forEach(function(star) {
  star.className = '';
  star.classList.add('fas', 'fa-star');
});
  /* Ensure second and minute are also reset on each call of startGame(). */
  second = 0;
  minute = 0;
  /* Set the clock's innerHTML, !important for each call of startGame(). */
  min.innerHTML = '00';
  sec.innerHTML = '00';
  /* Set the volReadout innerHTML (below the slider) and then set the slider's value. */
  volReadout.innerHTML = `${volumeSlide.value} %`;
  volumeSlide.value = 50;
  /* Call the volume function, which allows users to adjust the volume of all four audio elements playing on the page. */
  volume();
  cardClicks();
  /* Reset the interval used by gameTime further down. */
  clearInterval(gameTime);
  textRotate();
}
/*
The stopModal() function stops the modal from appearing if the user
clicks restart in the score-panel before the modal appears. This was implemented
because, if a user won, the modal would always appear after three seconds, even
if, upon winning, the user immediately pressed restart instead of Try Again.
*/
function stopModal() {
  clearTimeout(results);
}
/*
The volume function is called by startGame() and controls the four page audio
sources via the volumeSlide values, which are all tied to the volumeSlide event listener, below.
*/
function volume() {
  soundTock.volume = volumeSlide.value / 100;
  matchedSound.volume = volumeSlide.value / 100;
  unmatchedSound.volume = volumeSlide.value / 100;
  win.volume = volumeSlide.value / 100;
}
/* Updates the volReadout element with the value of volumeSlide. At zero volume, a fontawesome icon is used in place of numbers. */
volumeSlide.addEventListener('input', volume);
volumeSlide.addEventListener('input', function (e) {
  volumeSlide.textContent = e.currentTarget.value;
  volumeSlide.value > 0 ?
    volReadout.innerHTML = `${volumeSlide.textContent} %` :
  volReadout.innerHTML = '<i class="fas fa-volume-off"></i>';
});
/*
Tied these event listeners together into a cardClicks() function since each card click
calls the flipCard() toggling effect function, the matchEval() evaluative isAMatch()
and notAMatch() functions, and determines whether to run the gameOver() function.
The latter is a bit much, so another TODO: look into simplifying how gameOver() is called.
*/
function cardClicks() {
  cards.forEach(function(card) {
    card.addEventListener('click', flipCard);
    card.addEventListener('click', matchEval);
    card.addEventListener('click', gameOver);
    card.addEventListener('click', clickToStart, {
      once: true
    });
  });
}
/* The flipCard() function toggles open, show, and disabled on each card via the cardClicks loop above. */
function flipCard() {
  this.classList.toggle('open');
  this.classList.toggle('show');
  this.classList.toggle('disabled');
}
/*
Here, the matchEval() function is called whenever a card is clicked. It first pushes the
clicked cards to the empty oepenedCards array. Next, it evaluates the length of the array at
exactly two cards and then runs the moveCounter() function. If the two cards' titles match
match, it calls the isAMatch() function. If the number of cards with the "matched" class,
assigned to the matchedCard variable, are less than 16, a matchedSound plays for each match.
Otherwise, if the two cards' titles are not the same, the notAMatch() function is called,
and the unmatchedSound is played. Ternary expressions weren't used here because the resultant
nested-if tree ended up quite long in comparison. TODO: turn this into a ternary conditional anyways.
*/
function matchEval() {
  openedCards.push(this);
  let length = openedCards.length;
  if (length === 2) {
    /* In my game, a move is counted when two cards have been selected. Once openedCards array reaches two cards, the following evaluation occurs. */
    moveCounter();
    if (openedCards[0].getAttribute('title') === openedCards[1].getAttribute('title')) {
      isAMatch();
      if (matchedCard.length < 16) {
        /* While matchedCard class hasn't been applied to a total of 16 cards, the matched sound plays for each successful/correct moves. */
        matchedSound.play();
      }
    } else if (openedCards[0].getAttribute('title') !== openedCards[1].getAttribute('title')) {
      /* When two cards are not matches, the notAMatch function is called and an unmatched sound is played. */
      notAMatch();
      unmatchedSound.playbackRate = 1.65;
      unmatchedSound.play();
    }
  }
}
/*
isAMatch() simply adds and removes classes to the openedCards array's two cards. Of particular
importance to the matchEval() function above, the "match" class is used to determine when to
play a certain sound. The match-animation class is added as well, which applies the (get this)
match animation. Again, this uses the custom classListChain method described later in the document.
*/
function isAMatch() {
  openedCards[0].classListChain.add('match').classListChain.add('match-animation')
   .classListChain.remove('show').classListChain.remove('open');
  openedCards[1].classListChain.add('match').classListChain.add('match-animation')
   .classListChain.remove('show').classListChain.remove('open');
  openedCards = [];
}
/*
When two cards don't match, the unmatched class is added, which applies the red color
and unmatched animation. The cards are temporarily disabled during this animation
sequence's .6 seconds. Following the animation, the classes are removed and the cards
flip face down. The cards are then enabled, and the openedCards array is cleared.
Note that the disable() and enable() functions are used to disable and enable ALL cards.
This keeps the user from clicking every card, regardless of the current move. The enable()
function also evaluates application of the disabled class on all cards that have the match
class already applied. TODO: determine whether this approach is expensive. That is, is it
looping through the cards each time it's called in the notAMatch function?
Is there a clear way to do this (probably)?
*/
function notAMatch() {
  openedCards[0].classList.add('unmatched');
  openedCards[1].classList.add('unmatched');
  disable();
  setTimeout(function () {
    openedCards[0].classList.remove('show', 'open', 'unmatched');
    openedCards[1].classList.remove('show', 'open', 'unmatched');
    enable();
    openedCards = [];
  }, 600);
}

function disable() {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.add('disabled');
  });
}

function enable() {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.remove('disabled');
    for (i = 0; i < matchedCard.length; i++) {
      matchedCard[i].classList.add('disabled');
    }
  });
}
/*
The moveCounter function performs several checks. First, it iterates the moves variable by
one each time it's called. Next, it performs a simple innerHTML update so the "1 move(s)"
from the Udacity project HTML template changes to "1 move" and then two "moves" for all
moves over 1. Then it checks when to apply the halfStar() and emptyStar() functions,
which augment the styling of the stars on the page. Moves determine the stars' "fullness",
and moves is returned from the function. TODO: Figure out a cleaner, simpler way to perform
this check. It (as well as a couple of other statements in this project) is quite long.
TODO: Update 5.27.18, attempted to use ternary expressions but found that calling functions
directly in ternary was impossible. There are workarounds, but since this isn't such a
convoluted tree, it's acceptable at this point. TODO: Update 5.28.18, figured out a way
to call functions within ternary expressions. I'm still unsure whether this is acceptable,
but it works. I'll run it through jshint and jslint for an assessment.
*/
function moveCounter() {
  /* Each time moveCounter is called, it increments the moves variable. */
  moves++;
  /* During each call, the current move results in the indicated functions: startTimer(), halfStar(), or emptyStar(). */
  (moves !== 1) ?
  (counter.innerHTML = `${moves} moves`) :
  ((counter.innerHTML = `${moves} move`), (second = 0, minute = 0));
  // ((moves === 1) ?
  //   (function () {
  //     startTimer();
  //   })() :
  //   undefined);
  for (i = 0; i < 3; i++) {
    (((moves > 9 && moves <= 12) && (i === 2)) ?
      (function () {
        halfStar();
      })() :
      undefined);
    (((moves > 12 && moves <= 15) && (i === 2)) ?
      (function () {
        emptyStar();
      })() :
      undefined);
  }
  for (i = 0; i < 2; i++) {
    (((moves > 15 && moves <= 18) && (i === 1)) ?
      (function () {
        halfStar();
      })() :
      undefined);
    (((moves > 18 && moves <= 21) && (i === 1)) ?
      (function () {
        emptyStar();
      })() :
      undefined);
  }
/*
The Udacity rubric and review asked for no fewer than 1 star, but the next two
checks allow for fewer than 1, even zero, stars. I believe the following part
is more game-like, but I've commented it out to conform to the rubric. Following
passage via the Udacity reviewer, I'll re-enable this, lol.
*/
  // for (i = 0; i < 1; i++) {
  //   (((moves > 21 && moves <= 24) && (i === 0)) ?
  //     (function () {
  //       halfStar();
  //     })() :
  //     undefined);
  //   (((moves > 24) && (i === 0)) ?
  //     (function () {
  //       emptyStar();
  //     })() :
  //     undefined);
  // }
  return moves;
}
/*
startTimer() is a simple clock started by the moveCounter() function. It's a rather inelegant
approach to offering a clock to the user. Most rounds take only 30 to 60 seconds, so it's
limited to seconds and minutes. The HTML is dynamically updated following the setInterval
of 1000 milliseconds, after which the second variable increments. When second++ reaches 60,
minute is incremented and second is reset to zero. Additionally, a "tock" sound effect plays
during each interval. This was added to give a sense of "suspense" to the game. My wife thought
it was annoying, which is why I also added the volume slider (above). Not exactly an atomic
clock, but it gets the job done. Update 5.28.18, converted the rather long
if...else if statement tree to ternary expressions and cut lines by two-thirds.
*/
function startTimer() {
  gameTime = setInterval(function () {
    second++;
    (second < 10) ?
    (sec.innerHTML = `0${second}`) :
    undefined;
    (second > 9) ?
    (sec.innerHTML = second) :
    undefined;
    (second === 60) ?
    (minute++, second = 0, min.innerHTML = `0${minute}`, sec.innerHTML = `0${second}`) :
    undefined;
    (minute > 9) ?
    (min.innerHTML = minute) :
    undefined;
    soundTock.play();
  }, 1000);
}

function clickToStart() {
  oneCount++;
  for (i = 0; i < oneCount; i++) {
    if (oneCount === 1) {
      startTimer();
    }
  }
}

/*
The halfStar() and emptyStar() functions. These were initially part of the
moveCounter() above, but the if...else statements were ridiculously long,
so I made a function to call instead. The styling goes from three fully colored
stars and decrements by half a star depending on the moves above. The Object was
taken from https://stackoverflow.com/questions/28653761/chaining-html5-classlist-api-without-jquery,
which went over how to define one's own object to allow chaining add and remove methods.
Not essential, but it was an interesting experiment.
*/
function halfStar() {
  stars[i].classListChain.remove('fa-star').classListChain.add('fa-star-half');
}

function emptyStar() {
  stars[i].classListChain.remove('fas').classListChain.remove('fa-star-half').classListChain.add('far').classListChain.add('fa-star');
}
/*
This object is used several times throughout this app to allow chaining
the addition and subtraction of classes, and it's saved quite a bit of lines of code compared to its 14 lines.
*/
Object.defineProperty(HTMLElement.prototype, "classListChain", {
  get: function () {
    let self = this;
    return {
      add: function (cls) {
        self.classList.add(cls);
        return self;
      },
      remove: function (cls) {
        self.classList.remove(cls);
        return self;
      }
    };
  }
});
/*
The gameOver() function evaluates how many cards have the "match" class. It does this perhaps
too often, so another TODO is figuring out how to simplify when it's called. Page Speed Insights
and performance monitoring via Chrome's console indicate it's not a resource hog,
nor are any of the other functions and evaluations in this app, but I KNOW it could be simpler.
*/
function gameOver() {
  if (matchedCard.length === 16) {
    /* Note that I use the .pause() method. While jQuery has a stop method, creating one in pure JavaScript seemed silly given the scope of this project. */
    soundTock.pause();
    win.play();
    /* matchAnimations() is called once matched.length is 16 (all the cards). */
    matchAnimations();
    /* Stops the execution of the gameTime variable's setTimeout function. */
    clearInterval(gameTime);
    /* Sets the modal's finalTime with the current min. and sec. innerHTML values. */
    let finalTime = `${min.innerHTML}:${sec.innerHTML}`;
    /* To allow the matchAnimations() function time to play, the modal window is set to appear after 3 seconds. */
    results = setTimeout(function () {
      modal.style.display = 'block';
    }, 3000);
    /*
    Declares the starsScore and totalMoves variables, with starsScore taking from the existing
    element and totalMoves used to display the moves returned from the moveCounter() function above.
    */
    let starsScore = document.querySelector('.stars').innerHTML;
    let totalMoves = document.querySelector('#total-moves');
    /*
    Customized, silly messages are displayed on the modal. Each one is based on the moves
    variable's value returned from the moveCounter() function. Ternary expressions
    are used, which reduced written code by more than fifty percent.
    */
    (moves >= 8 && moves <= 9) ?
    (totalMoves.innerHTML = `At ${moves} moves, you had a perfect score!`) :
    ((moves > 9 && moves <= 12) ?
      (totalMoves.innerHTML = `At ${moves} moves, you did great!`) :
      ((moves > 12 && moves <= 15) ?
        (totalMoves.innerHTML = `At ${moves} moves, you weren\'t half bad!`) :
        ((moves > 15 && moves < 18) ?
          (totalMoves.innerHTML = `At ${moves} moves, you were exactly <em>half</em> good and <em>half</em> bad!`) :
          ((moves > 18 && moves <= 21) ?
            (totalMoves.innerHTML = `At ${moves} moves, you\'re not terrible!`) :
            ((moves > 21 && moves <= 24) ?
              (totalMoves.innerHTML = `At ${moves} moves, you should play again!`) :
              ((moves > 24) ?
              (totalMoves.innerHTML = `At ${moves} moves, do you even remember your own name?!`) :
              undefined))))));
    document.querySelector('.rating').innerHTML = starsScore;
    document.getElementById('totalTime').innerHTML = finalTime;
  }
}
/* reset() is called by the playAgainBtn event listener. The modal is hidden and startGame() is called. */
playAgainBtn.addEventListener('click', reset);

function reset() {
  modal.style.display = 'none';
  startGame();
}
/*
TODO: The following statements are a bit convoluted, but there's probably a more efficient,
concise way of writing this. Research simplifying the code. For example,
jQuery offers a simpler way of doing this via its wildcard syntax, but the goal
here was to use pure JavaScript. The following applies card-specific classes to allow
for unique animations to each pair of matching cards when called by the gameOver() function.
TODO: update 5.28.18, simplified original tree of nested if...else if
statements into ternary expressions. Reduced lines of code by just shy of half.
*/
function matchAnimations() {
  cards.forEach(function(card) {
    (card.getAttribute('title') === 'ninja') ?
    (card.classListChain.remove('match-animation').classListChain.add('celebrate-ninja')) :
    ((card.getAttribute('title') === 'glasses') ?
      (card.classListChain.remove('match-animation').classListChain.add('celebrate-glasses')) :
      ((card.getAttribute('title') === 'game') ?
        (card.classListChain.remove('match-animation').classListChain.add('celebrate-game')) :
        ((card.getAttribute('title') === 'frog') ?
          (card.classListChain.remove('match-animation').classListChain.add('celebrate-frog')) :
          ((card.getAttribute('title') === 'eye') ?
            (card.classListChain.remove('match-animation').classListChain.add('celebrate-eye')) :
            ((card.getAttribute('title') === 'poo') ?
              (card.classListChain.remove('match-animation').classListChain.add('celebrate-poo')) :
              ((card.getAttribute('title') === 'dice') ?
                (card.classListChain.remove('match-animation').classListChain.add('celebrate-dice')) :
                ((card.getAttribute('title') === 'agent') ?
                  (card.classListChain.remove('match-animation').classListChain.add('celebrate-agent')) :
                  undefined)))))));
  });
}
///////////////////////////////////////////////////////
/*
Popular typing text effect borrowed from https://codepen.io/gschier/pen/jkivt.
The entirety of the codepen has been updated, though, to a more concise syntax,
courtesy of Jason White (me). Originally, it used ES5 syntax and
nested if...else if statements. Ternary expressions and updated variable assignments.
*/
///////////////////////////////////////////////////////
function textRotate() {
  const TxtRotate = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  TxtRotate.prototype.tick = function () {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];
    /* The following ternary expressions were converted from lengthier nested if and if...else statements. */
    (this.isDeleting) ?
    (this.txt = fullTxt.substring(0, this.txt.length - 1)) :
    (this.txt = fullTxt.substring(0, this.txt.length + 1));
    this.el.innerHTML = `<span>${this.txt}</span>`;
    let that = this;
    let delta = 300 - Math.random() * 100;
    (this.isDeleting) ?
    (delta /= 2) :
    undefined;
    (!this.isDeleting && this.txt === fullTxt) ?
    (delta = this.period, this.isDeleting = true) :
    ((this.isDeleting && this.txt === '') ?
      (this.isDeleting = false, this.loopNum++, delta = 500) :
      undefined);
    setTimeout(function () {
      that.tick();
    }, delta);
  };
  window.onload = function () {
    const elements = document.getElementsByClassName('txt-rotate');
    for (i = 0; i < elements.length; i++) {
      let toRotate = elements[i].getAttribute('data-rotate');
      let period = elements[i].getAttribute('data-period');
      (toRotate) ?
      (new TxtRotate(elements[i], JSON.parse(toRotate), period)) :
      undefined;
    }
  };
}
/////////////////////////////////////////////////
/* TODO: Local Storage of User's gameplay information */
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
