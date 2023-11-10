import React from 'react';

const Metadata = ({ metadata }) => {
  const renderStreamDetails = () => {
    if (!metadata || !metadata.streams) {
      return <p className="text-gray-500">Upload video to view metadata</p>;
    }

    const { duration, streams } = metadata;

    return (
      <>
        <p className="text-lg font-semibold mb-2">Video Details:</p>
        <p>
          <span className="font-semibold">Duration:</span> {duration} seconds
        </p>
        <p>
          <span className="font-semibold">Number of Streams:</span> {streams.length}
        </p>
        {streams.map((stream, index) => (
          <div key={index} className="border-t mt-4 pt-4">
            <p className="text-lg font-semibold mb-2">Stream {index + 1}:</p>
            <p>
              <span className="font-semibold">Codec:</span> {stream.codec_name}
            </p>
            <p>
              <span className="font-semibold">Codec_long_name:</span> {stream.codec_long_name}
            </p>
            <p>
              <span className="font-semibold">Codec_long_name:</span> {stream.codec_type}
            </p>
            <p>
              <span className="font-semibold">Resolution:</span> {stream.width}x{stream.height}
            </p>
            {/* Add more details here if needed */}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="rounded-md p-4 border h-96 overflow-auto bg-gray-100">
      <p className="text-xl font-semibold mb-4">Metadata:</p>
      {renderStreamDetails()}
    </div>
  );
};

export default Metadata;
