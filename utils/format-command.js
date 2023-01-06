import { MessageAction } from '../app/actions/index.js';

const formatCommand = (commands) => commands.map((c) => new MessageAction(c));

export default formatCommand;
