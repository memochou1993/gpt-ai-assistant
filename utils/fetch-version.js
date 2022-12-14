import axios from 'axios';

const fetchVersion = () => {
  const url = 'https://raw.githubusercontent.com/memochou1993/gpt-ai-assistant/main/package.json';
  return axios.get(url);
};

export default fetchVersion();
