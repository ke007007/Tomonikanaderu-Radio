import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

interface RadioStation {
  id: string
  name: string
  description: string
  streamUrl: string
  imageUrl: string
  genre: string
}

interface RadioContextType {
  currentStation: RadioStation | null
  isPlaying: boolean
  volume: number
  setCurrentStation: (station: RadioStation) => void
  togglePlayPause: () => void
  setVolume: (volume: number) => void
  stations: RadioStation[]
}

const RadioContext = createContext<RadioContextType | undefined>(undefined)

// サンプルのラジオ局データ
const sampleStations: RadioStation[] = [
  {
    id: '1',
    name: 'Tomonikanaderu FM',
    description: '24時間最新の音楽をお届け',
    streamUrl: 'https://stream.zeno.fm/mq6hpqr2hc9uv', // サンプルストリーム
    imageUrl: '/station1.jpg',
    genre: 'Pop/Rock'
  },
  {
    id: '2',
    name: 'Jazz Lounge',
    description: 'リラックスできるジャズミュージック',
    streamUrl: 'https://stream.zeno.fm/q2p2z2r2hc9uv',
    imageUrl: '/station2.jpg',
    genre: 'Jazz'
  },
  {
    id: '3',
    name: 'Classical Harmony',
    description: 'クラシック音楽の世界',
    streamUrl: 'https://stream.zeno.fm/r3q3a3r2hc9uv',
    imageUrl: '/station3.jpg',
    genre: 'Classical'
  }
]

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleSetCurrentStation = (station: RadioStation) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = station.streamUrl
      setCurrentStation(station)
      setIsPlaying(false)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current && currentStation) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <RadioContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        setCurrentStation: handleSetCurrentStation,
        togglePlayPause,
        setVolume,
        stations: sampleStations
      }}
    >
      {children}
    </RadioContext.Provider>
  )
}

export const useRadio = () => {
  const context = useContext(RadioContext)
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider')
  }
  return context
}