import {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import WaveSurfer from 'wavesurfer.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Video = ({ onMeta, onUrlChange}) => {
    const [videoUrl, setVideoUrl] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showControls, setShowControls] = useState(false)
    const [totalDuration, setTotalDuration] = useState(0);
    const [currentProgress, setCurrentProgress] = useState(0);

    const canvasRef = useRef(null)
    const wavesurferRef = useRef(null)
    const animationFrameIdRef = useRef(null);

    const drawVideoFrame = (video, context) =>{
        context.drawImage(video, 0, 0);
        animationFrameIdRef.current = requestAnimationFrame(() =>
        drawVideoFrame(video, context)
      );
    }

    const handleFileUpload = async(event) =>{
        const file = event.target.files[0]

        //check if the file has audio element here

        const formData = new FormData();
        formData.append('video', file);

        try {
            // Send the file to the server
            const response = await axios.post('http://localhost:3001/check-audio', formData);

            // Check the server response
            if (response.data.hasAudio) {
                const url = URL.createObjectURL(file)
                setVideoUrl(url);
                onUrlChange(url)
                onMeta(response.data.metadata);
            } else {
                console.log('File does not have audio.');
                toast('🚨Upload a file which has audio!🚨', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    const handleCanvasClick = () =>{
        const video = canvasRef.current.video;
        if (isPlaying) {
            video.pause();
            // wavesurferRef.current.pause();
            cancelAnimationFrame(animationFrameIdRef.current);
          } else {
            video.play();
            // wavesurferRef.current.destroy();
            // wavesurferRef.current.play();
            drawVideoFrame(video, canvasRef.current.getContext('2d'));
          }
        setIsPlaying(!isPlaying)

        setShowControls(true)
        setTimeout(() => {
            setShowControls(false)
        }, 2000)
    }

    const handleProgress = () => {
        const video = canvasRef.current.video;
    setCurrentProgress(video.currentTime);
        wavesurferRef.current.seekTo(video.currentTime / video.duration);
      };
    
      const handleDuration = () => {
        const video = canvasRef.current.video;
    setTotalDuration(video.duration);
      };

    useEffect(() => {
        if (videoUrl) {
            onUrlChange(videoUrl)
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          const video = document.createElement('video');
          video.src = videoUrl;
          video.controls = true
    
          video.addEventListener('loadeddata', () => {
            video.play();
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            setIsPlaying(true);

            drawVideoFrame(video, context);
          });

            video.addEventListener('progress', handleProgress);
            video.addEventListener('timeupdate', handleProgress); 
            video.addEventListener('durationchange', handleDuration);


          canvasRef.current.video = video;

          wavesurferRef.current = WaveSurfer.create({
            container: wavesurferRef.current,
            waveColor: 'black',
            progressColor: 'purple',
            barWidth: 2,
            cursorWidth: 1,
        }); 
        wavesurferRef.current.load(videoUrl);

        }
    }, [videoUrl, setVideoUrl]);



    return(
        <div className='p-2 h-full flex items-center justify-center'>
            <div className='m-0 w-full h-full flex flex-col justify-center'>
                {!videoUrl && 
                    <div className=' rounded-md border h-full w-full flex flex-col justify-center items-center overflow-auto'>
                        <span className='text-2xl'>Choose a file of .mp4 or .mov type</span>
                        <input 
                            className=' mt-2 text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100'
                            type="file"
                            accept=".mov , .mp4" 
                            onChange={handleFileUpload}
                        />
                    </div>
                }
                {videoUrl &&
                        <div className='relative flex items-center justify-center'>
                        <canvas
                            className='w-full rounded-md border'
                            ref={canvasRef}
                            onClick={handleCanvasClick}
                        >
                        </canvas>
                        {showControls && 
                            <div className='absolute z-10'>
                                {isPlaying ? (<svg width="96px" height="96px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#a02c80"></path> <path d="M8.07612 8.61732C8 8.80109 8 9.03406 8 9.5V14.5C8 14.9659 8 15.1989 8.07612 15.3827C8.17761 15.6277 8.37229 15.8224 8.61732 15.9239C8.80109 16 9.03406 16 9.5 16C9.96594 16 10.1989 16 10.3827 15.9239C10.6277 15.8224 10.8224 15.6277 10.9239 15.3827C11 15.1989 11 14.9659 11 14.5V9.5C11 9.03406 11 8.80109 10.9239 8.61732C10.8224 8.37229 10.6277 8.17761 10.3827 8.07612C10.1989 8 9.96594 8 9.5 8C9.03406 8 8.80109 8 8.61732 8.07612C8.37229 8.17761 8.17761 8.37229 8.07612 8.61732Z" fill="#a02c80"></path> <path d="M13.0761 8.61732C13 8.80109 13 9.03406 13 9.5V14.5C13 14.9659 13 15.1989 13.0761 15.3827C13.1776 15.6277 13.3723 15.8224 13.6173 15.9239C13.8011 16 14.0341 16 14.5 16C14.9659 16 15.1989 16 15.3827 15.9239C15.6277 15.8224 15.8224 15.6277 15.9239 15.3827C16 15.1989 16 14.9659 16 14.5V9.5C16 9.03406 16 8.80109 15.9239 8.61732C15.8224 8.37229 15.6277 8.17761 15.3827 8.07612C15.1989 8 14.9659 8 14.5 8C14.0341 8 13.8011 8 13.6173 8.07612C13.3723 8.17761 13.1776 8.37229 13.0761 8.61732Z" fill="#a02c80"></path> </g></svg>) : (<svg width="96px" height="96px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#a02c80"></path> <path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="#a02c80"></path> </g></svg>)}
                            </div>
                        }
                        </div>
                        
                }
                {videoUrl &&
                    <div>
                        <div className='m-2'>
                        {`${currentProgress.toFixed(2)} / ${totalDuration.toFixed(2)}s`}
                        </div>

                        <div ref={wavesurferRef} />
                    </div>
                }
            </div>
        </div>
    )
}
export default Video