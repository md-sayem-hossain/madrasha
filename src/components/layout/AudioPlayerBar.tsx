import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Download,
  RotateCcw,
  RotateCw,
  Music2,
  Maximize2
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const AudioPlayerBar: React.FC = () => {
  const { currentTrack, isPlayingAudio, togglePlayAudio, stopAudio, language, setActiveTab } = useMadrasa();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  const t = translations[language];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.play().catch(err => {
          console.warn('Audio autoplay prevented or error:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlayingAudio, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  if (!currentTrack) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipSeconds = (sec: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + sec, duration));
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 1.75, 0.75];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIdx]);
  };

  return (
    <div id="sticky-audio-player" className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/95 backdrop-blur-md border-t-2 border-amber-500 shadow-2xl text-white px-4 py-2.5 transition-all">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => togglePlayAudio()}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track info */}
        <div className="flex items-center gap-3 w-full md:w-auto min-w-[220px]">
          <div className="w-10 h-10 rounded-lg bg-emerald-900 border border-emerald-700 flex items-center justify-center flex-shrink-0 text-amber-400">
            <Music2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 truncate max-w-[200px] sm:max-w-[280px]">
                {getLocalized(currentTrack.title, language)}
              </span>
              <span className="text-[10px] uppercase bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                {currentTrack.category}
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80 truncate">
              {t.audio_speaker} {getLocalized(currentTrack.speaker, language)}
            </p>
          </div>
        </div>

        {/* Center Controls: Play/Pause, Progress Bar, Skip */}
        <div className="flex flex-col items-center gap-1 w-full max-w-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => skipSeconds(-10)}
              className="p-1.5 text-emerald-300 hover:text-white transition-colors"
              title="10s Back"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="audio-play-pause-toggle"
              onClick={togglePlayAudio}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            >
              {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => skipSeconds(10)}
              className="p-1.5 text-emerald-300 hover:text-white transition-colors"
              title="10s Forward"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Seekbar and timestamp */}
          <div className="flex items-center gap-2 w-full text-[11px] text-emerald-300 font-mono">
            <span>{formatSeconds(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span>{duration ? formatSeconds(duration) : currentTrack.duration}</span>
          </div>
        </div>

        {/* Right side controls: Volume, Speed, Download, View Audio Page, Close */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Speed */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-0.5 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-mono font-semibold border border-emerald-700"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-emerald-300 hover:text-white"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={e => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Download Audio */}
          <a
            href={currentTrack.audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-1.5 text-emerald-300 hover:text-amber-400 transition-colors"
            title="Download Audio"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Jump to Audio view */}
          <button
            onClick={() => setActiveTab('audio')}
            className="p-1.5 text-emerald-300 hover:text-white"
            title="Open Audio Hub"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={stopAudio}
            className="p-1.5 text-emerald-400 hover:text-red-400 transition-colors rounded-full hover:bg-emerald-900"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
