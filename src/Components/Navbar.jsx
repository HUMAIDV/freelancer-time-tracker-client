import React from 'react'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const { logout } = useKindeAuth();

  return (
    <div id='navContainer' className='md:fixed md:top-0 md:w-full z-10'>
        <nav className='flex justify-between items-center bg-white p-4 m-2 rounded-xl shadow-xl md:ml-78 md:m-0 md:rounded-none'>
            <div id="logo" className='ml-3 text-2xl font-bold'>
            <Link to={'/'}>
                <p>Dashboard</p>
            </Link>
            </div>
            <div id="navBtn">
                <button className='btn btn-secondary' onClick={() => logout()} type="button">Sign out</button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar