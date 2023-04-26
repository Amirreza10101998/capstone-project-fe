import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { GiAnticlockwiseRotation } from 'react-icons/gi'
import { ImCross } from 'react-icons/im'
import '../styles/SongCard.css'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'; // Import default styles

interface SongCardProps {
    imageUrl: string;
    title: string;
    artist: string;
    audioUrl: string;
}

type TinderCardApi = {
    swipe: (dir: 'left' | 'right') => void;
    restoreCard: () => void;
};

const SongCard: React.FC<SongCardProps> = ({ imageUrl, title, artist, audioUrl }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastDirection, setLastDirection] = useState<string>();
    const currentIndexRef = useRef(currentIndex);
    const [heartClicked, setHeartClicked] = useState(false);
    const [crossClicked, setCrossClicked] = useState(false);

    const childRefs = useMemo(
        () =>
            Array(1) // Assuming you only have one song card
                .fill(0)
                .map((i) => React.createRef<TinderCardApi>()),
        []
    );

    const swiped = (direction: 'left' | 'right') => {
        setLastDirection(direction);
        setCurrentIndex((prevIndex) => prevIndex - 1);
        currentIndexRef.current = currentIndex;
    };

    const swipe = (dir: 'left' | 'right') => {
        if (currentIndex >= 0 && childRefs[currentIndex]?.current) {
            childRefs[currentIndex].current!.swipe(dir); // Swipe the card!
        }
    };

    const goBack = async () => {
        if (currentIndex >= 0) return;
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        currentIndexRef.current = newIndex;
        await childRefs[newIndex]?.current?.restoreCard();
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

    return (
        <>
            <TinderCard
                ref={childRefs[currentIndex] as any}
                onSwipe={(dir) => {
                    if (dir === 'left' || dir === 'right') {
                        swiped(dir);
                    }
                }}
                preventSwipe={['up', 'down']}
            >
                <div className="card-container">
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
            </TinderCard>
            <div className="flex justify-center mt-8">
                <div
                    className={`bg-white w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${crossClicked ? 'cross-clicked' : ''}`}
                    onClick={handleCrossClick}
                >
                    <ImCross className="text-red-500" size={30} />
                </div>
                <button
                    className={`bg-white w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${crossClicked ? 'cross-clicked' : ''}`}
                    onClick={() => goBack()}
                >
                    <GiAnticlockwiseRotation className="text-yellow-500" size={30} />
                </button>
                <div
                    className={`bg-white w-16 h-16 rounded-full ml-4 cursor-pointer flex items-center justify-center ${heartClicked ? 'heart-clicked' : ''}`}
                    onClick={handleHeartClick}
                >
                    <BsFillSuitHeartFill className="text-blue-500" size={30} />
                </div>
            </div>
        </>
    );
};

export default SongCard;
