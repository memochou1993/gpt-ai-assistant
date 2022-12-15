import fs from 'fs';

const PATH = '/tmp/gpt-ai-assistant.json';

class Storage {
  static read() {
    try {
      return JSON.parse(fs.readFileSync(PATH));
    } catch (err) {
      return {};
    }
  }

  static write(data) {
    fs.writeFileSync(PATH, JSON.stringify(data));
  }

  static getItem(key) {
    const data = Storage.read();
    return data[key];
  }

  static setItem(key, value) {
    const data = Storage.read();
    data[key] = value;
    Storage.write(data);
  }

  static removeItem(key) {
    const data = Storage.read();
    delete data[key];
    Storage.write(data);
  }
}

export default Storage;
