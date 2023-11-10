import React from 'react';

const VideoPlayerControls = ({ canvasRef, handleCanvasClick, showControls, isPlaying, playIcon, pauseIcon }) => {
  return (
    <div className='relative flex items-center justify-center'>
      <canvas className='w-full rounded-md border' ref={canvasRef} onClick={handleCanvasClick}></canvas>
      {showControls && (
        <div className='absolute z-10'>
          {isPlaying ? <img src={pauseIcon} alt="pause" /> : <img src={playIcon} alt="play" />}
        </div>
      )}
    </div>
  );
};

export default VideoPlayerControls;
