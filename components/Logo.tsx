import { cn } from '@/lib/utils';
import { SquareDashedMousePointer } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Logo = ({fontSize = "text-2xl", iconSize = 20} : {fontSize?:string ; iconSize?:number}) => {
  return (
    <Link href="" className={cn("text-2xl flex items-center gap-2", fontSize)}
        
    >
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 ">
            <SquareDashedMousePointer size={iconSize} className='stroke-white'/> 
        </div>
        <div className="">
            <span className='bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
                Web
            </span>
            <span className='font-bold'>Weaver</span>
        </div>
    </Link>
  )
}

export default Logo