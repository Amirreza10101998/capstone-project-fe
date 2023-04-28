import React from 'react';
import '../styles/UserListRecommendations.css';

const UserListRecommendations: React.FC = () => {
    const sampleUsers = [
        {
            name: 'User1',
            avatar: 'https://via.placeholder.com/40',
        },
        {
            name: 'User2',
            avatar: 'https://via.placeholder.com/40',
        },
        {
            name: 'User3',
            avatar: 'https://via.placeholder.com/40',
        },
    ];

    const handleFollow = (userName: string) => {
        console.log(`Followed ${userName}`);
        // Implement your follow logic here
    };

    return (
        <div className="user-list">
            <h4>People to follow</h4>
            {sampleUsers.map((user, index) => (
                <div className="user" key={`user-${index}`}>
                    <img
                        className="user-avatar"
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                    />
                    <span className="user-name">{user.name}</span>
                    <button
                        className="follow-button"
                        onClick={() => handleFollow(user.name)}
                    >
                        Follow
                    </button>
                </div>
            ))}
        </div>
    );
};

export default UserListRecommendations;
