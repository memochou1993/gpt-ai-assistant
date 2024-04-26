import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { ROLE_AI, ROLE_HUMAN } from '../../services/openai.js';
import { generateCompletion } from '../../utils/index.js';
import { COMMAND_BOT_CONTINUE, COMMAND_BOT_TALK, COMMAND_BOT_FORGET } from '../commands/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => (
  context.hasCommand(COMMAND_BOT_TALK)
  || context.hasBotName
  || context.source.bot.isActivated
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    const prompt = getPrompt(context.userId);
    try {
      const obj = {
        text: "",
        actions: []
      }

      if (context.event.isImage) {
        context.pushText('Get Image', [COMMAND_BOT_FORGET]);
        obj.text = context.trimmedText
        prompt.writeImageMsg(ROLE_HUMAN, obj.text).write(ROLE_AI);
        prompt.patch('Get Image！！');
        updateHistory(context.id, (history) => history.writeImageMsg(ROLE_HUMAN, obj.text));

      } else {
        prompt.write(ROLE_HUMAN, `${t('__COMPLETION_DEFAULT_AI_TONE')(config.BOT_TONE)}${context.trimmedText}`).write(ROLE_AI);
        const { text, isFinishReasonStop } = await generateCompletion({ prompt });
        obj.text = text;
        obj.actions = isFinishReasonStop ? [COMMAND_BOT_FORGET] : [COMMAND_BOT_CONTINUE];
        context.pushText(obj.text, obj.actions);
        prompt.patch(obj.text);
        updateHistory(context.id, (history) => history.write(config.BOT_NAME, obj.text));
      }

      setPrompt(context.userId, prompt);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
