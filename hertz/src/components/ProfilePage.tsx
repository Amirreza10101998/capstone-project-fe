import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type Playlist = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    SongCardId: string | null;
    createdAt: string;
    updatedAt: string;
    User: {
        id: string;
        username: string;
        avatar: string | null;
    };
    SongCards: any[];
}


type ProfileState = {
    id: string;
    email: string;
    username: string;
    avatar: null | string;
    favorite_genres: string[];
    favorite_artists: string[];
    refreshToken: string;
    googleId: null | string;
};



const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<ProfileState>({
        id: '',
        email: '',
        username: '',
        avatar: null,
        favorite_genres: [],
        favorite_artists: [],
        refreshToken: '',
        googleId: null
    });

    const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlists, setPlaylists] = useState<Playlist[]>([]);



    const createNewPlaylist = async (name: string) => {
        const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.REACT_APP_BE_URL;
        const response = await fetch(`${apiUrl}/playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });

        if (response.ok) {
            const newPlaylist = await response.json();
            setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
        } else {
            console.error('Error creating new playlist:', response.statusText);
        }
    };




    useEffect(() => {
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
                setPlaylists(playlists); // <-- change this line
                console.log('Fetched Playlists:', playlists);
            } else {
                console.error('Error fetching playlists:', response.statusText);
            }
        };

        fetchPlaylists();
    }, []);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const apiUrl = process.env.REACT_APP_BE_URL;
                const response = await fetch(`${apiUrl}/users/me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile({
                        ...data,
                        favorite_genres: data.favorite_genres,
                        favorite_artists: data.favorite_artists,
                    });
                } else {
                    console.error('Error fetching user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchProfile();
    }, []);


    const updateProfile = async (updatedProfile: Partial<ProfileState>) => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.REACT_APP_BE_URL;
            const response = await fetch(`${apiUrl}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProfile),
            });

            if (response.ok) {
                const data = await response.json();
                setProfile({
                    ...data,
                    favorite_genres: data.favorite_genres,
                    favorite_artists: data.favorite_artists,
                });
                setIsUpdated(true);
                console.log('Profile updated successfully:', data);
            } else {
                console.error('Error updating user profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleUpdate = () => {
        const updatedProfile: Partial<ProfileState> = {
            email: profile.email,
            username: profile.username,
            favorite_genres: profile.favorite_genres,
            favorite_artists: profile.favorite_artists,
        };
        updateProfile(updatedProfile);
    };

    return (
        <>
            <div className="bg-black min-h-screen flex items-center">
                <div className="container mx-auto px-4 py-12">
                    <div className="w-full md:w-1/2 mx-auto">
                        <h1 className="text-white text-4xl font-bold mb-8">
                            Your HERTZ Profile
                        </h1>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                            <input type="email" id="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                            <input type="text" id="username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="favoriteGenres" className="block text-gray-300 mb-2">Favorite Genres</label>
                            <input type="text" id="favoriteGenres" value={profile.favorite_genres} onChange={(e) => setProfile({ ...profile, favorite_genres: e.target.value.split(', ') })} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="favoriteArtists" className="block text-gray-300 mb-2">Favorite Artists</label>
                            <input type="text" id="favoriteArtists" value={profile.favorite_artists} onChange={(e) => setProfile({ ...profile, favorite_artists: e.target.value.split(', ') })} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <button onClick={handleUpdate} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full">
                            {isUpdated ? "Profile Updated!" : "Update Profile"}
                        </button>
                        <div className="mb-6">
                            <h2 className="text-white text-3xl font-bold mb-4 mt-4">Playlists</h2>
                            <button onClick={() => setIsNewPlaylistModalOpen(true)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full">Create New Playlist</button>

                            {playlists && playlists.length > 0 ? (
                                <table className="table-auto bg-white text-black w-full mt-4">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">ID</th>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Songs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playlists.map((playlist, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                                <td className="border px-4 py-2">{playlist.id}</td>
                                                <td className="border px-4 py-2">{playlist.name}</td>
                                                <td className="border px-4 py-2">{playlist.SongCards ? playlist.SongCards.length : 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-white mt-4">No playlists yet</p>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            <Transition show={isNewPlaylistModalOpen} as={React.Fragment}>
                <Dialog open={isNewPlaylistModalOpen} onClose={() => setIsNewPlaylistModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title">
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
                                <div className="flex justify-between items-center border-b border-gray-700 p-6">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-white">
                                        Create New Playlist
                                    </Dialog.Title>
                                    <button onClick={() => setIsNewPlaylistModalOpen(false)} className="ml-3 bg-transparent border-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 hover:text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    createNewPlaylist(playlistName);
                                    setIsNewPlaylistModalOpen(false);
                                }} className="px-6 py-4 bg-gray-700">
                                    <input
                                        value={playlistName}
                                        onChange={(e) => setPlaylistName(e.target.value)}
                                        className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-800 rounded"
                                        placeholder="Enter playlist name..."
                                        required
                                    />
                                    <button type="submit" className="px-4 py-2 mt-2 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded">Create</button>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

        </>
    );
};

export default ProfilePage;
