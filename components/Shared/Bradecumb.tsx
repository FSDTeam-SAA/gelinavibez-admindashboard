import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Props {
  pageName: string;
  subPageName?: string
}
const Bradecumb = ({pageName,subPageName}: Props) => {
  return (
    <div>
        {/* Header */}
          <div className="mb-8">
           
            <div className='flex items-center gap-2 mt-4'>
            <Link href="/" className='flex items-center gap-2 '>
              <p className="text-base text-[#9F9F9F]  cursor-pointer hover:underline">Dashboard</p>
            </Link>
              <span><ChevronRight className='w-4 h-4 text-[#9F9F9F]' /></span>
              <p className='text-base text-[#9F9F9F] '>{pageName}</p>
              {
                subPageName && (
                  <>
                   <span><ChevronRight className='w-4 h-4 text-[#9F9F9F]' /></span>
                    <p className='text-base text-[#9F9F9F] '>{subPageName}</p>
                  </>
                )
              }
            </div>

          </div>
    </div>
  )
}

export default Bradecumb
