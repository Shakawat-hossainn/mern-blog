import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Posts = () => {
  const [postToDeleteId, setPostToDeleteId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useSelector((store) => store.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
 // console.log(userPosts)
 // console.log(currentUser)
 //console.log(postToDeleteId)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/v1/post/getposts?${currentUser.userId}`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    {
      currentUser.isAdmin && fetchPosts();
    }
    // console.log(currentUser)
  }, [currentUser.userId]);
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/v1/post/getposts?${currentUser.userId}&startIndex=${startIndex}}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts([...userPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeletePost = async () => {
   
    setOpenModal(false);
    try {
      const res = await fetch(
        `/api/v1/post/delete/${postToDeleteId}/${currentUser.userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postToDeleteId));


        
        
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="overflow-x-auto mx-auto w-full min-h-screen">
        <Table striped>
          <TableHead>
            <TableHeadCell>DATE UPDATED</TableHeadCell>
            <TableHeadCell>POST IMAGE</TableHeadCell>
            <TableHeadCell>POST TITLE</TableHeadCell>
            <TableHeadCell>CATEGORY</TableHeadCell>
            <TableHeadCell>EDIT</TableHeadCell>
            <TableHeadCell>DELETE</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          {userPosts.map((post) => {
            return (
              <TableBody className="divide-y" key={post._id}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(post.updatedAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-[3rem] w-[4rem] object-cover "
                    />
                  </TableCell>
                  <TableCell className="hover:text-gray-700  ">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setPostToDeleteId(post._id);
                      }}
                      className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            );
          })}
        </Table>
        {showMore && (
          <button
            className="text-teal-700 text-[1.3rem] w-full self-center text-sm py-7"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Posts;
