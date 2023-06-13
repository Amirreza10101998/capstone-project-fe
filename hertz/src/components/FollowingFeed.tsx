import React, { useEffect, useState } from 'react';
import SharedSongCard from './SharedSongCard';
import '../styles/FollowingFeed.css'
import { Col, Container, Row } from 'react-bootstrap';


const REACT_APP_BE_URL = process.env.REACT_APP_BE_URL;

interface User {
    id: string;
    username: string;
    avatar: string | null;
}

interface SongCard {
    id: string;
    song_title: string;
    artist: string;
    album_art: string;
    song_url: string;
    spotify_id: string;
}


interface Post {
    id: string;
    title: string | null;
    content: string;
    user_id: string;
    SongCardId: string;
    createdAt: string;
    updatedAt: string;
    User: User;
    SongCard: SongCard;
}


const FollowingFeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const accessToken = localStorage.getItem("accessToken"); // Assuming you're storing access token in local storage

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${REACT_APP_BE_URL}/post`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    data.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setPosts(data);
                } else {
                    console.error('Error while fetching posts:', response.statusText);
                }
            } catch (error) {
                console.error('Error while fetching posts:', error);
            }
        };

        fetchPosts();
    }, [accessToken]);

    return (
        <Container fluid className="following-feed">
            {posts.map((post, index) => (
                <Row key={`row-${index}`} className="following-feed-row">
                    <Col lg={4} className="d-flex justify-content-center align-items-center">
                        <SharedSongCard
                            key={`song-${index}`}
                            id={post.id}
                            username={post.User.username}
                            userImage={post.User.avatar}
                            songData={post.SongCard}
                            content={post.content}
                        />
                    </Col>
                </Row>
            ))}
        </Container>
    );
};

export default FollowingFeed;

