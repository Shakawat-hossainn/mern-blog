import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'

import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from 'react-router-dom';


const CreatePost = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [value, setValue] = useState('');
  const [uploadError, setUploadError] = useState(null)
  const [imageUploading, setImageUploading] = useState(null)
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const handleUpload =async()=>{
    if(!file){
       setUploadError("Please select an image");
       return

    }
    try {
     setUploadError(null)
     const storage = getStorage(app)
     const fileName = new Date().getTime() + file.name
     const storageRef = ref(storage, fileName)
     const uploadTask = uploadBytesResumable(storageRef, file)
     uploadTask.on(
       "state_changed",
       (snapshot) => {
         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         setImageUploading(progress.toFixed(0));
       },(error) => {
         setUploadError("Couldn't upload file: (Because the file must have been less than 2MB)")
         setImageUploading(null)
  
       },()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
            setFormData({
          
             ...formData, image: downloadURL
            })
            setImageUploading(null)
            setFile(null)
            setValue('')
            setUploadError(null)
            setImageUploading(null)
           
          })
       }

     )
      
    } catch (error) {
      setUploadError("Image Upload Failed")
      setImageUploading(null) 
      console.log(error);
      
    }

  }
  const handleSubmit =async (e) => {
    e.preventDefault()
    setPublishError(null)
    try {
       const res = await fetch('/api/v1/post/create', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
       })
       const data = await res.json()
       if(res.ok){
    setPublishError(null)

       
         navigate(`/post/${data.newPost.slug}`)
       }else{
         setPublishError(data.message)
        
       }
 
    } catch (error) {
      console.log(error)

      
    }
  }
 // console.log(formData);
  return (
    <div className='min-h-screen mx-auto max-w-3xl'>
      <h1 className='font-bold text-center text-gray-500 text-3xl mt-4'>Create a Post</h1>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <div className='flex justify-between'>
        <TextInput type='text' placeholder='Title' id='title' required className='flex-1' onChange={((e)=>setFormData({...formData,title:e.target.value}))}/>
        <Select onChange={(e)=>setFormData({...formData,category:e.target.value})}>
            <option value="uncategorized">Select a category</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
        </Select>

       
        </div>
        <div className='flex justify-between border-teal-300 border-dotted border-4 p-3'>
            <FileInput type="file" accept='image/*' onChange={((e)=>setFile(e.target.files[0]))}/>
          
            {imageUploading ? (<CircularProgressbar className='h-[4rem] w-[4rem]' value={imageUploading} text={`${imageUploading}%`}/>):(  <Button outline gradientDuoTone="purpleToBlue" onClick={handleUpload}>    Upload
            </Button>)}
            
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        {formData.image && <img src={formData.image} alt='image'className='h-65 w-full' />}
        <ReactQuill theme="snow" placeholder='Write Something Here...'onChange={(value)=>setFormData({...formData,content:value})} className='h-72 mb-12' />
        <Button type='submit' outline gradientDuoTone='purpleToBlue' className='w-full mt-4 mb-3'>
            Publish
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}

      </form>
 
    </div>
  )
}

export default CreatePost
