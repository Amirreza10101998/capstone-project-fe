import React, { useState, useEffect } from 'react';
import PlaylistModal from './PlaylistModal';
import NewPlaylistModal from './NewPlaylistModal';
import { Dialog, Transition } from '@headlessui/react';

type Song = {
    id: string;
    title: string;
    artist: string;
};

type Playlist = {
    id: string;
    name: string;
    songs: Song[];
};

type ProfileState = {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
    favorite_genres: string[];
    favorite_artists: string[];
    playlists: Playlist[];
}


const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<ProfileState>({
        id: '',
        email: '',
        username: '',
        avatar: null,
        favorite_genres: [],
        favorite_artists: [],
        playlists: [],
    });

    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);

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
            setProfile((prevProfile) => ({
                ...prevProfile,
                playlists: [...prevProfile.playlists, newPlaylist],
            }));
        } else {
            console.error('Error creating new playlist:', response.statusText);
        }
    };


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

    useEffect(() => {
        console.log('isNewPlaylistModalOpen', isNewPlaylistModalOpen);
    }, [isNewPlaylistModalOpen]);



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

    const handlePlaylistClick = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
        setIsNewPlaylistModalOpen(true);
        console.log(isNewPlaylistModalOpen);
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
                            <table className="w-full bg-gray-800 text-white mt-4">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profile.playlists?.map(playlist => (
                                        <tr key={playlist.id} onClick={() => handlePlaylistClick(playlist)}>
                                            <td>{playlist.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {selectedPlaylist && <PlaylistModal playlist={selectedPlaylist} onClose={() => setSelectedPlaylist(null)} />}

                        <Transition show={isNewPlaylistModalOpen} as={React.Fragment}>
                            <Dialog
                                as="div"
                                className="fixed inset-0 z-10 overflow-y-auto"
                                onClose={() => setIsNewPlaylistModalOpen(false)}
                            >
                                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                    <Transition.Child
                                        as={React.Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Dialog.Overlay className="fixed inset-0 transition-opacity" />
                                    </Transition.Child>

                                    {/* This element is to trick the browser into centering the modal contents. */}
                                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                    <Transition.Child
                                        as={React.Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                            <NewPlaylistModal onClose={() => setIsNewPlaylistModalOpen(false)} onCreate={createNewPlaylist} />
                                        </div>
                                    </Transition.Child>
                                </div>
                            </Dialog>
                        </Transition>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
