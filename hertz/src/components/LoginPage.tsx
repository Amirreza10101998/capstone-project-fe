import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BE_URL as String;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await logIn(email, password);
    };

    const logIn = async (email: string, password: string) => {
        try {
            const res = await fetch(`${apiUrl}/users/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                navigate('/home');
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while logging in");
        }
    };

    return (
        <div className="bg-black min-h-screen flex items-center">
            <div className="container mx-auto px-4 py-12">
                <div className="w-full md:w-1/2 mx-auto">
                    <h1 className="text-white text-4xl font-bold mb-8">
                        Login to HERTZ
                    </h1>
                    {error && (
                        <div className="text-red-500 mb-4">
                            {error}
                        </div>
                    )}
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
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
