import { useState, useRef, useCallback, useEffect } from 'react';
import './Recorder.css';

export default function Recorder({ onAudioReady, onReset, isLoading, hasResults, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [permissionError, setPermissionError] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach((t) => t.stop());
        onAudioReady(blob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setSeconds(0);
      setPermissionError(false);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 119) {
            stopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setPermissionError(true);
    }
  }, [onAudioReady]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const handleReset = useCallback(() => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setSeconds(0);
    setPermissionError(false);
    onReset();
  }, [audioURL, onReset]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (permissionError) {
    return (
      <div className="recorder-card recorder-error">
        <span>🎙️</span>
        <p>Microphone access was denied. Please allow microphone permission and try again.</p>
        <button className="btn-secondary" onClick={() => setPermissionError(false)}>Retry</button>
      </div>
    );
  }

  return (
    <div className="recorder-card">
      {!hasResults && !isLoading && (
        <p className="recorder-hint">
          {disabled ? 'Select a topic above to start' : 'Click the button and speak in English'}
        </p>
      )}

      <div className="recorder-center">
        {!isRecording && !isLoading && !hasResults && (
          <button
            className="btn-record"
            onClick={startRecording}
            disabled={disabled}
            aria-label="Start recording"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4zm-6 10a1 1 0 0 0-2 0 8 8 0 0 0 7 7.938V21H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.062A8 8 0 0 0 20 11a1 1 0 0 0-2 0 6 6 0 0 1-12 0z"/>
            </svg>
            Start Speaking
          </button>
        )}

        {isRecording && (
          <div className="recording-active">
            <div className="recording-pulse">
              <div className="pulse-ring" />
              <div className="pulse-ring pulse-ring-2" />
              <button className="btn-stop" onClick={stopRecording} aria-label="Stop recording">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                </svg>
              </button>
            </div>
            <div className="recording-info">
              <span className="recording-dot" />
              <span className="recording-label">Recording</span>
              <span className="recording-timer">{formatTime(seconds)}</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="spinner" />
            <p className="loading-text">Analyzing your speech…</p>
          </div>
        )}

        {hasResults && !isLoading && (
          <button className="btn-secondary" onClick={handleReset}>
            🔄  Try Again
          </button>
        )}
      </div>

      {audioURL && !isLoading && (
        <audio className="audio-player" controls src={audioURL} />
      )}
    </div>
  );
}
