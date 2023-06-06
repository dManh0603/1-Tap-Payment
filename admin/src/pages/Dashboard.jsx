import React, { useEffect } from 'react'
import DashboardContent from '../components/DashboardContent'
import Sidebar from '../components/Sidebar'
import { UserState } from '../contexts/UserProvider'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = UserState();

  useEffect(() => {
    if (user === null) return navigate('/');
  },[])
  return (
    <>
      <Sidebar />
      <div id="content-wrapper" className='d-flex flex-column'>
        <DashboardContent />
      </div>
    </>
  )
}

export default Dashboard