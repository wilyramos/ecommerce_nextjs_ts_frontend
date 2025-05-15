import Logo from '@/components/ui/Logo'
import ToastNotification from '@/components/ui/ToastNotification'
import Link from 'next/link'
import React from 'react'

export default function layoutAuth({ children }: { children: React.ReactNode }) {
  return (
    <>


      <div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-md p-4 flex-1'>

          {children}
        </div>
      </div>
      <ToastNotification />
    </>
  )
}
