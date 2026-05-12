import { useEffect, useRef } from 'react';

export default function Waveform({ stream, isRecording }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext('2d');

    if (!stream || !isRecording) {
      // Draw flat idle line
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.beginPath();
      canvasCtx.strokeStyle = 'rgba(108,99,255,0.3)';
      canvasCtx.lineWidth = 2;
      canvasCtx.moveTo(0, canvas.height / 2);
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
      return;
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = audioCtx;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      canvasCtx.clearRect(0, 0, W, H);

      const barW = (W / bufferLength) * 2;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 255;
        const barH = v * H * 0.85;
        const alpha = 0.35 + v * 0.65;
        canvasCtx.fillStyle = `rgba(108,99,255,${alpha})`;
        canvasCtx.beginPath();
        canvasCtx.roundRect(x, (H - barH) / 2, Math.max(barW - 2, 1), barH, 2);
        canvasCtx.fill();
        x += barW;
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      source.disconnect();
      audioCtx.close().catch(() => {});
    };
  }, [stream, isRecording]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={56}
      style={{ width: '100%', height: 56, borderRadius: 10, background: 'rgba(108,99,255,0.06)' }}
    />
  );
}
