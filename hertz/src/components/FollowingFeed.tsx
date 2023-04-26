// FollowingFeed.tsx

import React from 'react';
import SongCard from './SongCard';

const FollowingFeed: React.FC = () => {
    // Sample shared song data, replace this with API data later
    const sharedSongs = [
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 1',
            artist: 'Artist Name 1',
            audioUrl: 'https://example.com/audio-url-1.mp3',
        },
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 2',
            artist: 'Artist Name 2',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
    ];

    return (
        <div>
            {sharedSongs.map((song, index) => (
                <SongCard
                    key={index}
                    imageUrl={song.imageUrl}
                    title={song.title}
                    artist={song.artist}
                    audioUrl={song.audioUrl}
                    variant="following"
                />
            ))}
        </div>
    );
};

export default FollowingFeed;
