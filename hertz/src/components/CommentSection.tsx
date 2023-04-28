import React from 'react';
import '../styles/CommentSection.css';

const CommentSection: React.FC = () => {
    const sampleComments = [
        {
            author: 'User1',
            text: 'Great song!',
            avatar: 'https://via.placeholder.com/40',
        },
        {
            author: 'User2',
            text: 'I love this!',
            avatar: 'https://via.placeholder.com/40',
        },
        {
            author: 'User3',
            text: 'Amazing track!',
            avatar: 'https://via.placeholder.com/40',
        },
    ];

    return (
        <div className="comment-section">
            <h4>Comments</h4>
            {sampleComments.map((comment, index) => (
                <div className="comment" key={`comment-${index}`}>
                    <img
                        className="comment-avatar"
                        src={comment.avatar}
                        alt={`${comment.author}'s avatar`}
                    />
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-text">{comment.text}</span>
                </div>
            ))}
        </div>
    );
};

export default CommentSection;
