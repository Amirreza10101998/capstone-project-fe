// HomePage.tsx

import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import SongCard from '../components/SongCard';
import FollowingFeed from '../components/FollowingFeed';
import '../styles/HomePage.css';
import { Col, Container, Row } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

const HomePage: React.FC = () => {
    const song = {
        imageUrl: 'https://preview.redd.it/expanding-kanye-wests-graduation-album-cover-art-v0-ec77yjkqxd991.png?width=640&crop=smart&auto=webp&s=c7141cd720a18b9ff48574f2eb46e658a87316be',
        title: 'Song Title',
        artist: 'Artist Name',
        audioUrl: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
    };

    // Get activeTab state from LoggedInNavbar
    const [activeTab, setActiveTab] = React.useState('discovery');

    return (
        <div className="bg-black min-h-screen card-wrapper">
            <LoggedInNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Container fluid className="min-h-screen pt-16">
                <Row className="justify-content-center align-items-center min-h-screen">
                    <Col xs={12} md={6} lg={3}>
                        <CSSTransition
                            in={activeTab === 'discovery'}
                            timeout={300}
                            classNames="slide"
                            unmountOnExit
                            mountOnEnter
                        >
                            <SongCard
                                imageUrl={song.imageUrl}
                                title={song.title}
                                artist={song.artist}
                                audioUrl={song.audioUrl}
                            />
                        </CSSTransition>
                        <CSSTransition
                            in={activeTab !== 'discovery'}
                            timeout={300}
                            classNames="slide"
                            unmountOnExit
                            mountOnEnter
                        >
                            <FollowingFeed />
                        </CSSTransition>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;