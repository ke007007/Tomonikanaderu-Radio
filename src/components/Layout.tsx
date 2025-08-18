import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import RadioPlayer from './RadioPlayer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <RadioPlayer />
      <Footer />
    </div>
  )
}

export default Layout