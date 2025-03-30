'use client'
import React from 'react'
import { Activity, Settings } from 'lucide-react'
import { signIn,signOut,useSession } from 'next-auth/react'

function header() {
   const {data:session} = useSession()
  return (
<header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">UptimeTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-6 w-6" />
              </button>
               <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700" 
               onClick={() => session?signOut():signIn()}>
                  {session?"Sign Out":"Sign In"}
               </button>
            </div>
          </div>
        </div>
      </header>
  )
}

export default header
