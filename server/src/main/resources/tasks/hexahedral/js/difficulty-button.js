import { h } from 'virtual-dom';
import {
  DIFFICULTY_LABELS,
  STARTING_LEVEL_NUMBERS,
} from './difficulty';
import { startGame, loadLevel, getJSON, afterConfigFetched, getDifficultyByAge} from './game';

export default function DifficultyButton ({ difficulty }) {
  return h('button.difficulty-button', {
    key: difficulty,
    onclick: () => {
    getJSON("/hexahedral/config", afterConfigFetched);
    const difficulty_ = getDifficultyByAge();
    console.log("jezus");
    startGame(STARTING_LEVEL_NUMBERS[difficulty_])
    },
  }, DIFFICULTY_LABELS[difficulty]);
}
