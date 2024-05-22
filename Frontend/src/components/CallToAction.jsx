import React from 'react'
import {Button} from 'flowbite-react'
const CallToAction = () => {
  return (
    <div className='border-2 m-3 border-teal-400'>
      <h1 className='font-bold  p-2 text-3xl '>
        Want to build HTML, CSS, and JavaScript by building fun and engaging projects?
      </h1>
      <p className=" p-2" >
        Check out our 100 projects website where you can learn to build your own project
      </p>
      <div className='m-3'>
      <Button  gradientDuoTone="greenToBlue" className='w-full p-2 '>100 js project website</Button></div>
      <img className=" p-2" src="https://media.licdn.com/dms/image/D4D12AQE4I5-9AdoekA/article-cover_image-shrink_600_2000/0/1707581728949?e=2147483647&v=beta&t=ebCbkjdc1Ieh0TxVUpNbD7p8A17_0CSkB9gWrRC9UEc" alt="100 js projects" />
    </div>
  )
}

export default CallToAction
