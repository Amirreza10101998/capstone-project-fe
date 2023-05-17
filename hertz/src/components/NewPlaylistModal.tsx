import React, { useState } from 'react';

type NewPlaylistModalProps = {
    onClose: () => void;
    onCreate: (name: string) => void;
};

const NewPlaylistModal: React.FC<NewPlaylistModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(name);
        onClose();
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Rest of the modal code... */}
            <form onSubmit={handleSubmit}>
                <label htmlFor="playlistName">Playlist Name:</label>
                <input id="playlistName" value={name} onChange={(e) => setName(e.target.value)} />
                <button type="submit">Create Playlist</button>
            </form>
            {/* Rest of the modal code... */}
        </div>
    );
};

export default NewPlaylistModal;
