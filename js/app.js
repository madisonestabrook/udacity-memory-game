/*jshint esversion: 6 */

  let card = document.getElementsByClassName("card");
  let cards = [...card];
  let moves = 0;
  const deck = document.querySelector("#card-deck");
  let counter = document.querySelector(".moves");
  let star = document.querySelectorAll(".starred");
  let stars = [...star];
  const volumeSlide = document.querySelector("#slider");
  const volReadout = document.querySelector("#volume");
  let i, gameTime, celebration;
  let matchedCard = document.getElementsByClassName("match");
  let modal = document.querySelector(".overlay");
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

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  document.onload = startGame();

  function startGame() {
    openedCards = [];
    textRotate();
    // if (win.duration > 0) {
    //   win.stop();
    // }
    cards = shuffle(cards);
    for (i = 0; i < cards.length; i++) {
      deck.innerHTML = "";

      // read up on forEach, and look into replacing the above for (i = 0; i < cards.length...) code to call a function that does the following: //
      [].forEach.call(cards, function(item) {
        deck.appendChild(item);
      });
    cards[i].classList.remove("show", "open", "match-animation", "match", "disabled", "celebrate-ninja", "celebrate-eye", "celebrate-game", "celebrate-glasses", "celebrate-agent", "celebrate-dice", "celebrate-frog", "celebrate-poo");
    }
    moves = 0;
    counter.innerHTML = "<span class='blink'>..waiting</span>";
    stars.length = 3;
    for (i = 0; i < stars.length; i++) {
      stars[i].className = "";
      stars[i].classList.add("fas", "fa-star");
    }
    second = 0;
    minute = 0;
    min.innerHTML = "00";
    sec.innerHTML = "00";
    volReadout.innerHTML = 50 + "%";
    volumeSlide.value = 50;
    volume();
    clearInterval(gameTime);
  }

  volumeSlide.addEventListener("input", volume);
  volumeSlide.addEventListener("input", function(e) {
    volumeSlide.textContent = e.currentTarget.value;
    if (volumeSlide.value > 0) {
      volReadout.innerHTML = volumeSlide.textContent + "%";
    } else {
      volReadout.innerHTML = "<i class='fas fa-volume-off'></i>";
    }
  });

  function volume() {
    soundTock.volume = volumeSlide.value / 100;
    matchedSound.volume = volumeSlide.value / 100;
    unmatchedSound.volume = volumeSlide.value / 100;
    win.volume = volumeSlide.value / 100;
  }

  var displayCard = function () {
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
              unmatchedSound.playbackRate = 1.5;
              unmatchedSound.play();
            }
      }
  }

  function matched() {
    openedCards[0].classList.add("match", "match-animation", "disabled");
    openedCards[1].classList.add("match", "match-animation", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];

  }

  function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function() {
      openedCards[0].classList.remove("show", "open", "no-event","unmatched");
      openedCards[1].classList.remove("show", "open", "no-event","unmatched");
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
    function halfStar() {
      stars[i].classList.remove("fa-star");
      stars[i].classList.add("fa-star-half");
    }

    function emptyStar() {
      stars[i].classList.remove("fas", "fa-star-half");
      stars[i].classList.add("far", "fa-star");
    }

    if (moves === 1) {
      second = 0;
      minute = 0;
      startTimer();
    } else if (moves > 16 && moves <= 18) {
      for (i = 0; i < 3; i++) {
        if (i === 2) {
          halfStar();
        }
      }
    } else if (moves > 18 && moves <= 20) {
      for (i = 0; i < 3; i++) {
        if (i === 2) {
          emptyStar();
        }
      }
    } else if (moves > 20 && moves <= 22) {
      for (i = 0; i < 2; i++) {
        if (i === 1) {
          halfStar();
        }
      }
    } else if (moves > 22 && moves <= 24) {
      for (i = 0; i < 2; i++) {
        if (i === 1) {
          emptyStar();
        }
      }
    } else if (moves > 24 && moves <= 26) {
      for (i = 0; i < 1; i++) {
        if (i === 0) {
          halfStar();
        }
      }
    } else if (moves > 26) {
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
      timerTock();
    }, 1000);
  }

  function timerTock() {
    soundTock.play();
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
      if (moves === 16) {
        totalMoves.innerHTML = "At " + moves + " moves, you had a perfect score!";
      } else if (moves < 16) {
        totalMoves.innerHTML = "At " + moves + " moves, you were beyond perfect!";
      } else if (moves > 16 && moves <= 18) {
        totalMoves.innerHTML = "At " + moves + " moves, you did great!";
      } else if (moves > 18 && moves <= 20) {
        totalMoves.innerHTML = "At " + moves + " moves, you weren't half bad!";
      } else if (moves > 20 && moves <= 22) {
        totalMoves.innerHTML = "At " + moves + " moves, you were exactly half good and half bad!";
      } else if (moves > 22 && moves <= 24) {
        totalMoves.innerHTML = "At " + moves + " moves, you're not terrible!";
      } else if (moves > 24 && moves <= 26) {
        totalMoves.innerHTML = "At " + moves + " moves, you should play again!";
      } else if (moves > 26) {
        totalMoves.innerHTML = "At " + moves + " moves, do you remember what you were playing?!";
      }
      document.querySelector(".rating").innerHTML = starRating;
      document.getElementById("totalTime").innerHTML = finalTime;
    }
  }

  function matchAnimations() {
    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      if (cards[i].getAttribute("title") === "ninja") {
        console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-ninja");
      } else if (cards[i].getAttribute("title") === "glasses") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-glasses");
      } else if (cards[i].getAttribute("title") === "game") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-game");
      } else if (cards[i].getAttribute("title") === "frog") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-frog");
      } else if (cards[i].getAttribute("title") === "eye") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-eye");
      } else if (cards[i].getAttribute("title") === "poo") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-poo");
      } else if (cards[i].getAttribute("title") === "dice") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-dice");
      } else if (cards[i].getAttribute("title") === "agent") {
          console.log(card);
          card.classList.remove("match-animation");
          card.classList.add("celebrate-agent");
        }
    }
  }

  HTMLAudioElement.prototype.stop = function() {
    this.pause();
    this.currentTime = 0.0;
  };

  function reset() {
    modal.style.display = "none";
    win.stop();
    startGame();
  }

  function cardClicks() {
    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      card.addEventListener("click", displayCard);
      card.addEventListener("click", cardOpen);
      card.addEventListener("click", gameOver);
    }
  }
  cardClicks();

    restart.addEventListener("click", startGame);
    playAgainBtn.addEventListener("click", reset);

/* Popular typing text effect borrowed from https://codepen.io/gschier/pen/jkivt */

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
