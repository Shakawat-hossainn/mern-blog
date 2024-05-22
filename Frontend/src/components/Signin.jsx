import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from '../features/User/userSlice'
import { Alert,Spinner } from 'flowbite-react'



const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
 const {loading,error:errorMessage} = useSelector((store)=>store.user)
  const [formData, setformData] = useState({})
  const handleChange = (e) => {
    setformData({...formData, [e.target.id]:e.target.value })
  }
 
  const handleSubmit = async(e) => {
    e.preventDefault()
    // if(!formData.username || !formData.password || !formData.email){
    //   return seterrorMessage("Please fill out all required fields")
    // }
   try {
    dispatch(signInStart())
    
const res = await fetch('/api/v1/auth/signin',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(formData)
});
const data = await res.json();

if(res.ok){
  dispatch(signInSuccess(data));

  navigate('/')
}
if (data.success === false) {
dispatch(signInFailure(data.message));;
}else{
 dispatch(signInSuccess(data));
}

   } catch (error) {
    dispatch(signInFailure(error.message));
    
   }
  }

  
  return (
    <div className='sign-up overflow-x-hidden'>
      <div className='hidden md:inline'>
      <span className="rounded text-5xl p-1 self-center relative top-[17rem] left-[14rem]  whitespace-nowrap bg-gradient-to-r from-indigo-500 via-purple-500 to-green-200 font-semibold dark:text-white" >Shakawat's </span><span  className="text-5xl relative top-[17rem] left-[14rem] font-semibold dark:text-white">Blog</span>
      </div>
    <div className="flex min-h-full flex-1 relative left-[12rem] flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto  sm:w-full sm:max-w-sm">
      {/* <img
        className="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      /> */}
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required onChange={handleChange} 
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Password
            </label>
            {/* <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div> */}
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
         {
          loading? (
            <Spinner className='sm' />
          ) : (
            "Sign in"
          )
         }
        </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Don't have a account?{' '}
        <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Sign-Up
        </Link>
      </p>
      { errorMessage && 
   ( <Alert className='mt-5'color='failure'>
      {errorMessage}
    </Alert>)}
    </div>
  </div>
  </div>
  )
}

export default Signin
