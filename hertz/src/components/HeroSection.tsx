import React from 'react';
import { FaApple, FaAndroid } from 'react-icons/fa';
import { AiFillAndroid } from 'react-icons/ai'
import "../styles/Hero.css"
import { Link } from 'react-router-dom';

interface HeroSectionProps {
    imgSrc: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ imgSrc }) => {
    return (
        <div className="bg-black py-20">
            <div className="container mx-auto">
                <div className="flex flex-wrap items-center">
                    <div className="w-full md:w-1/2">
                        <h1 className="text-4xl md:text-5xl text-white font-bold">
                            Share Your Love for <a className="text-blue-500">Music</a> With Friends
                        </h1>
                        <p className="text-gray-300 mt-4 text-lg md:text-xl">
                            HERTZ is a social platform that allows you to keep track of all the music you
                            listen to and grow your passion for music with friends.
                        </p>
                        <Link to={"/register"}>
                            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-20 hover:bg-blue-600">
                                Create Account
                            </button>
                        </Link>
                        <div className="inline-flex items-center ml-4 mt-4">
                            <p className="text-gray-300 mr-2">Or download our app on</p>
                            <a href="https://apps.apple.com/" className="mx-2 hover:text-white">
                                <FaApple style={{ fontSize: "30px" }} className="text-gray-300 text-xl transition-all duration-200" />
                            </a>
                            <a href="https://play.google.com/" className="mx-2 hover:text-white">
                                <AiFillAndroid style={{ fontSize: "30px" }} className="text-gray-300 text-xl transition-all duration-200" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 mt-8 md:mt-0 text-center relative">
                        <div className="img-container w-full md:w-3/4 mx-auto">
                            <img src={imgSrc} alt="Hero" className="w-full h-full object-cover" />
                            <div className="fade-overlay"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
