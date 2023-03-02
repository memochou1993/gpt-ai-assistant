import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import { ROLE_AI, ROLE_HUMAN } from '../../services/openai.js';
import { generateCompletion, getCommand } from '../../utils/index.js';
import { ALL_COMMANDS, COMMAND_BOT_CONTINUE, ENQUIRE_COMMANDS } from '../commands/index.js';
import Context from '../context.js';
import { getHistory, updateHistory } from '../history/index.js';
import { getPrompt, setPrompt, Prompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => (
  [...ENQUIRE_COMMANDS]
    .sort((a, b) => b.text.length - a.text.length)
    .some((command) => context.hasCommand(command))
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    updateHistory(context.id, (history) => history.erase());
    const command = getCommand(context.trimmedText);
    const history = getHistory(context.id);
    if (!history.lastMessage) return context;
    const reference = command.type === TYPE_TRANSLATE ? history.lastMessage.content : history.toString();
    const content = `${command.prompt}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}\n${reference}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`;
    const partial = (new Prompt()).write(ROLE_HUMAN, content);
    const prompt = getPrompt(context.userId);
    prompt.write(ROLE_HUMAN, content).write(ROLE_AI);
    try {
      const { text, isFinishReasonStop } = await generateCompletion({ prompt: partial });
      prompt.patch(text);
      if (!isFinishReasonStop) prompt.write('', command.type);
      setPrompt(context.userId, prompt);
      const defaultActions = ALL_COMMANDS.filter(({ type }) => type === command.type);
      const actions = isFinishReasonStop ? defaultActions : [COMMAND_BOT_CONTINUE];
      context.pushText(text, actions);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
