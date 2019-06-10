import { h } from 'virtual-dom';
import DifficultyRow from './difficulty-row';
import DifficultySelector from './difficulty-selector';

export default function LevelNavigator ({
  currentDifficulty,
  currentLevelNumber,
  maxLevelReached,
}) {
  return h('nav', [
    DifficultySelector({ currentDifficulty }),
    DifficultyRow({ currentDifficulty, currentLevelNumber, maxLevelReached }),
  ]);
}
