import React from "react";
import { X as CloseIcon, Pause, Play, Maximize2, Minimize2, Volume2, VolumeX, SkipForward, SkipBack, PictureInPicture2, Download } from "lucide-react";
import "./Player.scss";

interface PlayerProps {
  open: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
  author: string;
}

const Player: React.FC<PlayerProps> = ({ open, onClose, videoSrc, title, author }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const previewVideoRef = React.useRef<HTMLVideoElement>(null);
  const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [showMeta, setShowMeta] = React.useState(true);
  const [volume, setVolume] = React.useState(1);
  const metaTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [previewTime, setPreviewTime] = React.useState<number | null>(null);
  const [previewPos, setPreviewPos] = React.useState<number | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  React.useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  }, [open]);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      videoRef.current.volume = volume;
    }
  }, [muted, volume]);

  React.useEffect(() => {
    const handleFs = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  const showMetaBar = () => {
    setShowMeta(true);
    if (metaTimeout.current) clearTimeout(metaTimeout.current);
    metaTimeout.current = setTimeout(() => setShowMeta(false), 2500);
  };

  React.useEffect(() => {
    if (!open) return;
    setShowMeta(true);
    if (metaTimeout.current) clearTimeout(metaTimeout.current);
    metaTimeout.current = setTimeout(() => setShowMeta(false), 2500);
    return () => { if (metaTimeout.current) clearTimeout(metaTimeout.current); };
  }, [open]);

  const videoWrapperProps = {
    onMouseMove: showMetaBar,
    onTouchStart: showMetaBar,
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrent(videoRef.current.currentTime);
    setProgress((videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * (videoRef.current.duration || 1);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (!fullscreen) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleMute = () => {
    setMuted((m) => !m);
  };

  const handleSkip = (amount: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + amount, duration));
  };

  const handlePiP = () => {
    if (videoRef.current && (videoRef.current as any).requestPictureInPicture) {
      (videoRef.current as any).requestPictureInPicture();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = title.replace(/\s+/g, '_') + '.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleProgressBarMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !previewVideoRef.current || !previewCanvasRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * (videoRef.current.duration || 1);
    setPreviewTime(time);
    setPreviewPos(e.clientX - rect.left);
    setShowPreview(true);
    previewVideoRef.current.currentTime = time;
  };

  const handleProgressBarLeave = () => {
    setShowPreview(false);
  };

  React.useEffect(() => {
    if (!showPreview || !previewVideoRef.current || !previewCanvasRef.current || previewTime == null) return;
    const video = previewVideoRef.current;
    const canvas = previewCanvasRef.current;
    const draw = () => {
      if (video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
    };
    video.addEventListener('seeked', draw, { once: true });
    return () => video.removeEventListener('seeked', draw);
  }, [showPreview, previewTime]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      switch (e.key) {
        case 'f':
          handleFullscreen();
          break;
        case ' ':
        case 'k':
          handlePlayPause();
          e.preventDefault();
          break;
        case 'ArrowRight':
          handleSkip(5);
          break;
        case 'ArrowLeft':
          handleSkip(-5);
          break;
        case 'm':
          handleMute();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, playing, fullscreen, muted, volume, duration]);

  if (!open) return null;
  return (
    <div className={`oxm-player-overlay${fullscreen ? ' oxm-player-fullscreen' : ''}`} onClick={onClose}>
      <div className="oxm-player-modal" onClick={e => e.stopPropagation()}>
        <button className="oxm-player-close" onClick={onClose} aria-label="Close player">
          <CloseIcon size={36} />
        </button>
        <div className="oxm-player-video-wrapper" {...videoWrapperProps}>
          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            autoPlay
            playsInline
            onClick={handlePlayPause}
            className="oxm-player-video"
            style={{ borderRadius: fullscreen ? 0 : '32px 32px 0 0' }}
          />
          {showMeta && (
            <div className="oxm-player-meta-float">
              <h2>{title}</h2>
              <p>{author}</p>
            </div>
          )}
        </div>
        <div className="oxm-player-controls">
          <button className="oxm-player-btn" onClick={() => handleSkip(-10)} aria-label="Rewind 10s"><SkipBack size={28} /></button>
          <button className="oxm-player-btn" onClick={handlePlayPause} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button className="oxm-player-btn" onClick={() => handleSkip(10)} aria-label="Forward 10s"><SkipForward size={28} /></button>
          <button className="oxm-player-btn" onClick={handleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={e => {
              setVolume(Number(e.target.value));
              if (Number(e.target.value) === 0) setMuted(true);
              else setMuted(false);
            }}
            className="oxm-player-volume-slider"
            aria-label="Volume"
            style={{ width: 80, margin: '0 12px', verticalAlign: 'middle',
              '--oxm-vol': `${((muted ? 0 : volume) * 100).toFixed(0)}%` } as React.CSSProperties}
          />
          <div
            className="oxm-player-progress-hitbox"
            style={{ height: 32, position: 'relative', width: '100%' }}
            onClick={handleProgressBarClick}
            onMouseMove={handleProgressBarMove}
            onMouseLeave={handleProgressBarLeave}
          >
            <div className="oxm-player-progress-bar" style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
              <div className="oxm-player-progress" style={{ width: `${progress}%` }} />
              {previewPos != null && (
                <div
                  className="oxm-player-frame-preview"
                  style={{ left: `calc(${(previewPos / (videoRef.current?.parentElement?.offsetWidth || 1)) * 100}% - 60px)` }}
                >
                  <canvas ref={previewCanvasRef} width={120} height={68} style={{ borderRadius: 8, background: '#222' }} />
                  <div className="oxm-player-frame-time">{formatTime(previewTime || 0)}</div>
                </div>
              )}
            </div>
          </div>
          <span className="oxm-player-time" style={{ marginRight: 50 }}>{formatTime(current)} / {formatTime(duration)}</span>
          <div className="oxm-player-actions" style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            <button className="oxm-player-btn" onClick={handlePiP} aria-label="Picture in Picture"><PictureInPicture2 size={26} /></button>
            <button className="oxm-player-btn" onClick={handleDownload} aria-label="Download"><Download size={26} /></button>
            <button className="oxm-player-btn" onClick={handleFullscreen} aria-label="Fullscreen">
              {fullscreen ? <Minimize2 size={26} /> : <Maximize2 size={26} />}
            </button>
          </div>
        </div>
        <video
          ref={previewVideoRef}
          src={videoSrc}
          style={{ display: 'none' }}
          muted
          preload="auto"
        />
      </div>
    </div>
  );
};

export default Player; 