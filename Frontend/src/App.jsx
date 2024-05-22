import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import About from "./components/About";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import CreatePost from "./components/CreatePost";
import UpdatePosts from "./components/UpdatePosts";
import PostPage from "./components/PostPage";
import SearchPage from "./components/SearchPage";
const App = () => {
  
  return (
    <BrowserRouter>
   
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute/>} >
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminRoute/>} >
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePosts />} />
        
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/post/:postSlug' element={<PostPage/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
};

export default App;
