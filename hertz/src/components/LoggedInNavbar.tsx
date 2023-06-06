import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoggedInNavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const LoggedInNavbar: React.FC<LoggedInNavbarProps> = ({ activeTab, setActiveTab }) => {

    const handleSignOut = () => {
        const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.REACT_APP_BE_URL as String;
        fetch(`${apiUrl}/users/session`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                } else {
                    console.error("Error signing out");
                }
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <nav className="bg-black text-white shadow-lg fixed w-full z-10">
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="text-xl font-bold mr-4">
                            <a href="/" className="text-white hover:text-white">
                                HERTZ
                            </a>
                        </div>
                        <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-gray-700">
                            <a href="/profile">Profile</a>
                        </button>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => handleTabClick('discovery')}
                            className={`bg-transparent text-white font-bold py-2 px-4 rounded mr-4
                             ${activeTab === 'discovery' ? 'text-blue-500' : ''
                                }`}
                        >
                            Discovery
                        </button>
                        <button
                            onClick={() => handleTabClick('following')}
                            className={`bg-transparent text-white font-bold py-2 px-4 rounded ml-4
                             ${activeTab === 'following' ? 'text-blue-500' : ''
                                }`}
                        >
                            Following
                        </button>
                        <div
                            className="absolute bottom-0 h-1 w-1/2 bg-blue-500 transition-all duration-300 ease-in-out"
                            style={{
                                marginLeft: '-2rem',
                                left: activeTab === 'discovery' ? '35%' : '91%',
                                transform: activeTab === 'discovery' ? 'translateX(-50%)' : 'translateX(-50%)',
                            }}
                        ></div>
                    </div>
                    <Link to={"/"}>
                        <button
                            onClick={handleSignOut}
                            className="bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4 hover:bg-gray-700"
                        >
                            Sign Out
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default LoggedInNavbar;
//how is my code?
