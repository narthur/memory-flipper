$(document).ready(function() {
  layDownCards();
  setClickHandlers();
  updateColors();
});

function updateColors() {
  var hues = getHues();
  var players = $('.player');

  $(players[0]).css('--color', `hsl(${hues[0]}, 50%, 40%)`);
  $(players[1]).css('--color', `hsl(${hues[2]}, 50%, 40%)`);
  $('.card').css('--hue', `${hues[1]}`)
}

function clearGuess() {
  $('.active').removeClass('active');
}

function setClickHandlers() {
  $('.card:not(.taken)').on('click', function() {
    if ($('.active').length > 1) clearGuess();
    revealCard(this);
    $('.card').off('click');
    if ($('.active').length > 1) {
      var promise = compareCards();
      promise.then(function(isMatch) {
        if (!isMatch) switchPlayers();
        setClickHandlers();
      });
    } else {
      setClickHandlers();
    }

  });
}

function revealCard(card) {
  $(card).addClass('active');
}

function switchPlayers() {
  $('.player').toggleClass('up');
}

function compareCards() {
  return new Promise((resolve) => {
    setTimeout(function(){
      var isMatch = doCardsMatch();
      if (isMatch) takeMatch();
      clearGuess();
      resolve(isMatch);
    }, 1000);
  });

}

function takeMatch() {
  var active = $('.active')
  var symbol = active.html();
  var match = $('<div class="match">'+symbol+'</div>')

  active.addClass('taken');
  match.css('--tilt',`${(Math.random() * .1)-.05}turn`);

  $('.player.up .matches').append(match);
}

function doCardsMatch() {
  var cards = $('.active');
  return $(cards[0]).html() === $(cards[1]).html();
}

function layDownCards() {
  var cards = makeCards();
  $('.cards').append(shuffle(cards).join(''));
  $('.card').each(function() {
    $(this).css('--tilt',`${(Math.random() * .04)-.02}turn`);
  });
}

function makeCards() {
  var symbols = [...Array(40).keys()];
  var cards = [];
  for (var i = 0; i < 20; i++) {
    var symbol = symbols[i];
    var card = '<div class="card"><img src="animal-icons/'+(symbol+1)+'.png" /></div>';
    cards.push( card );
    cards.push( card );
  }
  return cards;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getHues() {
  var hue1 = Math.random() * 360
  var hue2 = hue1 + 90
  var hue3 = hue2 + 90

  return [hue1, hue2, hue3]
}
