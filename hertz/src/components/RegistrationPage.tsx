import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [favoriteGenres, setFavoriteGenres] = useState('');
    const [favoriteArtists, setFavoriteArtists] = useState('');
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const navigate = useNavigate();

    const registerUser = async (email: string, username: string, password: string, favorite_genres: string[], favorite_artists: string[]) => {
        try {
            const apiUrl = process.env.REACT_APP_BE_URL;
            const response = await fetch(`${apiUrl}/users/account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, favorite_genres, favorite_artists }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('New user created:', data);
                return true;
            } else {
                console.error('Error registering user:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error registering user:', error);
            return false;
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await registerUser(email, username, password, favoriteGenres.split(','), favoriteArtists.split(','));
        if (success) {
            navigate('/login');
        } else {
            console.error('Registration failed. Please try again.')
        }
    };


    return (
        <div className="bg-black min-h-screen flex items-center">
            <div className="container mx-auto px-4 py-12">
                <div className="w-full md:w-1/2 mx-auto">
                    <h1 className="text-white text-4xl font-bold mb-8">
                        Create Your HERTZ Account
                    </h1>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" required />
                                </div>
                                <button type="button" onClick={nextStep} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full">Next</button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" required />
                                </div>
                                <button type="button" onClick={nextStep} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full">Next</button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="mb-6">
                                    <label htmlFor="favoriteGenres" className="block text-gray-300 mb-2">Favorite Genres (comma-separated)</label>
                                    <input type="text" id="favoriteGenres" value={favoriteGenres} onChange={(e) => setFavoriteGenres(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" required />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="favoriteArtists" className="block text-gray-300 mb-2">Favorite Artists (comma-separated)</label>
                                    <input type="text" id="favoriteArtists" value={favoriteArtists} onChange={(e) => setFavoriteArtists(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none" required />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full">Finish</button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div >
    );
};

export default RegistrationPage;

