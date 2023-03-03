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
  let answer = organicResults[0].snippet;
  if (answerBox?.result) answer = answerBox.result;
  if (answerBox?.snippet) answer = answerBox.snippet;
  return new OrganicResult({ answer });
};

export default fetchAnswer;
