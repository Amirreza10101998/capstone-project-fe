import React, { useState } from 'react';

const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Email:', email, 'Username:', username, 'Password:', password);
    };

    return (
        <div className="bg-black min-h-screen flex items-center">
            <div className="container mx-auto px-4 py-12">
                <div className="w-full md:w-1/2 mx-auto">
                    <h1 className="text-white text-4xl font-bold mb-8">
                        Create Your HERTZ Account
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block text-gray-300 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="username"
                                className="block text-gray-300 mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-gray-300 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-600 w-full"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
