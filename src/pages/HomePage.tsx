import { Play, Users, Clock, Music } from 'lucide-react'
import { useRadio } from '../contexts/RadioContext'
import StationCard from '../components/StationCard'

const HomePage = () => {
  const { stations, currentStation, setCurrentStation, isPlaying } = useRadio()

  const features = [
    {
      icon: Music,
      title: '高品質ストリーミング',
      description: 'クリアで高品質な音声でお気に入りの番組を楽しめます'
    },
    {
      icon: Clock,
      title: '24時間放送',
      description: 'いつでもどこでも、24時間365日放送中'
    },
    {
      icon: Users,
      title: 'コミュニティ',
      description: 'リスナー同士で交流できるコミュニティ機能'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Tomonikanaderu Radio
        </h1>
        <p className="text-xl mb-8 opacity-90">
          音楽があなたの日常に寄り添う
        </p>
        {currentStation && (
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="flex items-center space-x-3">
              {isPlaying && (
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-white animate-pulse"></div>
                  <div className="w-1 h-6 bg-white animate-pulse delay-75"></div>
                  <div className="w-1 h-3 bg-white animate-pulse delay-150"></div>
                </div>
              )}
              <span className="font-medium">
                {isPlaying ? '再生中:' : '選択中:'} {currentStation.name}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Stations Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          ラジオステーション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              isActive={currentStation?.id === station.id}
              onSelect={() => setCurrentStation(station)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          特徴
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage