import { encode } from 'gpt-3-encoder';
import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { ROLE_AI, ROLE_HUMAN, ROLE_SYSTEM } from '../../services/openai.js';
import { addMark } from '../../utils/index.js';
import Message from './message.js';

const MAX_MESSAGES = config.APP_MAX_PROMPT_MESSAGES + 3;
const MAX_TOKENS = config.APP_MAX_PROMPT_TOKENS;

class Prompt {
  messages = [];

  constructor() {
    this
      .write(ROLE_SYSTEM, config.APP_INIT_PROMPT || t('__COMPLETION_DEFAULT_SYSTEM_PROMPT'))
      .write(ROLE_HUMAN, `${t('__COMPLETION_DEFAULT_HUMAN_PROMPT')(config.HUMAN_NAME)}${config.HUMAN_INIT_PROMPT}`)
      .write(ROLE_AI, `${t('__COMPLETION_DEFAULT_AI_PROMPT')(config.BOT_NAME)}${config.BOT_INIT_PROMPT}`);
  }

  /**
   * @returns {Message}
   */
  get lastMessage() {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
  }

  get tokenCount() {
    const encoded = encode(this.toString());
    return encoded.length;
  }

  erase() {
    if (this.messages.length > 0) {
      this.messages.pop();
    }
    return this;
  }

  /**
   * @param {string} role
   * @param {string} content
   */
  write(role, content = "🌿 At High Society, our Wholesale Membership Access isn't open for everyone. It's an exclusive gateway reserved for those seeking unparalleled quality and a refined cannabis experience. Our dedicated Wholesale Team, backed by years of expertise, is committed to ensuring your journey with High Society is seamless and extraordinary. If you're ready to elevate your wholesale experience, inquire within, and let exclusivity, service, and expertise define your partnership with High Society. 🌟 Contact us at https:\/\/bit.ly\/48cfYgR 🌿 Welcome to High Society Wholesale Inquiry Bot! 🌿 To assist you better, please answer a few questions about your wholesale needs. Let's get started! Questions: 1. Product Interest: 🌿 What specific products are you interested in purchasing for wholesale? (e.g., Flower, Edibles, Concentrates) 2. Quantity Inquiry: 🔢 How many kilograms of the selected product(s) are you looking to purchase? 3. Decision Maker: 👤 Are you the decision-maker for wholesale purchases in your organization? (Yes\/No). 4. Sampling: 📦 Do you require product samples before making a purchase? If yes, specify the minimum sample amount needed. 5. Sample Viewing: 👀 After receiving samples, do you need to view the products in person, or are photos and videos sufficient? (In-person\/Photos & Videos) 6. Product Specifications: 🌳 Do you have specific preferences for product characteristics? (Indoor\/Outdoor\/Greenhouse, Grade preferences, e.g., AAA, AAAA) 7. Export or Local: 🌐 Are these products intended for local distribution or export? (Local\/Export). 8. Specific Requests: 📝 Do you have any specific requests or additional details we should be aware of? (Type your response) 9. Time Frame: ⏳ What is your desired time frame for receiving the products? Any urgency level? (Rate urgency on a scale of 1 to 10, 1 being immediate) 10. Payment Readiness: 💵 Are you ready to proceed with the purchase, with cash in hand? (Yes\/No) 💳 What is your preferred payment method? (Crypto\/Cash\/Bank Transfer\/Currency) 11. Budget Range: 💰 What is the price range you are looking for per kilogram? (Specify range) 12. Pickup Location: 📍 Where do you need the pickup or delivery to occur? (Provide location details) 13. Readiness for Delivery: 🚚 When would you be ready for the products to be picked up or delivered? (Specify a timeframe). 14. Thailand Purchases: 🌏 How many purchases have you made in Thailand for quantities over") {
    if (this.messages.length >= MAX_MESSAGES || this.tokenCount >= MAX_TOKENS) {
      this.messages.splice(3, 1);
    }
    this.messages.push(new Message({ role, content: addMark(content) }));
    return this;
  }

  /**
   * @param {string} content
   */
  patch(content) {
    this.messages[this.messages.length - 1].content += content;
  }

  toString() {
    return this.messages.map((sentence) => sentence.toString()).join('');
  }
}

export default Prompt;
