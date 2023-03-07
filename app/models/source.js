import { t } from '../../locales/index.js';
import { SOURCE_TYPE_GROUP } from '../../services/line.js';

class Source {
  type;

  name;

  bot;

  createdAt;

  constructor({
    type,
    name,
    bot,
  }) {
    this.type = type;
    this.name = name || (type === SOURCE_TYPE_GROUP ? t('__SOURCE_NAME_SOME_GROUP') : t('__SOURCE_NAME_SOMEONE'));
    this.bot = bot;
    this.createdAt = Math.floor(Date.now() / 1000);
  }
}

export default Source;
