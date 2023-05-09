import React, { useState, useEffect } from 'react';

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;


type ProfileState = {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
    favorite_genres: string[];
    favorite_artists: string[];
};

const ProfilePage: React.FC = () => {
    const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);


    const [profile, setProfile] = useState<ProfileState>({
        id: '',
        email: '',
        username: '',
        avatar: null,
        favorite_genres: [],
        favorite_artists: [],
    });


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
            favorite_genres: profile.favorite_genres,
            favorite_artists: profile.favorite_artists,
        };
        updateProfile(updatedProfile);
    };

    const redirectToSpotifyAuth = () => {
        const scopes = 'streaming user-read-email user-read-private';
        const encodedScopes = encodeURIComponent(scopes);
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${encodedScopes}`;

        window.location.href = authUrl;
    };

    const fetchSpotifyAccessToken = async (code: any) => {
        try {
            const apiUrl = process.env.REACT_APP_BE_URL;
            const response = await fetch(`${apiUrl}/api/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (response.ok) {
                const data = await response.json();
                setSpotifyAccessToken(data.spotifyAccessToken);
                localStorage.setItem('spotifyAccessToken', data.spotifyAccessToken);
            } else {
                console.error('Error fetching access token:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    };


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetchSpotifyAccessToken(code);
        }
    }, [window.location.search]);

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
                            <input type="email" id="email" value={profile.email} disabled className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                            <input type="text" id="username" value={profile.username} disabled className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="favoriteGenres" className="block text-gray-300 mb-2">Favorite Genres</label>
                            <input type="text" id="favoriteGenres" value={profile.favorite_genres} onChange={(e) => setProfile({ ...profile, favorite_genres: e.target.value.split(', ') })} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="favoriteArtists" className="block text-gray-300 mb-2">Favorite Artists</label>
                            <input type="text" id="favoriteArtists" value={profile.favorite_artists} onChange={(e) => setProfile({ ...profile, favorite_artists: e.target.value.split(', ') })} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" />
                        </div>
                        <button onClick={handleUpdate} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full">Update Profile</button>
                        <button onClick={redirectToSpotifyAuth} className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-green-600 w-full">Connect to Spotify</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
