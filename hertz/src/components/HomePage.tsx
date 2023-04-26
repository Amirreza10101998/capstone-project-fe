import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import SongCard from '../components/SongCard';



const HomePage: React.FC = () => {
    const song = {
        imageUrl: 'https://via.placeholder.com/300',
        title: 'Song Title',
        artist: 'Artist Name',
        audioUrl: 'https://example.com/audio-url.mp3',
    };

    return (
        <div className="bg-black min-h-screen">
            <LoggedInNavbar />
            <div className="container mx-auto px-4 h-full">
                <div className="flex justify-center items-center min-h-screen pt-16">
                    <div className="w-full max-w-md">
                        <SongCard imageUrl={song.imageUrl} title={song.title} artist={song.artist} audioUrl={song.audioUrl} />
                        <div className="flex justify-center mt-8">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
