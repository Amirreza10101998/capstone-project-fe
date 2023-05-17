import React from 'react';
import { FetchedSongData } from './SongCard';
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
                <span className="shared-by">Shared by</span>
                <img src={userImage || '/default-avatar.png'} alt={username} />
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
        </div>
    );
};

export default SharedSongCard;
