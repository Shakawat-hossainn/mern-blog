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

const Users = () => {
  const [userToDeleteId, setUserToDeleteId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useSelector((store) => store.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  console.log(users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/v1/user/getusers`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    {
      currentUser.isAdmin && fetchUsers();
    }
    // console.log(currentUser)
  }, []);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/v1/user/getusers?startIndex=${startIndex}}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteUser = async() => {
  try {
    const res = await fetch(`/api/v1/user/delete/${userToDeleteId}`,
        {
          method: "DELETE",
        },
        
    );
    const data = await res.json()
    if(res.ok){
        setUsers(users.filter((user) => user._id!== userToDeleteId))
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
            <TableHeadCell>DATE CREATED</TableHeadCell>
            <TableHeadCell>USER IMAGE</TableHeadCell>
            <TableHeadCell>USERNAME</TableHeadCell>
            <TableHeadCell>EMAIL</TableHeadCell>
            <TableHeadCell>ADMIN</TableHeadCell>
            <TableHeadCell>DELETE</TableHeadCell>
          </TableHead>
          {users.map((user) => {
            return (
              <TableBody className="divide-y" key={user._id}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <img
                      src={user.googlePhoto}
                      alt={user.username}
                      className="h-[3rem] w-[3rem] object-cover rounded-[2rem] "
                    />
                  </TableCell>
                  <TableCell className="hover:text-gray-700  ">
                    {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <ImCross className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setUserToDeleteId(user._id);
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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

export default Users;
