import axios from 'axios';

const fetchVersion = async () => {
  const url = 'https://raw.githubusercontent.com/memochou1993/gpt-ai-assistant/main/package.json';
  const { data } = await axios.get(url);
  return data.version;
};

export default fetchVersion;
