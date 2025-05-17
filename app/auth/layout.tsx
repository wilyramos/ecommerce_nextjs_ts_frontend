import NavBar from '@/components/navigation/NavBar'
import ToastNotification from '@/components/ui/ToastNotification'
import React from 'react'

export default function layoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <>

      <NavBar />

      <div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-md py-20 flex-1'>

          {children}
        </div>
      </div>
      <ToastNotification />
    </>
  )
}
