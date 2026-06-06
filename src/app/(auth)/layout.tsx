import React, { PropsWithChildren } from 'react'

const Layout = ({children}: PropsWithChildren) => {
  return (
    <div className='min-h-screen bg-[#01381d] flex items-center justify-center'>
      {children}
    </div>
  )
}

export default Layout
