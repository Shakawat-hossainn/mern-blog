import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
//import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,FaSun } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux"
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../features/Theme/themeSlice';

import { useNavigate } from 'react-router-dom';

import { signoutSuccess } from '../features/User/userSlice.js';

const Header = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((store) => store.user)
  const {theme} = useSelector((store) => store.theme)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const location = useLocation()
  //console.log(currentUser.user)
  let path = useLocation().pathname;
  const handleSignOut =async() => {
    try {
      const res = await fetch('/api/v1/user/signout',{
         method: 'POST',
      })
      const data = await res.json()
      if(res.ok){
         dispatch(signoutSuccess())
         navigate('/')

      }else{
        console.log(data.message)
      }
    } catch (error) {
      console.log(error.message)
      
      
    }
  } 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermUrl = urlParams.get('searchTerm')
    setSearchTerm(searchTermUrl)
    
  }, [location.search])
const handleSubmit=(e)=>{
  e.preventDefault()
  const urlParams = new URLSearchParams(location.search)
  urlParams.set('searchTerm', searchTerm)
  const searchQuery = urlParams.toString()
  navigate(`/search?${searchQuery}`)


  
}
  
  
  return (
  
    <Navbar fluid rounded>
      <Navbar.Brand as={'div'}>
       <Link to='/'>
        <span className="rounded p-1 self-center whitespace-nowrap bg-gradient-to-r from-indigo-500 via-purple-500 to-green-200 text-xl font-semibold dark:text-white" >Shakawat's </span><span  className="text-xl font-semibold dark:text-white">Blog</span> </Link>
      </Navbar.Brand>
      <Navbar.Collapse>
       
        <Navbar.Link active={path==='/'} as={'div'}><Link to='/'>Home </Link></Navbar.Link>
        <Navbar.Link active={path==='/about'} as={'div'}><Link to='/about' >About </Link></Navbar.Link>
        <Navbar.Link active={path==='/projects'} as={'div'}><Link to='/projects'>Projects </Link></Navbar.Link>
       
       
      </Navbar.Collapse>
      <form onSubmit={handleSubmit} >
        <TextInput placeholder="Search" rightIcon={CiSearch} className='hidden lg:inline' value={searchTerm} onChange={((e)=>{setSearchTerm(e.target.value)})}/>

      </form>
      <Button color='dark' pill className='hidden md:inline'onClick={()=>{
        dispatch(toggleTheme());
      }} >{theme==="light"?<FaMoon/>:<FaSun/>}</Button> 
      <Button outline gradientDuoTone='greenToBlue' className='lg:hidden'><CiSearch className=' text-1xl'/></Button>
      <>
      
      {
        currentUser?( <div className="flex md:order-2  ">
        
       
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={currentUser.googlePhoto ||
              currentUser.rest.googlePhoto} rounded />
          }
          
        >
          <Dropdown.Header>
            <span className="block text-sm">@{currentUser.name}</span>
            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
          </Dropdown.Header>
          <Dropdown.Item><Link to={`/dashboard?tab=profile`}>Profile</Link></Dropdown.Item>
        
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignOut}> Sign out</Dropdown.Item>
        </Dropdown>
      </div>):(     <Link to='/signin'>
        <Button outline gradientDuoTone='purpleToBlue'>Sign In</Button>
        </Link>)
      }
      </>
   
     
        <Navbar.Toggle  />
     
      
     
    </Navbar>

   
  )
}
export default Header
