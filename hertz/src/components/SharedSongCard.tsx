import React from 'react';
import { FetchedSongData } from './SongCard';
import { HiOutlinePlus } from 'react-icons/hi'
import '../styles/SharedSongCard.css'

interface SharedSongCardProps {
    id: string;
    username: string;
    userImage: string | null;
    songData: FetchedSongData;
    content: string;
}

const SharedSongCard: React.FC<SharedSongCardProps> = ({ username, userImage, songData, content }) => {
    return (
        <div className="shared-song-card">
            <div className="user-details">
                <span className="shared-by">Shared by:</span>
                <img className='ml-2' src={userImage ? `https://res.cloudinary.com/dpbp2fwoi/image/upload/${userImage}` : '/default-avatar.png'} alt={username} />
                <span>{username}</span>
            </div>

            <div className="image-container">
                <img src={songData.album_art} alt={songData.song_title} />
            </div>

            <div className="song-details">
                <h3>{songData.song_title}</h3>
                <p>{songData.artist}</p>
            </div>

            <div className="caption">
                <p>{content}</p>
            </div>

            <button className="plus-button">
                <HiOutlinePlus />
            </button>
        </div>
    );
};

export default SharedSongCard;
