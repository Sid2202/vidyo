import React, { useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const VideoInformation = ({ currentProgress, totalDuration, wavesurferRef }) => {
  useEffect(() => {
    // Ensure the container element is available before initializing WaveSurfer
    const containerId = 'wavesurfer-container';
    const containerElement = document.getElementById(containerId);

    if (containerElement) {
      wavesurferRef.current = WaveSurfer.create({
        container: `#${containerId}`, // Use the unique ID for the container
        waveColor: 'black',
        progressColor: 'purple',
        barWidth: 2,
        cursorWidth: 1,
      });

      // Load your audio here if needed: wavesurferRef.current.load('your-audio-file.mp3');
    }
  }, [wavesurferRef]);

  return (
    <div>
      <div className='m-2'>{`${currentProgress.toFixed(2)} / ${totalDuration.toFixed(2)}s`}</div>
      <div id='wavesurfer-container' />
    </div>
  );
};

export default VideoInformation;
