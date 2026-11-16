import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({loggedUser}) => {
  return (
    <div className='hidden md:flex flex-col fixed top-0 bottom-0 bg-white min-w-80 max-w-80 shadow-2xl z-20'>
        <div id="user" className='p-5 py-10 flex flex-col justify-center items-center border-b-2 border-gray-200 gap-2 overflow-x-hidden'>
            <img className='rounded-full mb-2 max-w-15' src={loggedUser?.picture} alt={'profile'} referrerPolicy="no-referrer"/>
            <p className='font-bold'>{loggedUser?.firstName || "Username"}</p>
            <p className='bg-gray-200 p-2 rounded-md'>{loggedUser?.email || "Email"}</p>
        </div>
        <div className='flex flex-col p-2 gap-'>

                <Link to={'/create-project'} className='hover:bg-gray-200 p-3 rounded-xl'>
                    <button>Add Project</button>
                </Link>
                <Link to={'/create-time-entry'} className='hover:bg-gray-200 p-3 rounded-xl'>
                    <button>Log Time-entry</button>
                </Link>
                <Link to={'/projects'} className='hover:bg-gray-200 p-3 rounded-xl'>

                    <button>All Projects</button>
                </Link>
                <Link to={'/time-entries'} className='hover:bg-gray-200 p-3 rounded-xl'>
                    <button>All Time-entries</button>
                </Link>
            </div>
    </div>
  )
}

export default Sidebar