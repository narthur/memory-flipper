$(document).ready(function() {
  layDownCards();
  setClickHandlers();
  $('input').on('keyup', function() {
    var color = stringToColor( $(this).val() );
    $(this).closest('.player').css('background-color',color);
  });
});

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
      promise.then(function() {
        switchPlayers();
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
  if (doCardsMatch()) {
    console.log('Match!');
  } else {
    console.log('Miss...');
  }
  return promise = new Promise((resolve, reject) => {
    setTimeout(function(){
      if (doCardsMatch()) takeMatch();
      clearGuess();
      resolve();
    }, 1000);
  });

}

function takeMatch() {
  var symbol = $('.active').html();
  $('.active').addClass('taken');
  var match = $('<div class="match">'+symbol+'</div>')
  $('.player.up .matches').append(match);
  setTimeout(function(){
    match.addClass('highlight');
  }, 300);
  setTimeout(function(){
    match.removeClass('highlight');
    match.css('transform','rotate('+((Math.random() * .1)-.05)+'turn)');
  }, 1000);
}

function doCardsMatch() {
  var cards = $('.active');
  return $(cards[0]).html() === $(cards[1]).html();
}

function layDownCards() {
  var symbols = shuffle([...Array(40).keys()]);
  var cards = makeCards(symbols, 20);
  $('.cards').append(shuffle(cards).join(''));
  $('.card').each(function() {
    $(this).css('transform','rotate('+((Math.random() * .04)-.02)+'turn)');
  });
}

function makeCards(symbols, quantity) {
  var cards = [];
  for (var i = 0; i < quantity; i++) {
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

var stringToColor = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
