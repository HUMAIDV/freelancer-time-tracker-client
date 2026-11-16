import React from 'react'
import CreateProject from './Components/CreateProject'
import CreateTimeEntry from './Components/CreateTimeEntry'
import Projects from './Components/Projects'
import TimeEntries from './Components/TimeEntries'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Login from './Components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const { user } = useKindeAuth()

  const [loggedUser, setLoggedUser] = useState({})
  const [projectData, setProjectData] = useState([])
  const [summaryData, setSummaryData] = useState([])

  const [count, setCount] = useState(0)

  const createUser = async () => {
    if (!user) return;
    const { data } = await axios.post('http://localhost:5000/api/users', {
      id: user.id,
      email: user.email,
      given_name: user.givenName,
      family_name: user.familyName,
      picture: user.picture
    });
    setLoggedUser(data.user)
  }

  const fetchProjects = async () => {
    if (!loggedUser._id) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${loggedUser._id}/user`)
      setProjectData(data.Projects)

    } catch (error) {
      console.log("Error fetching projects : ", error)
    }
  }

  const getUser = async () => {
    if (!user.id) return;
    try {
      const { data, status } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user?.id}`, { validateStatus: (status) => status === 200 || status === 404 })

      if (status === 200) {
        setLoggedUser(data)
      } else if (status === 404) {
        await createUser();
      }

    } catch (error) {
      console.log("Error fetching users : ", error.message)
    }
  }


  useEffect(() => {
    if (user?.id) {
      getUser()
    }
  }, [user?.id])

  useEffect(() => {
    if (loggedUser?._id) {
      fetchProjects()
    }
  }, [loggedUser?._id])

  return (
    <div>
      {user ? (
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={2000} />
          <Navbar />
          <Sidebar loggedUser={loggedUser} />
          <div className='md:mt-25'>
            <Routes>

              <Route path='/' element={<Dashboard loggedUser={loggedUser} summaryData={summaryData} projectData={projectData} />} />
              <Route path='/create-project' element={<CreateProject fetchProjects={fetchProjects} loggedUser={loggedUser} />} />
              <Route path='/create-time-entry' element={<CreateTimeEntry projectData={projectData} loggedUser={loggedUser} />} />
              <Route path='/projects' element={<Projects fetchProjects={fetchProjects} projectData={projectData} setProjectData={setProjectData} />} />
              <Route path='/time-entries' element={<TimeEntries projectData={projectData} loggedUser={loggedUser} />} />

            </Routes>
          </div>
        </BrowserRouter>
      ) : (
        <Login />
      )}

    </div>
  )
}

export default App