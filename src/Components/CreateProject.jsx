import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CreateProject = ({fetchProjects,loggedUser}) => {

    const [name,setName] = useState('')
    const [desc,setDesc] = useState('')
    const [client,setClient] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
            if (!name.trim() || !desc.trim() || !client.trim()){
                alert("All fields are required!")
                return;
            }   

                const newProject = {
                "userId":loggedUser._id,
                "name":name, 
                "description":desc, 
                "client":client
            }
            const data = await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, newProject)
            await fetchProjects();
            navigate('/projects')
                  toast.success("Project Added!")
        } catch (error) {
            console.log("Error creating project : ",error)
        }
    }

    return (
        <div id='formContainer' className='min-w-full m-3 md:ml-85'>
            <form action="" onSubmit={handleSubmit}>

                <h1 className="font-bold my-2">Add Project</h1>
            <fieldset className="fieldset bg-white border-base-300 shadow-xl rounded-box w-md border p-4">

                <label className="label">Name</label>
                <input type="text" className="input" placeholder="Your project name" value={name} onChange={(e)=>{setName(e.target.value)}} required/>

                <label className="label">Description</label>
                <textarea name="" id="" className="input min-h-33 p-3" placeholder="Description..." value={desc} onChange={(e)=>{setDesc(e.target.value)}} required></textarea>

                <label className="label">Client</label>
                <input type="text" className="input" placeholder="Client name" value={client} onChange={(e)=>{setClient(e.target.value)}} required/>

                <button type='Submit' className="btn btn-sm sm:btn-sm md:btn-md lg:btn-lg mt-3 btn-soft btn-primary">Add</button>
            </fieldset>
            </form>

        </div>
    )
}

export default CreateProject