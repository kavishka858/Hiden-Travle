import React, { useEffect, useRef } from 'react';

const VideoBackground = ({
  src = '/hero-background.mp4',
  overlayOpacity = 0.35,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, [src]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/50 via-transparent to-[#020617]/90" />
    </div>
  );
};

export default VideoBackground;
