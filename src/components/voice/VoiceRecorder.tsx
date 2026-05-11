"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isProcessing?: boolean;
  className?: string;
}

type RecordingState = "idle" | "recording" | "processing";

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isProcessing = false,
  className = "",
}) => {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>(new Array(24).fill(4));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update state when parent signals processing
  useEffect(() => {
    if (isProcessing) setState("processing");
    else if (state === "processing") setState("idle");
  }, [isProcessing]);

  // Waveform animation loop
  const animateWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Sample 24 bars from frequency data
    const step = Math.floor(dataArray.length / 24);
    const newBars = [];
    for (let i = 0; i < 24; i++) {
      const value = dataArray[i * step];
      const height = Math.max(4, (value / 255) * 40);
      newBars.push(height);
    }
    setBars(newBars);
    animFrameRef.current = requestAnimationFrame(animateWaveform);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      // Set up audio analyser for waveform
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(blob);
      };

      mediaRecorder.start(250); // Collect data every 250ms
      mediaRecorderRef.current = mediaRecorder;

      setState("recording");
      setDuration(0);

      // Timer
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Start waveform animation
      animateWaveform();
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Нет доступа к микрофону. Разрешите доступ в настройках браузера.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    analyserRef.current = null;
    setBars(new Array(24).fill(4));
    setState("processing");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`voice-recorder flex flex-col items-center gap-4 ${className}`}>
      {/* Waveform */}
      <div className="voice-waveform flex items-end justify-center gap-[3px] h-12 w-full max-w-[280px]">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`voice-bar rounded-full transition-all duration-75 ${
              state === "recording"
                ? "bg-gradient-to-t from-red-500 to-red-300"
                : "bg-md-outline/20"
            }`}
            style={{
              height: `${height}px`,
              width: "6px",
              minHeight: "4px",
            }}
          />
        ))}
      </div>

      {/* Timer */}
      {state === "recording" && (
        <div className="flex items-center gap-2 text-red-500 font-mono text-lg font-bold">
          <div className="voice-pulse-dot w-3 h-3 rounded-full bg-red-500" />
          {formatTime(duration)}
        </div>
      )}

      {state === "processing" && (
        <div className="flex items-center gap-2 text-md-primary font-medium text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Обработка...
        </div>
      )}

      {/* Record Button */}
      <button
        type="button"
        onClick={state === "recording" ? stopRecording : startRecording}
        disabled={state === "processing"}
        className={`voice-record-btn relative w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${
          state === "recording"
            ? "bg-red-500 hover:bg-red-600 text-white voice-record-btn--active"
            : state === "processing"
            ? "bg-md-outline/20 text-md-outline"
            : "bg-md-primary hover:bg-md-primary/90 text-white hover:scale-105 active:scale-95"
        }`}
      >
        {state === "recording" ? (
          <Square className="w-6 h-6" fill="currentColor" />
        ) : state === "processing" ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {/* Hint */}
      <p className="text-xs text-md-on-surface-variant text-center">
        {state === "idle" && "Нажмите для начала записи"}
        {state === "recording" && "Нажмите для остановки"}
        {state === "processing" && "Идёт распознавание речи..."}
      </p>
    </div>
  );
};

export default VoiceRecorder;
