import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import ProjectTimeChart from '../Components/ProjectTimeChart';
import axios from 'axios';
import { faL } from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ loggedUser, projectData }) => {

  const [summaryData, setSummaryData] = useState([])
  const [dateFilter, setDateFilter] = useState('all')
  const [showCustom, setShowCustom] = useState(false)
  const [sd, setSD] = useState('')
  const [ed, setED] = useState('')


  const getDateRange = (filter) => {
    const today = new Date();

    const endDate = today.toISOString().split('T')[0];

    if (filter === 'week') {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);

      return {
        startDate: start.toISOString().split('T')[0],
        endDate
      };
    }

    if (filter === 'month') {
      return {
        startDate: new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString().split('T')[0],
        endDate
      };
    }
    if (filter === 'custom') {
      return {
        startDate: sd,
        endDate: ed
      }

    }

    return {
      startDate: '2026-11-09',
      endDate
    };
  };

  const fetchSummary = async () => {
    if (!loggedUser?._id) return;
    try {
      const { startDate, endDate } = getDateRange(dateFilter);
      if(!startDate || !endDate) return;
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/report`, {
        params: {
          userId: loggedUser._id,
          startDate: startDate,
          endDate: endDate
        }
      })
      setSummaryData(data);
    } catch (error) {
      console.log("Error", error)
    }
  }
  const downloadAsCSV = async () => {
    try {
      const { startDate, endDate } = getDateRange(dateFilter);
      if(!startDate || !endDate) return;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/report/export/csv`,
        {
          params: {
            userId: loggedUser._id,
            startDate: startDate,
            endDate: endDate
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.download = 'time-report.csv';

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log('Error downloading CSV:', error);
    }
  };
  const downloadAsPDF = async () => {
    try {
      const { startDate, endDate } = getDateRange(dateFilter);
      if(!startDate || !endDate) return;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/report/export/pdf`,
        {
          params: {
            userId: loggedUser._id,
            startDate: startDate,
            endDate: endDate
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;
      link.download = 'time-report.pdf';

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log('Error downloading CSV:', error);
    }
  };
  useEffect(() => {
      fetchSummary()
  }, [loggedUser, dateFilter, sd, ed])

  summaryData.projects?.sort((a,b)=> b.totalMinutes - a.totalMinutes)

  const pending = summaryData.projects?.filter(p => p.projectStatus === 'Pending')

  const completed = summaryData.projects?.filter(p => p.projectStatus === 'Completed')

  return (
    <div className='m-2 mt-10 mb-10 md:ml-85'>

      <form className="min-w-full inline-flex items-center flex-wrap gap-2">
        <p className='text-xl'>Filter :</p>
        {['all', 'week', 'month', 'custom'].map((filter) => (
          <input
            key={filter}
            className="btn"
            type="radio"
            name="dateFilter"
            aria-label={
              filter === 'all'
                ? 'All'
                : filter === 'week'
                  ? 'This Week'
                  : filter === 'month'
                    ? 'This month'
                    : 'Custom'
            }
            checked={dateFilter === filter}
            onChange={() => setDateFilter(filter)}
            onClick={() => {
              if (filter === 'custom') {
                setShowCustom(true)
              } else {
                setShowCustom(false)
              }
            }
            }
          />
        ))}
        {showCustom && (
          <>
            <label className="label">From :</label>

            <input type="date" name="" id="" className='input inline max-w-40' value={sd} onChange={(e) => setSD(e.target.value)} max={ed}/>
            <label className="label">To :</label>
            <input type="date" name="" id="" className='input inline max-w-40' value={ed} onChange={(e) => setED(e.target.value)} min={sd}/>
          </>
        )}

      </form>
      {summaryData.totalProjects>0 ? (

        <div className='flex flex-col gap-5'>
          <div className='mt-5 flex justify-between flex-wrap gap-5'>
            <h1 className='text-2xl font-bold'>Overall Summary</h1>
            <div className='flex gap-5'>
              <button className='btn btn-primary' onClick={downloadAsCSV}>Download as CSV</button>
              <button className='btn btn-secondary' onClick={downloadAsPDF}>Download as PDF</button>

            </div>
          </div>
          <div className='flex gap-2 md:gap-5 flex-wrap'>

            <div className='bg-white shadow-xl rounded-box p-4 pb-0 flex flex-col justify-between items-start mb-5'>

              <p className='font-bold'>Total Projects</p>
              <div className='flex -my-5 justify-between w-full'>
                <div id="left" className='flex flex-col justify-end max-h-43 gap-3'>
                  <p className='text-lg bg-yellow-200 p-2 px-4 rounded-lg'>Pending : {pending.length}</p>
                  <p className='text-lg bg-green-200 p-2 px-4 rounded-lg'>Completed : {completed.length}</p>

                </div>
                <div id="right" className='mx-5 mb-5'>
                  <p className='largerText'>{summaryData?.totalProjects}</p>
                </div>
              </div>

            </div>
            <div className='bg-white shadow-xl rounded-box p-4 min-w-fit mb-5'>
              <p className='font-bold'>Total Time Worked</p>
              <div className='min-w-50 mr-10'>
                <ProjectTimeChart summary={summaryData} />
              </div>
            </div>
          </div>
          <h1 className='text-2xl font-bold'>Project-wise  Summary</h1>

          <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-5'>

            {summaryData?.projects?.map((project, index) => (

              <div className='bg-white shadow-xl rounded-box p-4' key={index}>
                <p>Project Name : <b>{project?.projectName}</b></p>
                <p>Total time Worked : <b>{project?.totalTime}</b></p>

              </div>
            ))}
          </div>

        </div>
) : (
  <p className='w-full text-center mt-10'>Data not available</p>
)}


        </div>
  )
}

export default Dashboard