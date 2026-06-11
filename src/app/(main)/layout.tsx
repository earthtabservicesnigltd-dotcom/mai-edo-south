import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Preloader } from '@/components/layout/Preloader'
import { PropsWithChildren } from 'react'

const Layout = ({children}: PropsWithChildren) => {
  return (
    <>  
        <Preloader/>  
        <Navbar/>
        <main className="overflow-hidden">{children}</main>
        <Footer/>
    </>
  )
}

export default Layout
