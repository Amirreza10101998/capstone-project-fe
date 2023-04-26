import React from 'react';
import SongCard from './SongCard';
import '../styles/FollowingFeed.css'

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
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 3',
            artist: 'Artist Name 3',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 4',
            artist: 'Artist Name 4',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 4',
            artist: 'Artist Name 4',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 5',
            artist: 'Artist Name 5',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 6',
            artist: 'Artist Name 6',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
        {
            imageUrl: 'https://via.placeholder.com/300',
            title: 'Shared Song 7',
            artist: 'Artist Name 7',
            audioUrl: 'https://example.com/audio-url-2.mp3',
        },
    ];

    return (
        <div className="following-feed">
            {sharedSongs.map((song, index) => (
                <SongCard
                    key={`song-${index}`}
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
