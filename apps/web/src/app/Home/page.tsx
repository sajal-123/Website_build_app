import AppBar from '@/components/AppBar'
import Prompt from '@/components/Prompts'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      <Prompt />
    </div>
  )
}

export default page