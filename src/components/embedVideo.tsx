'use client'
import React, { useEffect, useState } from 'react'

interface EmbedVideoProps {
    videoId: string
    bvid: string
}

const EmbedVideo: React.FC<EmbedVideoProps> = ({ videoId, bvid }) => {
    const [isBlockedInChina, setIsBlockedInChina] = useState(false)

    useEffect(() => {
        const checkLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/')
                const data = await response.json()
                if (data.country === 'CN') {
                    setIsBlockedInChina(true)
                }
            } catch (error) {
                console.error('Error detecting location:', error)
            }
        }
        checkLocation()
    }, [])

    const videoUrl = isBlockedInChina
        ? `https://player.bilibili.com/player.html?bvid=${bvid}&page=1`
        : `https://www.youtube.com/embed/${videoId}`

    return (
        <div className="embed-container">
            <iframe
                src={videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded Video"
                width={640}
                height={360}
            />
        </div>
    )
}

export default EmbedVideo
