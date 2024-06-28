import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import OAuth from './OAuth';

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, seterrorMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [formData, setformData] = useState({});

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        navigate('/signin');
      } else {
        seterrorMessage(data.message);
      }
    } catch (error) {
      seterrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='sign-up'>
      <div className='hidden md:inline'>
       
        
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="relative top-[-2rem] text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white">Username</label>
                <input onChange={handleChange} type="text" required id="username" name="username" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"/>
              </div>
            </div>
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
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-3"
              >
                {loading ? (
                  <Spinner className='sm' />
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>
          <OAuth />
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign-In
            </Link>
          </p>
          {errorMessage &&
            (<Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>)}
        </div>
      </div>
    </div>
  );
}

export default Signup;
