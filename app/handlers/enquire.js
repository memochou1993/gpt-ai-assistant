import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateCompletion, getActions, getCommand } from '../../utils/index.js';
import { MessageAction } from '../actions/index.js';
import {
  ACT_COMMANDS, ANALYZE_COMMANDS, COMMAND_SYS_CONTINUE, TRANSLATE_COMMANDS,
} from '../commands/index.js';
import Context from '../context.js';
import { getHistory, updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => (
  [...ACT_COMMANDS, ...ANALYZE_COMMANDS, ...TRANSLATE_COMMANDS]
    .sort((a, b) => b.text.length - a.text.length)
    .some((command) => context.isCommand(command) || (context.hasBotName && context.hasCommand(command)))
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    updateHistory(context.id, (history) => history.records.pop());
    const command = getCommand(context.trimmedText);
    const history = getHistory(context.id);
    const reference = command.type === TYPE_TRANSLATE ? history.lastRecord.text : history.toString();
    const content = `${command.prompt}\n${t('__COMPLETION_QUOTATION_MARK_OPENING')}\n${reference}\n${t('__COMPLETION_QUOTATION_MARK_CLOSING')}`;
    const prompt = getPrompt(context.userId);
    prompt.write(PARTICIPANT_HUMAN, content).write(PARTICIPANT_AI);
    try {
      const { text, isFinishReasonStop } = await generateCompletion({ prompt: content });
      prompt.patch(text);
      if (!isFinishReasonStop) prompt.write('', command.type);
      setPrompt(context.userId, prompt);
      const enquiryActions = getActions(command);
      const actions = isFinishReasonStop ? enquiryActions : [new MessageAction(COMMAND_SYS_CONTINUE)];
      context.pushText(text, actions);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
