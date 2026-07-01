"use client"

import React from 'react'
import { Button } from "../components/ui/button"
import { LogIn, TrendingDown } from 'lucide-react'
import AuthButton from './AuthButton'


const Navbar = ({user}) => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
        <div className="flex items-center gap-2 cursor-pointer">
          {/* <TrendingDown className="w-6 h-6 text-emerald-600" /> */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Drop<span className="text-orange-500">.ly</span>
          </h1>
          {/* <TrendingDown className="w-8 h-6 text-orange-500 font-bold" /> */}
        </div>

        <div>
            <AuthButton  user ={user} />
        </div>
    </div>
  )
}

export default Navbar