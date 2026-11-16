import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CreateTimeEntry = ({projectData, loggedUser}) => {

    const [projectId, setProjectId] = useState('')
    const [desc, setDesc] = useState('')
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const navigate = useNavigate()

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault()

        const start = new Date(startTime)
        const end = new Date(endTime)

        if (end <= start) {
            alert("End time must be after the start time!");
            return;
        }

        const duration = Math.round((end - start) / 1000 / 60);

        try {
            if (!projectId || !desc.trim() || !startTime || !endTime){
                alert("All fields are required!")
                return;
            }   
            const newTimeEntry = {
                "userId":loggedUser._id,
                "projectId": projectId,
                "description": desc,
                "startTime": startTime,
                "endTime": endTime,
                "duration": duration
            }

            const data = await axios.post(`${import.meta.env.VITE_API_URL}/api/time-entries`, newTimeEntry)

            navigate('/time-entries')
                  toast.success("Time-entry Logged!")
            

        } catch (error) {
            console.log("Error creating Time entry : ", error)
        }
    }

    
    return (
        <div>
            <form action="" onSubmit={handleSubmit} className='min-w-full m-3 md:ml-85'>
                <h1 className="font-bold my-2">Log Time-entry</h1>

            <fieldset className="fieldset bg-white border-base-300 shadow-xl rounded-box w-md border p-4">


                    <label className="label">Project</label>
                    <select required defaultValue="" className="select" onChange={(e) => { setProjectId(e.target.value) }}>
                        <option value="" disabled={true}>Select Project</option>
                        {projectData?.map((project) => (
                            <option key={project._id} value={project._id}>{project?.name}</option>
                        ))}
                    </select>

                    <label className="label">Description</label>
                    <textarea required name="" id="" className="input min-h-33 p-3" placeholder="Description..." value={desc} onChange={(e) => { setDesc(e.target.value) }}></textarea>

                    <label className="label">Start time</label>
                    <input
                        type="datetime-local"
                        className="input"
                        max={endTime}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />

                    <label className='label'>End time</label>
                    <input
                        type="datetime-local"
                        className="input"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        min={startTime}
                        disabled={!startTime}
                        required
                    />

                    <button type='Submit' className="btn btn-sm sm:btn-sm md:btn-md lg:btn-lg mt-3 btn-soft btn-primary">Log</button>
                </fieldset>
            </form>

        </div>
    )
}

export default CreateTimeEntry