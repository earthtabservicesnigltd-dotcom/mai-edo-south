import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { PropsWithChildren } from 'react'

const Layout = ({children}: PropsWithChildren) => {
  return (
    <>  
        <Navbar/>
        <main className="overflow-hidden">{children}</main>
        <Footer/>
    </>
  )
}

export default Layout
