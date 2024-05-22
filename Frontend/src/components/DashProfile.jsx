import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { updateFailure, updateStart, updateSuccess, deleteFailure, deleteStart, deleteSuccess, signoutSuccess } from "../features/User/userSlice.js";
import { useDispatch } from "react-redux";
import { Modal } from "flowbite-react";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [imageUploading, setImageUploading] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.user);
  const imagePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  const [imageUrlFile, setImageUrlFile] = useState(null);
  const [key, setKey] = useState(0);

  const handleFileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrlFile(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const uploadImage = async () => {
    setImageUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Couldn't upload file: (Because the file must have been less than 2MB)"
        );
        setImageFile(null);
        setImageUrlFile(null);
        setImageFileUploadProgress(null);
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrlFile(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes were made");
      return;
    }
    if (imageUploading) {
      setUpdateUserError("Please wait while the image is uploading");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/v1/user/update/${currentUser.userId || currentUser._id || currentUser.rest._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's Profile updated successfully");
      } else {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setOpenModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/v1/user/delete/${currentUser.userId || currentUser._id || currentUser.rest._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteSuccess(data));
      } else {
        dispatch(deleteFailure(data.message));
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/v1/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
        navigate('/');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg w-full flex flex-col gap-4 justify-center mx-auto">
      <h1 className="font-bold text-3xl dark:text-stone-400 w-51 mx-auto cursor-pointer">
        Profile
      </h1>
      <input
        type="file"
        accept="image/*"
        ref={imagePickerRef}
        onChange={handleFileImage}
        hidden
      />
      {imageFileUploadProgress && (
        <CircularProgressbar
          value={imageFileUploadProgress || 0}
          text={`${imageFileUploadProgress}%`}
          strokeWidth={5}
          styles={{
            root: {
              width: "7rem",
              height: "7rem",
              position: "absolute",
              top: "13.5rem",
              left: "51rem",
            },
            path: {
              stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
            },
          }}
        />
      )}
      <img
        onClick={() => imagePickerRef.current.click()}
        src={
          imageUrlFile ||
          currentUser.googlePhoto ||
          currentUser.rest.googlePhoto
        }
        className={`rounded-full h-[7rem] w-[7rem] object-cover mx-auto border-8 border-[lightgray] ${
          imageFileUploadProgress &&
          imageFileUploadProgress < 100 &&
          "opacity-60"
        }`}
      />
      {imageFileUploadError && (
        <Alert color="failure">{imageFileUploadError}</Alert>
      )}
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="username"
            defaultValue={currentUser.name || currentUser.username || currentUser.rest.username}
            required
            shadow
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            defaultValue={currentUser.email || currentUser.rest.email}
            required
            shadow
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            id="password"
            type="password"
            required
            shadow
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center gap-2 justify-between">
          <p className="text-red-500 cursor-pointer" onClick={() => setOpenModal(true)}>Delete Account?</p>
          <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this account?
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
          <p className="text-red-500 cursor-pointer" onClick={handleSignOut}>Sign Out?</p>
        </div>
        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        <Button type="submit" outline gradientDuoTone="purpleToBlue">
          Update
        </Button>

        {currentUser.isAdmin && (
         <Link to='/create-post'><Button type="button" outline gradientDuoTone="purpleToBlue" className="w-full">
            Create a Post
          </Button> </Link> 
        )}
      </form>
    </div>
  );
};

export default DashProfile;
