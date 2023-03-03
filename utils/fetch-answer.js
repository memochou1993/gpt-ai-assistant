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
  const { answer_box: answerBox, knowledge_graph: knowledgeGraph, organic_results: organicResults } = res.data;
  let answer = organicResults[0].snippet;
  if (answerBox?.answer) answer = answerBox.answer;
  if (answerBox?.result) answer = answerBox.result;
  if (answerBox?.snippet) answer = answerBox.snippet;
  if (knowledgeGraph?.description) answer = `${knowledgeGraph.title} - ${knowledgeGraph.description}`;
  return new OrganicResult({ answer });
};

export default fetchAnswer;
