import config from '../config/index.js';
import { search } from '../services/serpapi.js';

class OrganicResult {
  answer;

  constructor({
    answer,
  } = {}) {
    this.answer = answer;
  }
}

const fetchAnswer = async (q) => {
  if (config.APP_ENV !== 'production' || !config.SERPAPI_API_KEY) return new OrganicResult();
  const res = await search({ q });
  const { answer_box: answerBox, organic_results: organicResults } = res.data;
  const answer = answerBox?.result ? `${answerBox?.result} (${answerBox?.extensions[0]})` : '';
  const { snippet } = organicResults[0];
  return new OrganicResult({ answer: answer || snippet || '' });
};

export default fetchAnswer;
