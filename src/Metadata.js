const Metadata =({metadata}) =>{
    // const truncatedMetadata = metadata && JSON.stringify(metadata, null, 2).slice(0, 1000);
    return(
        <div className="rounded-md p-4 border h-96 overflow-auto">
            <p className="text-xl font-semibold">
                Metadata: 
            </p>
            {metadata &&
                <p>
                    {JSON.stringify(metadata, null, 2)}
                </p>
            }
            {!metadata &&
                <p>
                    Upload video to view metadata
                </p>
            }
        </div>
    )
}
export default Metadata