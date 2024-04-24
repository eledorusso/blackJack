import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import deckCombinations from './data/deckCombinations.jsx';
import shuffleDeck from './utils/shuffleDeck.jsx';

const BlackjackGame = () => {
  const [areCardsDealt, setAreCardsDealt] = useState(false); //Cards are not shown until 'New Game' is pressed and cards are dealt.
  const [isStanding, setIsStanding] = useState(false); //When you press 'Stand' and the dealer starts drawing cards for themself.
  const [result, setResult] = useState(''); //The result of who win the game. You or the dealer.
  const [deck, setDeck] = useState([]); //The Deck where cads are drawn to the players and dealers hand.
  const [playerHand, setPlayerHand] = useState([]); //An array of objects that has the info of the cards the player has
  const [playerHandTotal, setPlayerHandTotal] = useState(); // This takes the array above and calculates sum of the cards
  const [dealerHand, setDealerHand] = useState([]); // An array similar to playerHand
  const [chips, setChips] = useState(1000); // The amount of money (chips) you have
  const deckRef = useRef(4); // Keeps track of the index in the deck to draw. The first 0 to 3 are drawn at the start of the game

  useEffect(() => {
    setDeck(shuffleDeck(deckCombinations)); //Always re-shuffle else you run out of cards doing new games
  }, []);

  useEffect(() => {
    //updates every time the player hand changes
    setPlayerHandTotal(calculateHandValue(playerHand));
    document.getElementById('audio').volume = 0.1;
    document.getElementById('audio').play();
  }, [playerHand]);

  useEffect(() => {
    // if the player total goes over 21 they automatically lose 10 chips and the game is over
    if (playerHandTotal > 21) {
      setResult('busted');
      setChips(chips - 10);
      setDeck(shuffleDeck(deckCombinations)); //Always re-shuffle else you run out of cards doing new games
    }
  }, [playerHandTotal]);

  const startNewGame = () => {
    // function to reset everything basically and start a new game
    deckRef.current = 4;
    setResult('');
    setIsStanding(false);
    setPlayerHand([deck[0], deck[1]]); // Copies the first 2 idx's from deck;
    setDealerHand([deck[2], deck[3]]); // Copies the 3rd and 4th idx's from deck;
    setAreCardsDealt(true);
  };

  const hitMe = () => {
    const newCard = deck[deckRef.current];
    setPlayerHand([...playerHand, newCard]); // Adds a card to the player's hand from current idx
    deckRef.current += 1; // +1 to the deckRef so you don't get the same idx twice
  };

  const stand = () => {
    // Stand means the player doesn't want more cards and it's the dealer's turn.
    setIsStanding(true);

    let dealerCards = dealerHand; //the while loop pushes cards here calculating at least 17 points
    let ref = deckRef.current;

    while (calculateHandValue(dealerCards) <= 17) {
      const newCard = deck[ref];
      dealerCards.push(newCard);
      ref++;
    }
    setDealerHand(dealerCards);
    // Determine winner after while loop gets to 17 or more
    chooseWinner();
  };

  const calculateHandValue = hand => {
    let sum = 0;
    let aces = 0; //number of aces in hand

    for (const card of hand) {
      if (card.value === 'a') {
        aces++; // to know how many aces we have
        sum += 11;
      } else if (
        card.value === 'k' ||
        card.value === 'q' ||
        card.value === 'j'
      ) {
        sum += 10; // The 3 letters are worth 10 points
      } else {
        sum += parseInt(card.value); // Every card that has a number, not a letter, is converted to an integer and added to sum
      }
    }

    while (sum > 21 && aces > 0) {
      //Aces can have the values 11 or 1 so while the players have aces and are above 21 points they can change their aces into 1's to
      // try to go to 21 points or below
      sum -= 10;
      aces--;
    }
    return sum;
  };

  const chooseWinner = () => {
    const dealerValue = calculateHandValue(dealerHand); //Calculates the dealer final points. Player ponts are calculated on every hit

    if (playerHandTotal === dealerValue) {
      setResult('push'); // a Draw is called push
    } else if (playerHandTotal > dealerValue) {
      setResult('win');
      setChips(chips + 10); // gain 10 chips for winning
    } else {
      setResult('busted'); //busted means you lose in black jack
      setChips(chips - 10);
    }
    setDeck(shuffleDeck(deckCombinations)); //Always re-shuffle else you run out of cards doing new games
  };

  return (
    <div className="mainContainer">
      <audio id="audio" loop>
        <source src="/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <h1>Blackjack</h1>

      {!areCardsDealt ? null : (
        <>
          {/* DEALER'S CARDS */}
          <div>
            <img
              src={`/imgs/${dealerHand[0].value}${dealerHand[0].type}.jpg`} //Images are dynamically imported according to value and type
            />

            {!isStanding ? (
              <img src="/imgs/back-red.png" /> //the dealer always starts with a face down card
            ) : (
              <img
                src={`/imgs/${dealerHand[1].value}${dealerHand[1].type}.jpg`} // the card is revealed when standing
              />
            )}
            {dealerHand.map((_, idx) => {
              if (idx > 1) {
                return (
                  <img
                    src={`/imgs/${dealerHand[idx].value}${dealerHand[idx].type}.jpg`} //the rest of the dealer's cards mapped
                  />
                );
              }
            })}
          </div>
          {/* PLAYER'S CARDS */}
          <div>
            <img
              src={`/imgs/${playerHand[0].value}${playerHand[0].type}.jpg`}
            />
            <img
              src={`/imgs/${playerHand[1].value}${playerHand[1].type}.jpg`}
            />
            {playerHand.map((_, idx) => {
              if (idx > 1) {
                return (
                  <img
                    src={`/imgs/${playerHand[idx].value}${playerHand[idx].type}.jpg`} // rest of the player's cards mapped
                  />
                );
              }
            })}
          </div>
        </>
      )}
      {/* BUTTONS */}
      <div className="buttonsContainer">
        <button onClick={startNewGame}>Start New Game</button>
        <button
          onClick={hitMe}
          disabled={result === 'busted' || isStanding || !areCardsDealt} //disabled depending on state
        >
          Hit Me!
        </button>
        <button
          onClick={stand}
          disabled={result === 'busted' || isStanding || !areCardsDealt}
        >
          Stand
        </button>
      </div>
      {/* CHIPS */}
      <p>
        Current Chips: {chips} <br />
        Current Bet: 10
      </p>
      {/* RED TEXT AFTER WINNING, POSITIONED ABSOLUTE */}
      {result === 'busted' ? (
        <p className="resultText">BUSTED!</p>
      ) : result === 'push' ? (
        <p className="resultText">IT'S A PUSH!</p>
      ) : result === 'win' ? (
        <p className="resultText">YOU WIN!</p>
      ) : null}
    </div>
  );
};

export default BlackjackGame;
