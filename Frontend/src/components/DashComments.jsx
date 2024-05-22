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
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";


const DashComments = () => {
  const [commentToDeleteId, setCommentToDeleteId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useSelector((store) => store.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
 // console.log(comments);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/v1/comment/getcomments`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    {
      currentUser.isAdmin && fetchComments();
    }
    // console.log(currentUser)
  }, []);
  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/v1/comment/getcomments?startIndex=${startIndex}}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteComments = async() => {
  try {
    const res = await fetch(`/api/v1/comment/deletecomment/${commentToDeleteId}`,
        {
          method: "DELETE",
        },
        
    );
    const data = await res.json()
    if(res.ok){
        setComments(comments.filter((comment) => comment._id!== commentToDeleteId))
        setOpenModal(false)
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
            <TableHeadCell>DATE UPDTED</TableHeadCell>
            <TableHeadCell>COMMENT CONTENT</TableHeadCell>
            <TableHeadCell>NUMBER OF LIKES</TableHeadCell>
            <TableHeadCell>POSTID</TableHeadCell>
            <TableHeadCell>USERID</TableHeadCell>
            <TableHeadCell>DELETE</TableHeadCell>
          </TableHead>
          {comments.map((comment) => {
            return (
              <TableBody className="divide-y" key={comment._id}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(comment.updatedAt).toDateString()}
                  </TableCell>
                  <TableCell>
                   {comment.content}
                    
                  </TableCell>
                  <TableCell className="hover:text-gray-700  ">
                    {comment.likes.length}
                  </TableCell>
                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>
                    {comment.userId}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setCommentToDeleteId(comment._id);
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComments}>
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

export default DashComments
