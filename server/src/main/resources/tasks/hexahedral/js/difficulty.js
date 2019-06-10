import { EASY, MEDIUM, HARD } from './difficulty-levels';

export const DIFFICULTY_LABELS = {
  [EASY]: 'Easy',
  [MEDIUM]: 'Sterując zielonym bloczkiem(naciskając na sąsiednie pola), należy zamienić stan wszystkich płytek na niebieski/wciśnięty. Stan zmienia się gdy zielony bloczek wchodzi nad daną płytkę.',
  [HARD]: 'Hard',
};

export const STARTING_LEVEL_NUMBERS = {
  [EASY]: Math.floor(Math.random() * 10),
  [MEDIUM]: Math.floor(Math.random() * 10) + 10,
  [HARD]: Math.floor(Math.random() * 10) + 20,
};
