import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { ImCross } from 'react-icons/im';
import { MdThumbUp, MdThumbDown, MdOutlineComment } from 'react-icons/md';
import '../styles/SongCard.css';
import { ClipLoader } from 'react-spinners';
import SpotifyWebPlayback from 'react-spotify-web-playback';
import { Dialog, Transition } from '@headlessui/react';


interface SongCardProps {
    id: string;
    imageUrl: string;
    title: string;
    artist: string;
    audioUrl: string;
    spotifyAccessToken: string | null;
    isConnectedToSpotify?: boolean;
    variant?: 'discovery' | 'following';
}

export interface FetchedSongData {
    id: string;
    album_art: string;
    song_title: string;
    artist: string;
    song_url: string;
    spotify_id: string;
}

interface User {
    id: string;
    username: string;
    avatar: string | null;
}

interface SongCard {
    // Define the properties of a SongCard object here
}

interface Playlist {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    SongCardId: string | null;
    createdAt: string;
    updatedAt: string;
    User: User;
    SongCards: SongCard[];
}


type TinderCardApi = {
    swipe: (dir: 'left' | 'right') => void;
    restoreCard: () => void;
};

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;


const SongCard: React.FC<SongCardProps> = ({ imageUrl, title, artist, audioUrl, variant = 'discovery' }) => {
    const [lastDirection, setLastDirection] = useState<string>();
    const [heartClicked, setHeartClicked] = useState(false);
    const [crossClicked, setCrossClicked] = useState(false);
    const [songData, setSongData] = useState<SongCardProps[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem("accessToken")
    );
    const [playing, setPlaying] = useState(false);
    const childRef = useRef<TinderCardApi | null>(null);
    const [isConnectedToSpotify, setIsConnectedToSpotify] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSong, setCurrentSong] = useState<SongCardProps | null>(null);
    const [isShareFormOpen, setIsShareFormOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');

    const [isPlaylistFormOpen, setIsPlaylistFormOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
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
        const songCardId = currentSong?.id;  // assuming you have an id field in the currentSong object

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

            setIsShareFormOpen(false);
            setIsModalOpen(false);
            setIsPlaylistFormOpen(false)

        } else {
            console.error('Error adding song to playlist:', response.statusText);
        }
    }

    const handleShare = async (e: any) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.REACT_APP_BE_URL;
            const response = await fetch(`${apiUrl}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: shareMessage,
                    songCardId: currentSong?.id,
                }),
            });

            if (response.ok) {
                console.log('Successfully shared the song!');
            } else {
                console.error('Error while sharing the song:', response.statusText);
            }
        } catch (error) {
            console.error('Error while sharing the song:', error);
        }

        setIsShareFormOpen(false);
        setShareMessage('');
        setIsModalOpen(false);
    }


    useEffect(() => {
        const storedAccessToken = localStorage.getItem('spotifyAccessToken');
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
            setIsConnectedToSpotify(true);
            console.log("working")
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log('Code:', code);

            if (code) {
                fetchSpotifyAccessToken(code).then(() => {
                    setIsConnectedToSpotify(true);
                }).catch(error => {
                    console.error('Error fetching access token:', error);
                });
            }
        }
    }, [window.location.search]);



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
                const expirationTime = new Date().getTime() + (data.expires_in * 1000);

                setAccessToken(data.accessToken);
                localStorage.setItem('spotifyAccessToken', data.accessToken);
                localStorage.setItem('spotifyTokenExpiration', expirationTime.toString());

                console.log('Access token fetched and stored:', data.accessToken);
            } else {
                console.error('Error fetching access token:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    };


    const handleConnectToSpotify = () => {
        redirectToSpotifyAuth();
    };

    const fetchSongData = async () => {
        try {
            setLoading(true);
            const token = accessToken;
            const apiUrl = process.env.REACT_APP_BE_URL;
            const response = await fetch(`${apiUrl}/feed/discovery`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const fetchedData = await response.json();
                console.log('fetchedData:', fetchedData); // Inspect the fetched data
                const mappedData: SongCardProps[] = fetchedData.result.map((song: FetchedSongData) => ({
                    id: song.id,
                    imageUrl: song.album_art,
                    title: song.song_title,
                    artist: song.artist,
                    audioUrl: `spotify:track:${song.spotify_id}`
                }));
                setSongData((prevSongData) => (prevSongData ? [...prevSongData, ...mappedData] : mappedData));
            } else {
                console.error('Error fetching song data:', response.statusText);
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching song data:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongData();
    }, []);

    useEffect(() => {
        if (songData && currentIndex === songData.length - 1) {
            fetchSongData();
        }
    }, [currentIndex, songData]);

    const swiped = (direction: 'left' | 'right') => {
        setLastDirection(direction);
        setPlaying(false);
        if (songData) {
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 1000);
        }
        if (direction === 'right') {
            setIsModalOpen(true);
            if (songData) {
                setCurrentSong(songData[currentIndex]);
            }
        }
    };


    const swipe = (dir: 'left' | 'right') => {
        if (childRef?.current) {
            childRef.current.swipe(dir);
        }
    };

    const handleHeartClick = () => {
        swipe('right');
        setHeartClicked(true);
        setTimeout(() => {
            setHeartClicked(false);
            setIsModalOpen(true);
            if (songData) {
                setCurrentSong(songData[currentIndex]);
            }
        }, 600);
    };



    const handleCrossClick = () => {
        swipe('left');
        setCrossClicked(true);
        setTimeout(() => {
            setCrossClicked(false);
        }, 300);
    };

    const renderFollowingIcons = () => {
        if (variant !== 'following') return null;

        return (
            <div className="icon-container">
                <MdThumbUp className="icon" />
                <MdThumbDown className="icon" />
                <MdOutlineComment className="icon" />
            </div>
        );
    };

    function useOverflowing(ref: any) {
        const [isOverflowing, setOverflowing] = useState(false);

        useEffect(() => {
            if (ref.current) {
                setOverflowing(ref.current.offsetWidth < ref.current.scrollWidth);
            }
        }, [ref]);

        return isOverflowing;
    }


    const CardContent: React.FC<SongCardProps> = ({ imageUrl, title, artist, isConnectedToSpotify }) => {
        const titleRef = useRef(null);
        const isTitleOverflowing = useOverflowing(titleRef);

        return (
            <div onClick={() => setPlaying(true)} className="card-container">
                {renderFollowingIcons()}
                <div className="image-container">
                    <img
                        src={imageUrl}
                        alt="Song Artwork"
                        className="w-full h-100 object-cover"
                    />
                </div>
                <h3 ref={titleRef} className={`text-2xl font-bold text-gray-800 mt-4 ${isTitleOverflowing ? 'marquee' : ''} text-center`}>{title}</h3>
                <p className="text-gray-500 text-center">{artist}</p>
                {!isConnectedToSpotify ? (
                    <button
                        className="connect-spotify-button"
                        onClick={handleConnectToSpotify}
                    >
                        Connect to Spotify to play music
                    </button>
                ) : (
                    <SpotifyWebPlayback
                        token={accessToken as string}
                        uris={playing ? (songData && songData[currentIndex].audioUrl ? [songData[currentIndex].audioUrl] : []) : []}
                        autoPlay={playing}
                        syncExternalDevice={true}
                        styles={{
                            activeColor: '#1db954',
                            bgColor: '#282828',
                            color: '#fff',
                            loaderColor: '#1db954',
                            sliderColor: '#1db954',
                            trackArtistColor: '#ccc',
                            trackNameColor: '#fff',
                        }}
                    />
                )}
            </div>
        );
    };





    return (
        <>
            {!loading && songData && songData.length > 0 ? (
                <>
                    {
                        variant === 'discovery' ? (
                            <TinderCard
                                key={currentIndex}
                                ref={childRef as any}
                                onSwipe={(dir) => {
                                    if (dir === 'left' || dir === 'right') {
                                        swiped(dir);
                                    }
                                }}
                                className="tinderCard"
                            >
                                <div className={`fade-in`}>
                                    <CardContent {...songData[currentIndex]} isConnectedToSpotify={isConnectedToSpotify} />
                                </div>
                            </TinderCard>
                        ) : (
                            <CardContent {...songData[currentIndex]} isConnectedToSpotify={isConnectedToSpotify} />

                        )
                    }
                    {variant === 'discovery' && (
                        <div className="flex justify-center mt-8">
                            <div
                                className={`bg-gray-700 w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${crossClicked ? 'cross-clicked' : ''}`}
                                onClick={handleCrossClick}
                            >
                                <ImCross className="text-red-500" size={30} />
                            </div>
                            <div
                                className={`bg-gray-700 w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${heartClicked ? 'heart-clicked' : ''}`}
                                onClick={handleHeartClick}
                            >
                                <BsFillSuitHeartFill className="text-blue-500" size={30} />
                            </div>
                        </div>
                    )}

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
                                        {isShareFormOpen ? (
                                            <>
                                                <div className="flex justify-between items-center border-b border-gray-700 p-6">
                                                    <button onClick={() => setIsShareFormOpen(false)} className="ml-3 bg-transparent border-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 hover:text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                        </svg>
                                                    </button>
                                                    <div className="flex items-center space-x-4">
                                                        <img className="h-24 w-24" src={currentSong?.imageUrl} alt="Album Cover" />
                                                        <div>
                                                            <h4 className="text-lg font-medium text-white">{currentSong?.title}</h4>
                                                            <p className="text-sm text-gray-500">{currentSong?.artist}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <form onSubmit={handleShare} className="px-6 py-4 bg-gray-700">
                                                    <textarea
                                                        value={shareMessage}
                                                        onChange={(e) => setShareMessage(e.target.value)}
                                                        className="w-full px-3 py-2 text-sm  text-gray-300 bg-gray-800 rounded"
                                                        placeholder="Write a caption..."
                                                        required
                                                    />
                                                    <button type="submit" className="px-4 py-2 mt-2 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded">Post</button>
                                                </form>
                                            </>
                                        ) : isPlaylistFormOpen ? (
                                            <>
                                                <div className="flex justify-between items-center border-b border-gray-700 p-6">
                                                    <button onClick={() => setIsPlaylistFormOpen(false)} className="ml-3 bg-transparent border-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 hover:text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                        </svg>
                                                    </button>
                                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-white">
                                                        Select a Playlist
                                                    </Dialog.Title>
                                                </div>
                                                <div className="px-6 py-4 bg-gray-700">
                                                    {userPlaylists.map(playlist => (
                                                        <button
                                                            key={playlist.id}
                                                            type="button"
                                                            className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded"
                                                            onClick={() => handleAddToPlaylist(playlist.id)}>
                                                            {playlist.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center border-b border-gray-700 p-6">
                                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-white">
                                                        Congratulations!
                                                    </Dialog.Title>
                                                    <button onClick={() => setIsModalOpen(false)} className="ml-3 bg-transparent border-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 hover:text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="px-6 py-4">
                                                    <div className="flex items-center space-x-4">
                                                        <img className="h-24 w-24" src={currentSong?.imageUrl} alt="Album Cover" />
                                                        <div>
                                                            <h4 className="text-lg font-medium text-white">{currentSong?.title}</h4>
                                                            <p className="text-sm text-gray-500">{currentSong?.artist}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Dialog.Description as="div" className="px-6 py-4 text-sm text-gray-500">
                                                    You've liked a song! What would you like to do next?
                                                </Dialog.Description>
                                                <div className="px-6 py-4 bg-gray-700 flex justify-between">
                                                    <button type="button" className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded" onClick={() => setIsShareFormOpen(true)}>Share</button>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded"
                                                        onClick={async () => {
                                                            await fetchPlaylists();
                                                            setIsPlaylistFormOpen(true);
                                                        }}>
                                                        Add to Playlist
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Transition.Child>
                            </div >
                        </Dialog >
                    </Transition >



                </>
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    <ClipLoader color="#4A90E2" size={50} />
                </div>
            )
            }
        </>
    );
};


export default SongCard;