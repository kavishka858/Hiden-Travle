import React, { useEffect, useState } from 'react';
import { MapIcon } from 'lucide-react';

const TrailImage = ({ src, alt, trailId, className = '' }) => {
  const fallback = trailId ? `/trails/${trailId}.jpg` : '/placeholder-trail.jpg';
  const [currentSrc, setCurrentSrc] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallback);
    setFailed(false);
  }, [src, fallback]);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-midnight-800 ${className}`}>
        <MapIcon className="text-emerald-500/40" size={48} />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

export default TrailImage;
