import React from 'react';
import TinderCard from 'react-tinder-card';
import { useSwipe } from '../components/SwipeContext';

interface SongCardProps {
    imageUrl: string;
    title: string;
    artist: string;
}

const SongCard: React.FC<SongCardProps> = ({ imageUrl, title, artist }) => {
    const { onSwipe } = useSwipe();

    return (
        <>
            <TinderCard
                onSwipe={onSwipe}
                preventSwipe={['up', 'down']}
            >
                <div className="bg-gray-800 shadow-lg rounded-md p-4">
                    <img src={imageUrl} alt="Song Artwork" className="w-full h-90 object-cover rounded-md" />
                    <h3 className="text-2xl font-bold text-white mt-4">{title}</h3>
                    <p className="text-gray-300">{artist}</p>
                </div>
            </TinderCard>
            <div className="flex justify-center mt-8">
                <button
                    className="bg-red-500 text-white w-16 h-16 rounded-full mr-4 hover:bg-red-600"
                    onClick={() => onSwipe('left')}
                >
                    <i className="fas fa-times" />
                </button>
                <button
                    className="bg-yellow-500 text-white w-16 h-16 rounded-full mx-4 hover:bg-yellow-600"
                    onClick={() => onSwipe('up')}
                >
                    <i className="fas fa-redo" />
                </button>
                <button
                    className="bg-green-500 text-white w-16 h-16 rounded-full ml-4 hover:bg-green-600"
                    onClick={() => onSwipe('right')}
                >
                    <i className="fas fa-heart" />
                </button>
            </div>
        </>
    );
};

export default SongCard;
