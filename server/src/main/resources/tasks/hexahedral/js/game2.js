import { h } from 'virtual-dom';
import DifficultyButtons from './difficulty-buttons';
import Level from './level';
import LevelNavigator from './level-navigator';
import Progress from './progress';
import { MAIN_MENU } from './game-statuses';

export default function Game (props) {
  const { currentDifficulty, status } = props;

  const children = status === MAIN_MENU ? [
    DifficultyButtons(props),
  ] : [
    Progress(props),
    Level(props),
    // LevelNavigator(props),
  ];

  return h('div#game', {
    className: [
      currentDifficulty,
      status,
    ].join(' ').toLowerCase().replace('_', '-'),
  }, children);
}
