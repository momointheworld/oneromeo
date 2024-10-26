// components/EmbedVideo.tsx
import React from 'react'

interface EmbedVideoProps {
    videoId: string
}

const EmbedVideo: React.FC<EmbedVideoProps> = ({ videoId }) => {
    return (
        <div className="embed-container">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded YouTube Video"
                width={640}
                height={360}
            />
        </div>
    )
}

export default EmbedVideo
