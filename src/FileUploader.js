import React from 'react';

const FileUploader = ({ handleFileUpload }) => {
  const handleChange = (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  return (
    <div className='rounded-md border h-full w-full flex flex-col justify-center items-center overflow-auto'>
      <span className='text-2xl'>Choose a file of .mp4 or .mov type</span>
      <input
        className='mt-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
        type="file"
        accept=".mov, .mp4"
        onChange={handleChange}
      />
    </div>
  );
};

export default FileUploader;
