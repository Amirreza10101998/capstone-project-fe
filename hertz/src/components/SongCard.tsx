import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { GiAnticlockwiseRotation } from 'react-icons/gi';
import { ImCross } from 'react-icons/im';
import { MdThumbUp, MdThumbDown, MdOutlineComment } from 'react-icons/md';
import '../styles/SongCard.css';
import { ClipLoader } from 'react-spinners';
import SpotifyWebPlayback from 'react-spotify-web-playback';

interface SongCardProps {
    imageUrl: string;
    title: string;
    artist: string;
    audioUrl: string;
    spotifyAccessToken: string | null;
    isConnectedToSpotify?: boolean;
    variant?: 'discovery' | 'following';
}

interface FetchedSongData {
    album_art: string;
    song_title: string;
    artist: string;
    song_url: string;
    spotify_id: string;
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

    useEffect(() => {
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
                setAccessToken(data.accessToken); // replace data.spotifyAccessToken with data.accessToken
                localStorage.setItem('spotifyAccessToken', data.accessToken); // replace data.spotifyAccessToken with data.accessToken
                console.log('Access token fetched and stored:', data.accessToken); // replace data.spotifyAccessToken with data.accessToken
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
    };

    const swipe = (dir: 'left' | 'right') => {
        if (childRef?.current) {
            childRef.current.swipe(dir); // Swipe the card!
        }
    };

    const goBack = async () => {
        await childRef?.current?.restoreCard();
    };

    const handleHeartClick = () => {
        swipe('right');
        setHeartClicked(true);
        setTimeout(() => {
            setHeartClicked(false);
        }, 300);
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



    const CardContent: React.FC<SongCardProps> = ({ imageUrl, title, artist, audioUrl, isConnectedToSpotify, spotifyAccessToken }) => {
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
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{title}</h3>
                <p className="text-gray-500">{artist}</p>
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
                            <button
                                className={`bg-gray-700 w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${crossClicked ? 'cross-clicked' : ''}`}
                                onClick={() => goBack()}
                            >
                                <GiAnticlockwiseRotation className="text-yellow-500" size={30} />
                            </button>
                            <div
                                className={`bg-gray-700 w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${heartClicked ? 'heart-clicked' : ''}`}
                                onClick={handleHeartClick}
                            >
                                <BsFillSuitHeartFill className="text-blue-500" size={30} />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-center items-center min-h-screen">
                    <ClipLoader color="#4A90E2" size={50} />
                </div>
            )}
        </>
    );
};


export default SongCard;