import React from "react";
import { X as CloseIcon, Pause, Play, Maximize2, Minimize2, Volume2, VolumeX, SkipForward, SkipBack, PictureInPicture2, Download } from "lucide-react";
import "./OXMPlayer.scss";

interface OXMPlayerProps {
  open: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
  author: string;
}

const OXMPlayer: React.FC<OXMPlayerProps> = ({ open, onClose, videoSrc, title, author }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [showMeta, setShowMeta] = React.useState(true);
  const metaTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  }, [open]);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  React.useEffect(() => {
    const handleFs = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  // Show meta on mouse move/tap, hide after 2.5s
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
          <div className="oxm-player-progress-bar" onClick={handleProgressBarClick}>
            <div className="oxm-player-progress" style={{ width: `${progress}%` }} />
          </div>
          <span className="oxm-player-time">{formatTime(current)} / {formatTime(duration)}</span>
          <button className="oxm-player-btn" onClick={handlePiP} aria-label="Picture in Picture"><PictureInPicture2 size={26} /></button>
          <button className="oxm-player-btn" onClick={handleDownload} aria-label="Download"><Download size={26} /></button>
          <button className="oxm-player-btn" onClick={handleFullscreen} aria-label="Fullscreen">
            {fullscreen ? <Minimize2 size={26} /> : <Maximize2 size={26} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OXMPlayer; 