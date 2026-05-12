import { useState, useEffect } from 'react';
import './TopicCard.css';

const TOPICS = [
  { id: 1, title: 'Describe your ideal weekend', prompt: 'Talk about what you would do on your perfect weekend — activities, places, and people involved.' },
  { id: 2, title: 'Your favorite hobby', prompt: 'Explain a hobby you enjoy, why you started it, and how it has influenced your life.' },
  { id: 3, title: 'A memorable travel experience', prompt: 'Describe a place you have visited or would like to visit, and what makes it special.' },
  { id: 4, title: 'Technology in daily life', prompt: 'Discuss how technology has changed your daily routine and whether these changes are positive.' },
  { id: 5, title: 'A person who inspired you', prompt: 'Talk about someone who has had a significant impact on your life and why.' },
  { id: 6, title: 'Future career goals', prompt: 'Describe your career aspirations and the steps you are taking to achieve them.' },
  { id: 7, title: 'The importance of learning languages', prompt: 'Share your thoughts on why learning foreign languages is valuable in today\'s world.' },
  { id: 8, title: 'Your hometown', prompt: 'Describe where you grew up — the culture, food, environment, and what you miss most about it.' },
  { id: 9, title: 'A challenge you overcame', prompt: 'Talk about a difficult situation you faced, how you handled it, and what you learned.' },
  { id: 10, title: 'Books vs. movies', prompt: 'Which do you prefer — reading books or watching movies — and why? Give specific examples.' },
];

function getRandomTopic(exclude) {
  const pool = exclude ? TOPICS.filter((t) => t.id !== exclude.id) : TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function TopicCard({ topic, onTopicChange, disabled }) {
  useEffect(() => {
    if (!topic) onTopicChange(getRandomTopic(null));
  }, []);

  const handleNew = () => {
    if (!disabled) onTopicChange(getRandomTopic(topic));
  };

  if (!topic) return null;

  return (
    <div className="topic-card">
      <div className="topic-header">
        <span className="topic-badge">Topic</span>
        <button className="topic-refresh" onClick={handleNew} disabled={disabled} title="New topic">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          New topic
        </button>
      </div>
      <h2 className="topic-title">{topic.title}</h2>
      <p className="topic-prompt">{topic.prompt}</p>
    </div>
  );
}
