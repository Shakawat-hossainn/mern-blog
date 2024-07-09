import { Textarea, Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaRegThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Comment = ({ comment, likeComment, EditContent,onDelete }) => {
  // Initialize state with default values to handle undefined cases
  const [likesCount, setLikesCount] = useState(comment?.likes?.length || 0);
  const [commentUser, setCommentUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content || '');

  const currentUser = useSelector((store) => store.user.currentUser);

  useEffect(() => {
    if (!comment?.userId) return; // Early return if comment or userId is undefined

    const getUser = async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`, {
          method: 'GET',
        });
        const data = await res.json();
        if (res.ok) {
          setCommentUser(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [comment?.userId]);

  useEffect(() => {
    if (comment?.likes?.length >= 0) {
      setLikesCount(comment.likes.length);
    }
  }, [comment?.likes?.length]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/comment/editcomment/${comment._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        EditContent(comment._id, editedContent);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const userLikesComment = () => {
    if (!currentUser || !comment?.likes) return false;
    const userId = currentUser.userId || (currentUser.rest && currentUser.rest._id);
    return userId && comment.likes.includes(userId);
  };

  const isCommentOwnerOrAdmin = () => {
    if (!currentUser) return false;
    const userId = currentUser.userId || (currentUser.rest && currentUser.rest._id);
    return userId === comment.userId || currentUser.isAdmin || currentUser.rest.isAdmin ;
  };

  // Debugging statements
  // console.log('Current User:', currentUser);
  // console.log('Comment:', comment);
  // console.log('Comment User:', commentUser);
//console.log(comment)
  if (!comment) {
    return <div>Loading comment...</div>;
  }

  return (
    <div className='flex h-[5rem] ml-5 overflow-x-hidden'>
      <div>
        <img src={commentUser.googlePhoto} alt="profile picture" className='w-10 h-10 rounded-full mb-6' />
      </div>
      <div className='ml-4 border-b-2 w-full min-h-5'>
        <p className='text-gray-500 text-xs mb-2 relative top-1 right-1'>@{commentUser.username}</p>
        {isEditing ? (
          <Textarea
            className='w-full h-10 mb-2'
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <p>{comment.content}</p>
        )}
        <div className='mt-2 flex gap-1'>
          <button
            onClick={() => likeComment(comment._id)}
            className={`text-gray-600 hover:text-teal-800 ${userLikesComment() && '!text-blue-500'}`}
          >
            <FaRegThumbsUp />
          </button>
          <span className="text-gray-500 text-xs">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          {isCommentOwnerOrAdmin() && (
            <>
              {isEditing ? (
                <>
                <div className='flex'>
                <Button  gradientDuoTone="purpleToBlue" onClick={handleSave} className=' absolute left-[4rem] z-10 md:left-[24rem]  '>Save</Button>
                <Button  gradientDuoTone="purpleToBlue" onClick={()=>setIsEditing(false)} className=' absolute left-[29rem]  size-15 md:left-[70rem]'>Cancel</Button>
                </div>
                </>
              ) : (
                <>
                <button type='button' onClick={handleEdit} className='text-gray-400 hover:text-blue-500 text-xs ml-2'>Edit</button>
                <button type='button' onClick={()=>onDelete(comment._id)} className='text-gray-400 hover:text-blue-500 text-xs ml-2'>Delete</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
