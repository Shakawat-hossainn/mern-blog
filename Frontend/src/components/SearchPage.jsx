import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Select, TextInput } from 'flowbite-react'
import Card from './Card'
const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  })
  //console.log(sidebarData)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermUrl = urlParams.get('searchTerm')
    const categoryUrl = urlParams.get('category')
    const sortUrl = urlParams.get('sort')

    if (searchTermUrl || categoryUrl || sortUrl) {
      setSidebarData((prevData) => ({
        ...prevData,
        category: categoryUrl || prevData.category,
        sort: sortUrl || prevData.sort,
        searchTerm: searchTermUrl || prevData.searchTerm,
      }))
    }

    const fetchPosts = async () => {
      const searchQuery = new URLSearchParams(location.search).toString();

      const res = await fetch(`/api/v1/post/getposts?${searchQuery}`, {
        method: 'GET',
      })
      const data = await res.json()
      if (res.ok) {
        setPosts(data.posts)
      } else {
        console.log(data.message)
      }
    }

    fetchPosts()
  }, [location.search])

  const handleInputChange = (e) => {   // to understand this better you can go to that mern blog search funtion in the code snippet of github
    //console.log(e.target)
    const { id, value } = e.target
    setSidebarData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('category', sidebarData.category)
    urlParams.set('sort', sidebarData.sort)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)

  
  }

  return (
    <div>
      <div className="ml-4 flex flex-col gap-6 mb-3 pb-3 border-b-2">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-5">
            <label htmlFor="searchTerm" className="whitespace-nowrap">
              Search Term:
            </label>
            <TextInput
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleInputChange}
              placeholder="Search..."
            />
          </div>
          <div className="flex items-center gap-5">
            <label htmlFor="sort" className="font-semibold">
              Sort:
            </label>
            <Select id="sort" value={sidebarData.sort} onChange={handleInputChange}>
              <option value="desc">Oldest</option>
              <option value="asc">Latest</option>
            </Select>
          </div>
          <div className="flex items-center gap-5">
            <label htmlFor="category" className="font-semibold">
              Category:
            </label>
            <Select id="category" value={sidebarData.category} onChange={handleInputChange}>
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <button type="submit" className="self-start mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Apply Filters
          </button>
        </form>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 m-4'>
        {posts.map((post, index) =>{
          return (
            <Card key={index} post={post} />
          )
        })}
       
      </div>
    </div>
  )
}

export default SearchPage
