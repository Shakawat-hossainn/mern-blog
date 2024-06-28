import React from "react";
import { Footer as FlowbiteFooter } from "flowbite-react"; // Rename the imported Footer component to FlowbiteFooter
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

const Footer = () => {
  return (
    <FlowbiteFooter container className="border border-t-8 border-teal-500 foot "> {/* Use FlowbiteFooter instead of Footer from flowbite-react */}
      <div className="w-full ">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="mb-3">
    <span className="rounded text-3xl p-1 self-center relative   whitespace-nowrap bg-gradient-to-r from-indigo-500 via-purple-500 to-green-200  font-semibold dark:text-white" >Shakawat's </span><span  className="text-3xl relative  font-semibold dark:text-white">Blog</span>
    </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FlowbiteFooter.Title title="about" />
              <FlowbiteFooter.LinkGroup col>
                <FlowbiteFooter.Link href="#">Shakawat's Blog</FlowbiteFooter.Link>
                <FlowbiteFooter.Link href="#">More about the Blog</FlowbiteFooter.Link>
              </FlowbiteFooter.LinkGroup>
            </div>
            <div>
              <FlowbiteFooter.Title title="Follow us" />
              <FlowbiteFooter.LinkGroup col>
                <FlowbiteFooter.Link href="#">Github</FlowbiteFooter.Link>
                <FlowbiteFooter.Link href="#">Discord</FlowbiteFooter.Link>
              </FlowbiteFooter.LinkGroup>
            </div>
            <div>
              <FlowbiteFooter.Title title="Legal" />
              <FlowbiteFooter.LinkGroup col>
                <FlowbiteFooter.Link href="#">Privacy Policy</FlowbiteFooter.Link>
                <FlowbiteFooter.Link href="#">Terms &amp; Conditions</FlowbiteFooter.Link>
              </FlowbiteFooter.LinkGroup>
            </div>
          </div>
        </div>
        <FlowbiteFooter.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FlowbiteFooter.Copyright href="#" by="Shakawat's Blog" year={new Date().getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FlowbiteFooter.Icon href="#" icon={BsFacebook} />
            <FlowbiteFooter.Icon href="#" icon={BsInstagram} />
            <FlowbiteFooter.Icon href="#" icon={BsTwitter} />
            <FlowbiteFooter.Icon href="#" icon={BsGithub} />
            <FlowbiteFooter.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </FlowbiteFooter>
  );
};

export default Footer;
