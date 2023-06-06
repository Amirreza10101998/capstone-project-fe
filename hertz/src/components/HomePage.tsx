import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import SongCard from '../components/SongCard';
import FollowingFeed from '../components/FollowingFeed';
import '../styles/HomePage.css';
import { Col, Container, Row } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

const HomePage: React.FC = () => {
    const song = {
        id: '',
        imageUrl: '',
        title: '',
        artist: '',
        audioUrl: '',
    };

    const [activeTab, setActiveTab] = React.useState('discovery');

    return (
        <div className="bg-black min-h-screen card-wrapper">
            <LoggedInNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Container fluid className="min-h-screen pt-16">
                <Row className="justify-content-center align-items-center ">
                    <Col xs={12} md={6} lg={3}>
                        <CSSTransition
                            in={activeTab === 'discovery'}
                            timeout={300}
                            classNames="slide"
                            unmountOnExit
                            mountOnEnter
                        >
                            <SongCard
                                id={song.id}
                                imageUrl={song.imageUrl}
                                title={song.title}
                                artist={song.artist}
                                audioUrl={song.audioUrl}
                                spotifyAccessToken={song.artist}
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