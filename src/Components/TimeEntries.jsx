import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

const TimeEntries = ({ projectData, loggedUser }) => {

  const [timeEntriesData, setTimeEntriesData] = useState([])
  const [showDelete, setShowDelete] = useState(null)


  const fetchTimeEntries = async () => {
    if (!loggedUser._id) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/time-entries/${loggedUser._id}`)
      setTimeEntriesData(data.TimeEntries)
    } catch (error) {
      console.log("Error fetching time entries : ", error)
    }
  }
  useEffect(() => {
    fetchTimeEntries()
  }, [loggedUser._id])

  const handleDelete = async (timeEntryId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/time-entries/${timeEntryId}`);

      await fetchTimeEntries();

      setShowDelete(null);
            toast.success("Time-entry Deleted")
      
    } catch (error) {
      console.error('Error deleting time entry:', error);
      alert('Failed to delete the time entry. Please try again.');
    }
  };

  const formatDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes < 1) return "0m";
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`

    return `${hours}h ${minutes}m`;

  }

  return (
    <div className='m-3 md:ml-85'>
      {projectData.length > 0 ? (
        <>
          <h1 className='font-bold my-2'>All Time-entries</h1>

          <div className="overflow-x-auto max-w-fit bg-white rounded-xl px-3 py-2 shadow-xl mt-2">

            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th className='text-gray-500'>#</th>
                  <th>Project</th>
                  <th>Description</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th>Duration</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {timeEntriesData.map((timeEntry, index) => (

                  <tr key={timeEntry._id}>
                    <th className='text-gray-500'>
                      {index + 1}
                    </th>

                    <td>{projectData.find(p => p._id === timeEntry.projectId)?.name || 'NA'}</td>
                    <td>{timeEntry?.description}</td>
                    <td>{new Date(timeEntry?.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td>{new Date(timeEntry?.endTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td>{formatDuration(timeEntry?.duration)}</td>

                    <th>
                      <button className="btn btn-sm" onClick={() => { setShowDelete(timeEntry) }}><FontAwesomeIcon icon={faTrash} /></button>
                    </th>
                    <th>
                    </th>
                  </tr>
                ))}

              </tbody>
            </table>


          </div>
        </>) : (
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
              Are you sure you want to delete this entry? This action cannot be undone.
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

    </div>

  )
}

export default TimeEntries