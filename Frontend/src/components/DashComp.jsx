import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BiUpArrowAlt } from "react-icons/bi";
import { FaUsersGear } from "react-icons/fa6";
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Table } from "flowbite-react";

const DashComp = () => {
    const { currentUser } = useSelector((store) => store.user);

    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/v1/user/getusers?limit=5', {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.ok) {
                    setLastMonthUsers(data.lastMonthsUsers);
                    setTotalUsers(data.totalUsers);
                    setUsers(data.users);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch('/api/v1/comment/getcomments?limit=5', {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.ok) {
                    setLastMonthComments(data.lastMonthsComments);
                    setTotalComments(data.totalComments);
                    setComments(data.comments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/v1/post/getposts?limit=5', {
                    method: 'GET',
                });
                const data = await res.json();
                if (res.ok) {
                    setLastMonthPosts(data.lastMonthsPosts);
                    setTotalPosts(data.totalPosts);
                    setPosts(data.posts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchComments();
            fetchUsers();
            fetchPosts();
        }
    }, [currentUser]);

    return (
        <div className='overflow-hidden'>
            <div className='flex m-4'>
                <div className='ml-3 flex gap-9 shadow border-2 w-[35vw] md:w-[27vw] h-full text-2xl'>
                    <div>
                        <p>Total Users</p>
                        <p>{totalUsers}</p>
                        <div className='flex gap-1 text-xs mt-3'>
                            <BiUpArrowAlt className='relative top-1 text-blue-600' />
                            <p className='mr-2'>{lastMonthUsers}</p>
                            <p>Last Month</p>
                        </div>
                    </div>
                    <FaUsersGear className='text-green-500 text-4xl' />
                </div>
                <div className='ml-3 flex gap-9 shadow border-2 w-[35vw] md:w-[27vw] h-full text-2xl'>
                    <div>
                        <p>Total Comments</p>
                        <p>{totalComments}</p>
                        <div className='flex gap-1 text-xs mt-3'>
                            <BiUpArrowAlt className='relative top-1 text-blue-600' />
                            <p className='mr-2'>{lastMonthComments}</p>
                            <p>Last Month</p>
                        </div>
                    </div>
                    <FaUsersGear className='text-green-500 text-4xl' />
                </div>
                <div className='ml-3 flex gap-9 shadow border-2 w-[35vw] md:w-[27vw] h-full text-2xl'>
                    <div>
                        <p>Total Posts</p>
                        <p>{totalPosts}</p>
                        <div className='flex gap-1 text-xs mt-3'>
                            <BiUpArrowAlt className='relative top-1 text-blue-600' />
                            <p className='mr-2'>{lastMonthPosts}</p>
                            <p>Last Month</p>
                        </div>
                    </div>
                    <FaUsersGear className='text-green-500 text-4xl' />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                <div className='flex flex-col items-center w-full border m-2 shadow '>
                    <div className='flex gap-[7rem] mt-3'>
                        <h1 className='font-bold'>Recent Users</h1>
                        <Link to={'/dashboard?tab=users'}>
                            <Button outline gradientDuoTone="purpleToBlue">See all</Button>
                        </Link>
                    </div>
                    <div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>USER IMAGE</Table.HeadCell>
                                <Table.HeadCell>USERNAME</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {users.map((user) => (
                                    <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <img src={user.googlePhoto} alt={user.username} className='w-10 h-10 rounded-full' />
                                        </Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <div className='flex flex-col items-center w-full border m-2 shadow '>
                    <div className='flex gap-[7rem] mt-3'>
                        <h1 className='font-bold'>Recent Comments</h1>
                        <Link to={'/dashboard?tab=comments'}>
                            <Button outline gradientDuoTone="purpleToBlue">See all</Button>
                        </Link>
                    </div>
                    <div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>COMMENT CONTENT</Table.HeadCell>
                                <Table.HeadCell>LIKES</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {comments.map((comment) => (
                                    <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell >
                                            {comment.content}
                                        </Table.Cell>
                                        <Table.Cell>{comment.likes.length}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <div className='flex flex-col items-center w-full border m-2 shadow md:col-span-2 md:mx-auto '>
                    <div className='flex gap-[7rem] mt-3'>
                        <h1 className='font-bold'>Recent Posts</h1>
                        <Link to={'/dashboard?tab=posts'}>
                            <Button outline gradientDuoTone="purpleToBlue">See all</Button>
                        </Link>
                    </div>
                    <div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>POST IMAGE</Table.HeadCell>
                                <Table.HeadCell>POST TITLE</Table.HeadCell>
                                <Table.HeadCell>CATEGORY</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {posts.map((post) => (
                                    <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <img src={post.image} alt={post.title} className='w-10 h-10 rounded-full' />
                                        </Table.Cell>
                                        <Table.Cell>{post.title}</Table.Cell>
                                        <Table.Cell>{post.category}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashComp;
