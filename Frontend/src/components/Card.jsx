import { Button } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ post }) => {
  return (
    <div className='relative flex flex-col group'>
      <Link to={`/post/${post.slug}`} className='w-full flex justify-center'>
        <img className='h-[300px] w-auto  hover:h-[290px] object-contain transition-all duration-200 ' src={post.image} alt={post.title} />
      </Link>
      <div className='flex flex-col gap-7'>
        <h1 className='font-bold text-xl line-clamp-2 p-3'>{post.title}</h1>
        <Link to={`/search?category=${post.category}`}>
          <span className='border-2 rounded-full p-2 m-2 bg-gray-300'>{post.category}</span>
        </Link>
        <Link to={`/post/${post.slug}`}><Button gradientDuoTone="purpleToBlue" className='text-2xl w-full mb-4'>Read Article</Button></Link>
      </div>
    </div>
  );
};

export default Card;
