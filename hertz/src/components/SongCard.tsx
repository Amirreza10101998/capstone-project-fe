import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { GiAnticlockwiseRotation } from 'react-icons/gi';
import { ImCross } from 'react-icons/im';
import { MdThumbUp, MdThumbDown, MdOutlineComment } from 'react-icons/md';
import '../styles/SongCard.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { ClipLoader } from 'react-spinners';

interface SongCardProps {
    imageUrl: string;
    title: string;
    artist: string;
    audioUrl: string;
    variant?: 'discovery' | 'following';
}

interface FetchedSongData {
    album_art: string;
    song_title: string;
    artist: string;
    song_url: string;
}

type TinderCardApi = {
    swipe: (dir: 'left' | 'right') => void;
    restoreCard: () => void;
};

const SongCard: React.FC<SongCardProps> = ({ imageUrl, title, artist, audioUrl, variant = 'discovery' }) => {
    const [lastDirection, setLastDirection] = useState<string>();
    const [heartClicked, setHeartClicked] = useState(false);
    const [crossClicked, setCrossClicked] = useState(false);
    const [songData, setSongData] = useState<SongCardProps[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const childRef = useRef<TinderCardApi | null>(null);

    const fetchSongData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
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
                const mappedData: SongCardProps[] = fetchedData.result.map((song: FetchedSongData) => ({
                    imageUrl: song.album_art,
                    title: song.song_title,
                    artist: song.artist,
                    audioUrl: song.song_url,
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
        if (songData) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
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

    const CardContent: React.FC<SongCardProps> = ({ imageUrl, title, artist, audioUrl }) => (
        <div className="card-container">
            {renderFollowingIcons()}
            <div className="image-container">
                <img src={imageUrl} alt="Song Artwork" className="w-full h-100 object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4">{title}</h3>
            <p className="text-gray-500">{artist}</p>
            <AudioPlayer
                src={audioUrl}
                customAdditionalControls={[]}
                customVolumeControls={[]}
                autoPlayAfterSrcChange={false}
                className="w-full"
            />
        </div>
    );

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
                                <CardContent {...songData[currentIndex]} />
                            </TinderCard>
                        ) : (
                            <CardContent {...songData[currentIndex]} />
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