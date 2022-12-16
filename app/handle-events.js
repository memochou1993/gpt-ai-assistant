import Event from './event.js';

const handleEvents = async (events = []) => Promise.all(
  (await Promise.all(
    events
      .map((event) => new Event(event))
      .filter((event) => event.isEventTypeMessage)
      .filter((event) => event.isMessageTypeText)
      .map((event) => event.handle()),
  ))
    .filter((event) => event.replies.length > 0)
    .map((event) => event.reply()),
);

export default handleEvents;
