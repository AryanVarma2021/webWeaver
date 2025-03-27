import React from 'react'

type Props = {}

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='flex flex-col w-full h-screen  '>{children}</div>

    
  )
}

export default layout