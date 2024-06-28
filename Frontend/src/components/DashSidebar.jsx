import React, { useEffect, useState } from 'react'
import { Sidebar } from "flowbite-react";
import { HiOutlineViewGrid, HiOutlineUserCircle, HiOutlineDocumentText, HiOutlineUsers, HiOutlineChatAlt, HiArrowSmLeft } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from "../features/User/userSlice.js";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashSidebar = () => {
  const { currentUser } = useSelector((store) => store.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [tab, setTab] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const getParams = urlParams.get("tab");
    if (getParams) {
      setTab(getParams);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/v1/user/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok) {
        dispatch(signoutSuccess())
        navigate('/')
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Sidebar aria-label="Default sidebar example" className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item as={'div'} active={tab === 'dash'} icon={HiOutlineViewGrid}>
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item as={'div'} active={tab === 'profile'} icon={HiOutlineUserCircle} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor="dark">
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item as={'div'} active={tab === 'posts'} icon={HiOutlineDocumentText}>
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item as={'div'} active={tab === 'users'} icon={HiOutlineUsers}>
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item as={'div'} active={tab === 'comments'} icon={HiOutlineChatAlt}>
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmLeft} onClick={handleSignOut} className="cursor-pointer">
            Sign-Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
