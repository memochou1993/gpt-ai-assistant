import Prompt from './prompt.mjs';

class Storage {
  prompts = new Map();

  /**
   * @param {string} id
   * @returns {Prompt}
   */
  getPrompt(id) {
    return this.prompts.get(id) || new Prompt();
  }

  /**
   * @param {string} id
   * @param {Prompt} prompt
   */
  setPrompt(id, prompt) {
    this.prompts.set(id, prompt);
  }

  toString() {
    return Array.from(this.prompts).map(([id, prompt]) => `${id}\n===\n${prompt.toString()}`).join('\n');
  }
}

export default Storage;
