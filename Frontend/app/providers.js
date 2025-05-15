// app/providers.tsx
'use client'
import { HeroUIProvider } from '@heroui/system';
import { Toaster } from 'react-hot-toast';

export function Providers({children}) {
  return (
    <HeroUIProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </HeroUIProvider>
  )
}