import { Radio, Heart, Users, Trophy, Globe, Headphones } from 'lucide-react'

const AboutPage = () => {
  const stats = [
    { label: 'リスナー数', value: '50,000+', icon: Headphones },
    { label: '放送時間', value: '24/7', icon: Globe },
    { label: '番組数', value: '30+', icon: Radio },
    { label: '満足度', value: '98%', icon: Trophy },
  ]

  const team = [
    {
      name: '山田太郎',
      role: 'チーフプロデューサー',
      description: 'ラジオ業界20年のベテラン。音楽への情熱は誰にも負けません。',
    },
    {
      name: '佐藤花子',
      role: 'プログラムディレクター',
      description: '革新的な番組企画で、常に新しい風を吹き込んでいます。',
    },
    {
      name: '鈴木一郎',
      role: 'テクニカルディレクター',
      description: '最高品質の音声配信を実現する技術のスペシャリスト。',
    },
    {
      name: '田中美咲',
      role: 'コミュニティマネージャー',
      description: 'リスナーとの架け橋として、温かいコミュニティを築いています。',
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Tomonikanaderu Radioについて
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          私たちは、音楽を通じて人々の心を豊かにし、
          日常に彩りを添えることを使命としています。
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">私たちのミッション</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">情熱</h3>
              <p className="opacity-90">
                音楽への深い愛と情熱を持って、最高のコンテンツをお届けします
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">コミュニティ</h3>
              <p className="opacity-90">
                リスナー同士が繋がり、音楽を通じて交流できる場を提供します
              </p>
            </div>
            <div className="text-center">
              <Radio className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">革新</h3>
              <p className="opacity-90">
                最新技術を活用し、常に進化し続けるラジオ体験を創造します
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          数字で見るTomonikanaderu Radio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg"
            >
              <stat.icon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          私たちのチーム
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {member.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-500 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          お問い合わせ
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          番組へのリクエストやご意見・ご感想など、お気軽にお問い合わせください。
          皆様の声が、より良い番組作りの原動力になります。
        </p>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Email:</strong> contact@tomonikanaderu-radio.com
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>電話:</strong> 03-1234-5678
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>営業時間:</strong> 平日 9:00 - 18:00
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage