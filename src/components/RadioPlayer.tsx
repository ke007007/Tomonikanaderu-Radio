import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react'
import { useRadio } from '../contexts/RadioContext'
import { useState, useEffect } from 'react'

const RadioPlayer = () => {
  const { currentStation, isPlaying, volume, togglePlayPause, setVolume, stations, setCurrentStation } = useRadio()
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const handleNextStation = () => {
    if (!currentStation) {
      setCurrentStation(stations[0])
      return
    }
    const currentIndex = stations.findIndex(s => s.id === currentStation.id)
    const nextIndex = (currentIndex + 1) % stations.length
    setCurrentStation(stations[nextIndex])
  }

  const handlePrevStation = () => {
    if (!currentStation) {
      setCurrentStation(stations[stations.length - 1])
      return
    }
    const currentIndex = stations.findIndex(s => s.id === currentStation.id)
    const prevIndex = currentIndex === 0 ? stations.length - 1 : currentIndex - 1
    setCurrentStation(stations[prevIndex])
  }

  if (!currentStation) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Station Info */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentStation.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentStation.genre}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={handlePrevStation}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Previous station"
            >
              <SkipBack className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-3 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextStation}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Next station"
            >
              <SkipForward className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Volume Control */}
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Volume"
              >
                <Volume2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    className="h-24 w-2"
                    style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Live Indicator */}
          {isPlaying && (
            <div className="hidden md:flex items-center space-x-2 ml-4">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-red-500 animate-pulse"></div>
                <div className="w-1 h-4 bg-red-500 animate-pulse delay-75"></div>
                <div className="w-1 h-2 bg-red-500 animate-pulse delay-150"></div>
                <div className="w-1 h-5 bg-red-500 animate-pulse delay-200"></div>
              </div>
              <span className="text-xs font-semibold text-red-500">LIVE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RadioPlayer