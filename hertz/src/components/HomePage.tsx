// HomePage.tsx

import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import SongCard from '../components/SongCard';
import FollowingFeed from '../components/FollowingFeed';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
    const song = {
        imageUrl: 'https://via.placeholder.com/300',
        title: 'Song Title',
        artist: 'Artist Name',
        audioUrl: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
    };

    // Get activeTab state from LoggedInNavbar
    const [activeTab, setActiveTab] = React.useState('discovery');

    return (
        <div className="bg-black min-h-screen card-wrapper">
            <LoggedInNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="container mx-auto px-4 h-full">
                <div className="flex justify-center items-center min-h-screen pt-16">
                    <div className="w-full max-w-md">
                        {activeTab === 'discovery' ? (
                            <SongCard
                                imageUrl={song.imageUrl}
                                title={song.title}
                                artist={song.artist}
                                audioUrl={song.audioUrl}
                            />
                        ) : (
                            <FollowingFeed />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
