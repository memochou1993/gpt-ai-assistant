import config from '../config/index.js';
import { search } from '../services/serpapi.js';

class OrganicResult {
  snippet;

  constructor({
    snippet,
  } = {}) {
    this.snippet = snippet;
  }
}

const fetchAnswer = async (q) => {
  if (config.APP_ENV !== 'production' || !config.SERPAPI_API_KEY) return new OrganicResult();
  const res = await search({ q });
  const { organic_results: organicResults } = res.data;
  return new OrganicResult(organicResults[0]);
};

export default fetchAnswer;
