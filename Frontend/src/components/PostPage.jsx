import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from './CallToAction';
import CommentSection from './CommentSection';
import Card from './Card.jsx';

const PostPage = () => {
  const [singlePost, setSinglePost] = useState({});
  const { postSlug } = useParams();
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/v1/post/getposts?slug=${postSlug}`, {
        method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
        setSinglePost(data.posts[0]);
      } else {
        console.log(data.message);
      }
    };

    if (postSlug) {
      fetchPost();
    }
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const res = await fetch('/api/v1/post/getposts?limit=3', {
        method: 'GET',
      });
      const data = await res.json();
      if (res.ok) {
        setRecentPosts(data.posts);
      } else {
        console.log(data.message);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <main>
      <div className='flex flex-col items-center gap-7'>
        <div>
          <h1 className='text-center text-6xl text-gray-600 mt-4 hover:text-black cursor-pointer '>{singlePost.title}</h1>
        </div>
        <div>
          <Link to={`/search?category=${singlePost.category}`}><p className='rounded-[1.5rem] bg-gray-200 px-4 py-2 inline-block'>{singlePost.category}</p></Link>
        </div>
        <div>
          <img src={singlePost.image} alt={singlePost.title} />
        </div>
        <div className='p-3 max-w-2xl md:max-w-[59rem] mx-auto w-full ' dangerouslySetInnerHTML={{ __html: singlePost.content }}>
        </div>
      </div>
      <div className='max-w-4xl mx-auto'>
        <CallToAction />
      </div>
      <div className='max-w-4xl mx-auto'>
        <CommentSection postId={singlePost._id} />
      </div>
      <div>
        <h1 className='mx-auto w-full text-center m-4 text-2xl'>Recent Post</h1>
        <div className='md:flex md:flex-row md:gap-3 md:m-4'>
        {recentPosts && recentPosts.map((post) => (
          <Card key={post._id} post={post} />
        ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
