import { h } from 'virtual-dom';
import DifficultyButton from './difficulty-button';
import { EASY, MEDIUM, HARD } from './difficulty-levels';

export default function DifficultyButtons () {
  return h('div.difficulty-buttons', [MEDIUM].map(difficulty =>
    DifficultyButton({ difficulty })
  ));
}
