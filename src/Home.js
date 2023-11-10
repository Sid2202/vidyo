import {useState} from 'react'
import Video from './Video'
import Metadata from './Metadata'


function Home(){

    const [videoState, setVideoState] = useState({
        videoUrl: null,
        metadata: null,
    })

    const handleMetadata = (newmetadata) =>{
        setVideoState({
            ...videoState,
            metadata: newmetadata
        })
    }

    const handleUrlChange = (newurl) =>{
        setVideoState({
            ...videoState,
            videoUrl: newurl
        })
    }
    return(
        <div className='w-screen flex flex-col items-center'>

            <div className='mt-8 flex flex-col items-center min-w-8'>
                <p className='mb-4 text-2xl font-bold  text-gray-900 md:text-5xl lg:text-6xl'>MetaVideo🌟</p>

                <p className='mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 '>Upload videos and get their metadata!</p>
            </div>

            <div className="px-10 w-full flex">
                <div className='basis-3/4 shrink p-4 min-w-12 '>
                    <Video 
                        onMeta={handleMetadata}
                        onUrlChange={handleUrlChange}
                    />
                </div>
                <div className='basis-1/4 shrink p-4 min-w-2'>
                    <Metadata
                        metadata={videoState.metadata} 
                    />
                </div>
            </div>
            
        </div>
    )
}
export default Home