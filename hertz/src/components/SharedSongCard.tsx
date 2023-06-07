import React, { useState } from 'react';
import { FetchedSongData } from './SongCard';
import { HiOutlinePlus } from 'react-icons/hi'
import '../styles/SharedSongCard.css'
import { Dialog, Transition } from '@headlessui/react';

interface SharedSongCardProps {
    id: string;
    username: string;
    userImage: string | null;
    songData: any;
    content: string;
}

interface Playlist {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    SongCardId: string | null;
    createdAt: string;
    updatedAt: string;
}


const SharedSongCard: React.FC<SharedSongCardProps> = ({ username, userImage, songData, content }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlaylistFormOpen, setIsPlaylistFormOpen] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);

    const fetchPlaylists = async () => {
        const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.REACT_APP_BE_URL;
        const response = await fetch(`${apiUrl}/playlist`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const playlists = await response.json();
            setUserPlaylists(playlists);
            console.log('Fetched Playlists:', playlists);
        } else {
            console.error('Error fetching playlists:', response.statusText);
        }
    };

    const handleAddToPlaylist = async (playlistId: any) => {
        const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.REACT_APP_BE_URL;
        const songCardId = songData.id;  // changed currentSong to songData

        if (!songCardId) {
            console.error('No current song selected');
            return;
        }

        const response = await fetch(`${apiUrl}/playlist/${playlistId}/addSong`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songCardId }),
        });

        if (response.ok) {
            console.log('Song added to playlist');

            setIsModalOpen(false);
            setIsPlaylistFormOpen(false)
        } else {
            console.error('Error adding song to playlist:', response.statusText);
        }
    }

    const handleButtonClick = () => {
        fetchPlaylists();
        setIsModalOpen(true);
        setIsPlaylistFormOpen(true);
    };

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

            <button className="plus-button" onClick={handleButtonClick}>
                <HiOutlinePlus />
            </button>

            <Transition show={isModalOpen} as={React.Fragment}>
                <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <Transition.Child
                            enter="transition-opacity duration-500 ease-in-out"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-500 ease-in-out"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="inline-block bg-gray-800 text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-opacity sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                {isPlaylistFormOpen && (
                                    <>
                                        <div className="flex justify-between items-center border-b border-gray-700 p-6">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-white">
                                                Select a Playlist
                                            </Dialog.Title>
                                            <button onClick={() => setIsModalOpen(false)} className="ml-3 bg-transparent border-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 hover:text-white">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="px-6 py-4 bg-gray-700">
                                            {userPlaylists.map(playlist => (
                                                <button
                                                    key={playlist.id}
                                                    type="button"
                                                    className="block w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded mt-2"
                                                    onClick={() => handleAddToPlaylist(playlist.id)}>
                                                    {playlist.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default SharedSongCard;
