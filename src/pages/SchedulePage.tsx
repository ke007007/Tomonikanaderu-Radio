import { Calendar, Clock, User } from 'lucide-react'
import { format, addDays, startOfWeek } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Program {
  id: string
  title: string
  host: string
  startTime: string
  endTime: string
  description: string
  day: number // 0 = Sunday, 1 = Monday, etc.
}

const SchedulePage = () => {
  // サンプル番組データ
  const programs: Program[] = [
    {
      id: '1',
      title: 'モーニングコーヒー',
      host: '山田太郎',
      startTime: '06:00',
      endTime: '09:00',
      description: '朝の目覚めに最適な音楽と情報をお届け',
      day: 1
    },
    {
      id: '2',
      title: 'ランチタイムミュージック',
      host: '佐藤花子',
      startTime: '12:00',
      endTime: '13:00',
      description: 'お昼休みにぴったりのリラックスミュージック',
      day: 1
    },
    {
      id: '3',
      title: 'アフタヌーンジャズ',
      host: '鈴木一郎',
      startTime: '15:00',
      endTime: '17:00',
      description: '午後のひとときをジャズでお楽しみください',
      day: 1
    },
    {
      id: '4',
      title: 'イブニングトーク',
      host: '田中美咲',
      startTime: '19:00',
      endTime: '21:00',
      description: 'リスナーの皆様からのお便りを紹介',
      day: 1
    },
    {
      id: '5',
      title: 'ミッドナイトクラシック',
      host: '高橋健二',
      startTime: '23:00',
      endTime: '01:00',
      description: '夜更けに聴くクラシック音楽',
      day: 1
    }
  ]

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  const currentDate = new Date()
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })

  // 各曜日の番組を取得（簡略化のため月曜日の番組を全曜日に表示）
  const getProgramsForDay = (dayIndex: number) => {
    return programs.map(program => ({
      ...program,
      day: dayIndex
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          番組スケジュール
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          今週の番組表をチェックして、お気に入りの番組を見つけよう
        </p>
      </div>

      {/* Current Week Display */}
      <div className="bg-primary-500 text-white rounded-xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Calendar className="h-6 w-6" />
          <span className="text-xl font-semibold">
            {format(weekStart, 'yyyy年MM月dd日', { locale: ja })} - {format(addDays(weekStart, 6), 'MM月dd日', { locale: ja })}
          </span>
        </div>
        <p className="opacity-90">今週の番組スケジュール</p>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayPrograms = getProgramsForDay(index)
          const isToday = index === ((currentDate.getDay() + 6) % 7)
          
          return (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 ${
                isToday ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className={`text-center mb-4 pb-2 border-b ${
                isToday ? 'border-primary-500' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className={`font-bold text-lg ${
                  isToday ? 'text-primary-500' : 'text-gray-900 dark:text-white'
                }`}>
                  {day}曜日
                </div>
                {isToday && (
                  <span className="text-xs text-primary-500 font-medium">今日</span>
                )}
              </div>
              
              <div className="space-y-2">
                {dayPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>{program.startTime} - {program.endTime}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {program.title}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                      <User className="h-3 w-3" />
                      <span>{program.host}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Program Details */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          本日の注目番組
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.slice(0, 4).map((program) => (
            <div
              key={program.id}
              className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {program.title}
                </h3>
                <span className="text-sm text-primary-500 font-medium">
                  {program.startTime} - {program.endTime}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {program.description}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>パーソナリティ: {program.host}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SchedulePage