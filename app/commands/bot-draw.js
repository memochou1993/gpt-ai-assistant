import { TYPE_SYSTEM } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_SYSTEM,
  label: t('__COMMAND_BOT_DRAW_LABEL'),
  text: t('__COMMAND_BOT_DRAW_TEXT'),
  prompt: t('__COMMAND_BOT_DRAW_PROMPT'),
  aliases: [
    ...t('__COMMAND_BOT_DRAW_ALIASES'),
    '/draw',
    'Draw',
    '請畫',
    '畫一',
    '畫給我',
    '可以畫',
    '可以看',
    '我要看',
    '我想看',
    '給我看',
    '給我一張',
    '我要一張',
    '我可以看',
    '請給我看',
    '傳給我一張',
  ],
});
