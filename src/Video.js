import {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import WaveSurfer from 'wavesurfer.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import play from './images/play.svg';
import pause from './images/pause.svg';


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
            cancelAnimationFrame(animationFrameIdRef.current);
          } else {
            video.play();
            drawVideoFrame(video, canvasRef.current.getContext('2d'));
          }
        setIsPlaying(!isPlaying)

        setShowControls(true)
        setTimeout(() => {
            setShowControls(false)
        }, 700)
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
    
        //   const hasAudio = video.audioTracks && video.audioTracks.length > 0;

            // if (hasAudio) {
            // console.log('The video has audio.');
            // } else {
            // console.log('The video does not have audio.');
            // }
            
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
                                {isPlaying ? (<img src = {pause} alt="pause" />) : (<img src = {play} alt="play" />)}
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