import React from 'react'
import { styles } from '../styles'

const Hero = () => {
  return (
    <div className=' w-full mx-auto mt-[9rem]'>
      <div className={`${styles.paddingX} inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5 h-fit`}>
        <div className='flex flex-col justify-center items-center mt-5'>
            <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
            <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>
        <div className='bg-[#0303031a] w-full rounded-xl sm:h-80 h-40 grid grid-cols-6 gap-2'>
          <div className='bg-white h-[3rem] mt-20 mx-5 rounded-lg col-start-1 col-end-5 '>
            <input type="text" placeholder="Which Job post are you looking for ?" className="w-full h-full px-4 py-2 rounded-lg outline-none" />
          </div>
          <div className='bg-white h-[3rem] mt-20 mx-5 rounded-lg col-end-7 col-span-2 '>
            <input type="text" placeholder="Location" className="w-full h-full px-4 py-2 rounded-lg outline-none" />
          </div>
          <div className='bg-white h-[3rem] mb-10 mx-5 rounded-lg col-start-1 col-end-4 '>
            <input type="text" placeholder="Email Address" className="w-full h-full px-4 py-2 rounded-lg outline-none" />
          </div>
          <div className='bg-white h-[3rem] mb-10 mx-5 rounded-lg col-start-4 col-span-2 '>
            <input type="text" placeholder="Phone Number" className="w-full h-full px-4 py-2 rounded-lg outline-none" />
          </div>
          <div className='bg-white h-[3rem] mb-10 mx-5 rounded-lg col-start-6 '>
            <button className="bg-white outline-purple-600 text-[#915EFF] hover:bg-purple-600 hover:outline-none w-full h-full px-4 py-2 rounded-lg outline-none hover:text-white font-bold text-[18px]">Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero