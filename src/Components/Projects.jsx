import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Projects = ({ fetchProjects, projectData, setProjectData }) => {


  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [client, setClient] = useState('')
  const navigate = useNavigate()

  const [showEdit, setShowEdit] = useState(null)
  const [showDelete, setShowDelete] = useState(null)

  const handleStatusToggle = async (projectId, currentStatus) => {

    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
        { "status": nextStatus }
      );

      await fetchProjects();
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
      alert('Error updating status. Please try again.');
    }
  };


  const handleUpdate = async (e, projectId) => {
    e.preventDefault();
    try {
      if (!name.trim() || !desc.trim() || !client.trim()) {
        alert("All fields are required!")
        return;
      }
      const newProject = {
        "name": name,
        "description": desc,
        "client": client
      }
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, newProject)
      await fetchProjects();
      setShowEdit(null)
      toast.success("Project Updated!")
    } catch (error) {
      console.log("Error creating project : ", error)
      setShowEdit(null)
    }
  }

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`);

      await fetchProjects();
      setShowDelete(null);
      toast.success("Project Deleted")
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete the project. Please try again.');
    }
  };

  useEffect(() => {
    if (showEdit?._id) {
      const sp = projectData.filter(p => p._id === showEdit?._id)
      setName(sp[0].name)
      setDesc(sp[0].description)
      setClient(sp[0].client)
    }
  }, [showEdit?._id])

  return (
    <div className='max-w-full m-3 md:ml-85'>
      {projectData.length > 0 ? (
        <>

          <h1 className='font-bold my-2'>All Projects</h1>

          <div className="overflow-x-auto max-w-fit bg-white rounded-xl px-3 py-2 shadow-xl mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projectData.map((project, index) => (

                  <tr key={project._id}>
                    <th><input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={project.status === 'Completed'}
                      onChange={() => handleStatusToggle(project._id, project.status)}
                    /></th>
                    <th className='text-gray-500'>
                      {index + 1}
                    </th>

                    <td>{project?.name}</td>
                    <td>{project?.description}</td>
                    <td>{project?.client}</td>
                    <td><span className={`p-2 px-3 rounded-lg ${project?.status === "Completed" ? "bg-green-300" : "bg-yellow-200"}`}>{project?.status || "Pending"}</span></td>
                    <th className='flex gap-5'>
                      <button className="btn btn-sm" onClick={() => { setShowEdit(project) }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                      <button className="btn btn-sm" onClick={() => { setShowDelete(project) }}><FontAwesomeIcon icon={faTrash} /></button>
                    </th>
                    <th>
                    </th>
                  </tr>
                ))}

              </tbody>
            </table>


          </div>
        </>

      ) : (
        <p className='w-full text-center mt-10'>Data not available</p>

      )}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDelete(null)}
          />

          <div className="relative z-10 w-full max-w-md scale-100 rounded-xl bg-white p-6 shadow-xl transition-all dark:bg-neutral-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>

            <p className="my-4 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete {showDelete.name}? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 active:bg-red-800"
                onClick={() => {
                  handleDelete(showDelete._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showEdit && (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEdit(null)}
          />

          <div className="relative z-10 w-full max-w-fit scale-100 rounded-xl bg-white p-6 shadow-xl transition-all dark:bg-neutral-800">
            <form action="" onSubmit={(e) => {
              handleUpdate(e, showEdit._id);
            }}>

              <h1 className="font-bold my-2">Edit Project</h1>
              <fieldset className="fieldset bg-white border-base-300 shadow-xl rounded-box w-md border p-4">

                <label className="label">Name</label>
                <input type="text" className="input" placeholder="Your project name" value={name} onChange={(e) => { setName(e.target.value) }} required />

                <label className="label">Description</label>
                <textarea name="" id="" className="input min-h-33 p-3" placeholder="Description..." value={desc} onChange={(e) => { setDesc(e.target.value) }} required></textarea>

                <label className="label">Client</label>
                <input type="text" className="input" placeholder="Client name" value={client} onChange={(e) => { setClient(e.target.value) }} required />

            <div className="flex w-full gap-3">
              <button
                type="button"
                className="btn btn-sm sm:btn-sm md:btn-md lg:btn-lg mt-3 btn-soft w-50 text-gray-700"
                // className="w-50 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>

                <button type='Submit' className="btn btn-sm sm:btn-sm md:btn-md lg:btn-lg mt-3 btn-soft btn-primary w-50">Update</button>
              </div>
              </fieldset>
            </form>

          </div>
        </div>
      )}

    </div>

  )
}

export default Projects