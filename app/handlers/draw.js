import config from '../../config/index.js';
import { MOCK_TEXT_OK } from '../../constants/mock.js';
import { PARTICIPANT_AI, PARTICIPANT_HUMAN } from '../../services/openai.js';
import { generateImage } from '../../utils/index.js';
import { COMMAND_BOT_DRAW } from '../commands/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

//en
import { generateCompletion } from '../../utils/index.js';
import { COMMAND_BOT_CONTINUE, COMMAND_BOT_TALK } from '../commands/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_BOT_DRAW);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    const prompt = getPrompt(context.userId);
    const prompt2 = getPrompt(context.userId);
    //context.pushText("翻譯英文", []);
    
    prompt.write(PARTICIPANT_HUMAN, `${context.trimmedText}。`).write(PARTICIPANT_AI);
    try {
      //translate to en
      const { text, isFinishReasonStop } = await generateCompletion({ prompt: "翻譯英文"+prompt.toString() });
      prompt.patch(text);
      setPrompt(context.userId, prompt);
      updateHistory(context.id, (history) => history.write(config.BOT_NAME, text));
      const actions = isFinishReasonStop ? [] : [COMMAND_BOT_CONTINUE];
      //context.pushText(text, actions);
      context.messages[0] = text;
      
      
      prompt2.write(PARTICIPANT_HUMAN, `${context.trimmedText}`).write(PARTICIPANT_AI);
      const { url } = await generateImage({ prompt: context.trimmedText, size: config.OPENAI_IMAGE_GENERATION_SIZE });
      prompt2.patch(MOCK_TEXT_OK);
      setPrompt(context.userId, prompt2);
      updateHistory(context.id, (history) => history.write(config.BOT_NAME, MOCK_TEXT_OK));
      context.pushImage(url);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
