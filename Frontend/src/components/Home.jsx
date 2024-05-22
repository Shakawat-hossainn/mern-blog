import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import CallToAction from './CallToAction';
import Card from './Card';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/v1/post/getposts?limit=9', {
          method: 'GET',
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div>
        <div className='flex flex-col justify-center ml-4 gap-5 p-[1rem]'>
          <p className='font-bold text-2xl'>Welcome to my Blog</p>
          <p className='text-gray-500 text-xs'>
            Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.
          </p>
          <Link className='text-sm font-bold text-teal-500 hover:underline'>View all the posts</Link>
        </div>
        <div>
          <CallToAction />
        </div>
        <div>
          <h1 className='text-2xl text-center font-medium mb-3'>Recent Posts</h1>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 m-4'>
          {posts.length > 0 ? (
            posts.map((post) => <Card key={post._id} post={post} />)
          ) : (
            <p className='text-center text-gray-500'>No posts available.</p>
          )}
          </div>
          <Link className='text-xl flex justify-center hover:text-teal-700 mb-4' to={'/search'}>See All the Posts</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
