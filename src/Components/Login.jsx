import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import React from 'react'

const Login = () => {
      const { login } = useKindeAuth()
    
  return (
    <div className='flex items-center min-w-full min-h-full'>
    <button className='btn' onClick={()=>{login()}}>Login</button>
    </div>
  )
}

export default Login