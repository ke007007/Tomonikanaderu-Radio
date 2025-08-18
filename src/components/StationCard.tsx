import { Play, Radio } from 'lucide-react'

interface Station {
  id: string
  name: string
  description: string
  genre: string
  imageUrl?: string
}

interface StationCardProps {
  station: Station
  isActive: boolean
  onSelect: () => void
}

const StationCard = ({ station, isActive, onSelect }: StationCardProps) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
        isActive ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-t-xl overflow-hidden">
        {station.imageUrl ? (
          <img
            src={station.imageUrl}
            alt={station.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Radio className="h-20 w-20 text-white/50" />
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-full p-4">
              <Play className="h-8 w-8 text-primary-500 ml-1" />
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {station.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          {station.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
            {station.genre}
          </span>
          {isActive && (
            <span className="text-sm font-medium text-green-500">
              再生中
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default StationCard