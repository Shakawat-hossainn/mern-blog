import { Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment.jsx';

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((store) => store.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

 //console.log(comments)
 //console.log(currentUser)

    const handleComment = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch('/api/v1/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser.userId || currentUser.rest._id }),
            });
            const data = await res.json();

            if (res.ok) {
                setComments((prevComments) => [data, ...prevComments]);
                setComment('');
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/v1/comment/getcomments/${postId}`, {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.ok) {
                    setComments(data);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getComments();
    }, [postId]);
    

    const likeComment = async (commentId) => {
        try {
            const res = await fetch(`/api/v1/comment/likecomment/${commentId}`, {
                method: 'PATCH',
            });
            const data = await res.json();
           
            if (res.ok) {
                setComments((prevComments) =>
                    prevComments.map((comment) => (comment._id === commentId ? {...comment,likes:data.likes,numberOfLikes:data.likes.length} : comment))
                );
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    const handleEdit=(commentId,comment) => {
        setComments((prevComments) =>
            prevComments.map((c) => (c._id === commentId? {...comment,content:comment} : c))
        );

    }
    const handleDelete = async (commentId) => {
     
        try {
          const res = await fetch(`/api/v1/comment/deletecomment/${commentId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          if (res.ok) {
            setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
          } else {
            console.log(data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    

    return (
        <>
            {currentUser ? (
                <form onSubmit={handleComment}>
                    <div className='overflow-hidden'>
                        <p className='flex text-teal-500 ml-3'>
                            Signed in as:{' '}
                            <img className='rounded-full w-6' src={currentUser.googlePhoto} alt='' />@
                            {currentUser.name}
                        </p>
                        <Textarea
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            maxLength={200}
                            className='w-[33rem] md:w-full h-20 m-4'
                            placeholder='Add a comment...'
                        />
                        <div className='flex justify-between m-4'>
                            <p>{200 - comment.length} Characters Remaining</p>
                            <Button type='submit' outline gradientDuoTone='purpleToBlue'>
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className='mx-auto w-full text-center mb-4'>
                    <span>You need to sign in to comment 👉👉👉</span>
                    <Link to='/signin'>
                        <Button gradientDuoTone='greenToBlue' className='inline-block'>
                            Sign-In
                        </Button>
                    </Link>
                </div>
            )}
            {comments.length === 0 ? (
                <p className='ml-5 mb-3'>No comments to show yet!</p>
            ) : (
                <div>
                    <div>
                        <span>Comments</span>
                        <p className='inline-block ml-3 border p-1 rounded mb-3'>{comments.length}</p>
                    </div>
                    <div>
                        {comments.map((comment, index) => (
                            <div key={index}>
                                <Comment comment={comment} likeComment={likeComment} EditContent={handleEdit} onDelete={handleDelete} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default CommentSection;
