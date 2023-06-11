import React from 'react'
import ReactPlayer from 'react-player'
import playerCss from './Videoplayer.module.css'

function VideoPlayer() {
  return (
    <div>
        <h1>Video player</h1>
        <ReactPlayer className={playerCss.reactPlayer} url={'https://dl.loco.gg/v/TeNmssF'} controls></ReactPlayer>

    </div>
  )
}

export default VideoPlayer