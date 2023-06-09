import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [avatar, setAvatar] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [isSongListModalOpen, setIsSongListModalOpen] = useState(false);


    const handlePlaylistClick = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
        setIsSongListModalOpen(true);
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAvatar(e.target.files[0]);
            uploadAvatar(e.target.files[0]);  // Call the uploadAvatar function here
        }
    };

    const uploadAvatar = async (avatar: File) => {
        try {
            const token = localStorage.getItem('accessToken');  // Retrieve the authorization token
            const apiUrl = process.env.REACT_APP_BE_URL;
            const formData = new FormData();
            formData.append('avatar', avatar);

            const response = await fetch(`${apiUrl}/users/me/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include the token in the request headers
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Avatar uploaded:', data);
                setProfile(prevProfile => ({ ...prevProfile, avatar: data.avatar }));
                return true;
            } else {
                console.error('Error uploading avatar:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            return false;
        }
    };

    let navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/home');
    };

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
            if (!newPlaylist.SongCards) {
                newPlaylist.SongCards = [];
            }
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
                setPlaylists(playlists);
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

    const deletePlaylist = async (id: string) => {
        const token = localStorage.getItem('accessToken');
        const apiUrl = process.env.REACT_APP_BE_URL;
        const response = await fetch(`${apiUrl}/playlist/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            console.log('Playlist deleted successfully.');
            setPlaylists(playlists.filter(playlist => playlist.id !== id));
        } else {
            console.error('Error deleting playlist:', response.statusText);
        }
    };

    return (
        <>
            <button onClick={navigateToHome} className="absolute top-0 left-0 m-4 bg-blue-500 text-white font-bold py-2 px-4 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div className="bg-black min-h-screen flex items-center">
                <div className="container mx-auto px-4 py-12">
                    <div className="w-full md:w-1/2 mx-auto">
                        <h1 className="text-white text-4xl font-bold mb-8">
                            Your HERTZ Profile
                        </h1>

                        <div className="mb-6">
                            <div className="mb-2">
                                {profile.avatar && (
                                    <img
                                        src={`https://res.cloudinary.com/dpbp2fwoi/image/upload/v1606940285/${profile.avatar}`}
                                        alt="User Avatar"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                )}
                            </div>
                            <label htmlFor="avatar" className="block text-gray-300 mb-2">Avatar</label>
                            <input type="file" id="avatar" ref={fileInputRef} onChange={handleFileChange} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>

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
                                <table className="table-auto bg-gray-800 text-white w-full mt-4">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-center">Name</th>
                                            <th className="px-4 py-2 text-center">Songs</th>
                                            <th className="px-4 py-2 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playlists.map((playlist, index) => (
                                            <tr key={index} className="hover:bg-gray-600 group">
                                                <td className="px-4 py-2 text-center">
                                                    <button onClick={() => handlePlaylistClick(playlist)}>
                                                        {playlist.name}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2 text-center">{playlist.SongCards.length}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => deletePlaylist(playlist.id)}
                                                        className="text-white bg-red-500 px-2 py-1 rounded transition duration-200 ease-in-out hover:bg-red-600 opacity-0 group-hover:opacity-100">Delete</button>
                                                </td>
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

            <Transition show={isSongListModalOpen} as={React.Fragment}>
                <Dialog
                    open={isSongListModalOpen}
                    onClose={() => setIsSongListModalOpen(false)}
                    className="fixed z-10 inset-0 overflow-y-auto"
                    aria-labelledby="modal-title"
                >
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
                            <div className="inline-block bg-gray-800 text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-opacity sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                                <div className="flex justify-between items-center border-b border-gray-700 p-6">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-white">
                                        Playlist: {selectedPlaylist?.name}
                                    </Dialog.Title>
                                    <button onClick={() => setIsSongListModalOpen(false)} className="ml-3 bg-transparent border-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 hover:text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="px-6 py-4 bg-gray-700">
                                    {selectedPlaylist?.SongCards ? (
                                        <table className="table-auto border-collapse w-full">
                                            <thead>
                                                <tr className="rounded-lg text-sm font-medium text-gray-300 text-left" style={{ fontSize: '0.9674rem' }}>
                                                    <th className="px-4 py-2 bg-gray-800" ></th>
                                                    <th className="px-4 py-2 bg-gray-800" >Title</th>
                                                    <th className="px-4 py-2 bg-gray-800" >Album</th>
                                                    <th className="px-4 py-2 bg-gray-800" >Date Added</th>
                                                    <th className="px-4 py-2 bg-gray-800" ></th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm font-normal text-white">
                                                {selectedPlaylist.SongCards.map((songCard: any) => {
                                                    const dateAdded = new Date(songCard.playlist_song_cards.createdAt);
                                                    const now = new Date();
                                                    const diffTime = Math.abs(now.getTime() - dateAdded.getTime());
                                                    const formattedDate = dateAdded.toLocaleDateString();

                                                    return (
                                                        <tr key={songCard.id} className="hover:bg-gray-800 rounded-lg">
                                                            <td className="px-4 py-4">
                                                                <img src={songCard.album_art} alt={songCard.album_title} width="100px" height="100px" />
                                                            </td>
                                                            <td className="px-4 py-4">{songCard.song_title}</td>
                                                            <td className="px-4 py-4">{songCard.album_title}</td>
                                                            <td className="px-4 py-4">{`${formattedDate}`}</td>
                                                            <td className="px-4 py-4">
                                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                                    <a href={songCard.song_url} target="_blank" rel="noreferrer">Listen</a>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>



                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>



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
                                    setPlaylistName('');
                                    setIsNewPlaylistModalOpen(false);
                                }} className="px-6 py-4 bg-gray-700">
                                    <input
                                        value={playlistName}
                                        onChange={(e) => setPlaylistName(e.target.value)}
                                        className="w-full px-3 py-2 text-sm text-gray-300 bg-gray-800 rounded"
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
