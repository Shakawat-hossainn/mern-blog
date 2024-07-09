import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
    const {currentUser} = useSelector((store)=>store.user)
  return currentUser && currentUser.isAdmin || currentUser.rest.isAdmin ? <Outlet/> : <Navigate to="/signin" />
    
  
}

export default AdminRoute
