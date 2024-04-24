const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'j',
  'q',
  'k',
  'a',
];

const types = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

const deckCombinations = [];

for (const type of types) {
  for (const value of values) {
    deckCombinations.push({ value, type });
  }
}

export default deckCombinations;

//MAKES AN ARRAY OF EVERY COMBINATION OF CARDS AS OBJECTS WITH A VALUE AND A TYPE
