"use client"

import React from 'react'
import { Button } from "../components/ui/button"
import { LogIn } from 'lucide-react'
import AuthButton from './AuthButton'


const Navbar = ({user}) => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-4 flex justify-between items-center'>
        <div className = "flex items-center gap-3">

            <h3  className = " font-semibold text-2xl text-[#121212]">
              Drop<span className = "text-orange-500">.ly</span>
            </h3>
        </div>

        <div>
            <AuthButton  user ={user} />
        </div>
    </div>
  )
}

export default Navbar