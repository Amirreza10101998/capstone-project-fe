import React from 'react';
import { FaArrowRight, FaTwitter, FaFacebookF } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-gray-300 py-12">
            <div className="container mx-auto border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">HERTZ</h3>
                        <ul>
                            <li><a href="/" className="hover:text-gray-100">Home</a></li>
                            <li><a href="/pro" className="hover:text-gray-100 text-yellow-400">PRO</a></li>
                            <li><a href="/about" className="hover:text-gray-100">About</a></li>
                            <li><a href="/apps" className="hover:text-gray-100">Apps</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Legal</h3>
                        <ul>
                            <li><a href="/terms" className="hover:text-gray-100">Terms of Use</a></li>
                            <li><a href="/privacy" className="hover:text-gray-100">Privacy Policy</a></li>
                            <li><a href="/community" className="hover:text-gray-100">Community Guidelines</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Company</h3>
                        <ul>
                            <li><a href="/contact" className="hover:text-gray-100">Contact</a></li>
                            <li><a href="/faq" className="hover:text-gray-100">FAQ</a></li>
                            <li><a href="/welcome" className="hover:text-gray-100">Welcome</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                        <p className="mb-4">Stay up to date with the latest releases, news, and offers.</p>
                        <div className="flex items-center">
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-gray-800 text-white px-3 py-2 h-10 rounded-l w-full focus:outline-none"
                            />
                            <button className="bg-blue-500 text-white px-3 py-2 h-10 rounded-r hover:bg-blue-600">
                                <FaArrowRight />
                            </button>
                        </div>

                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6 mt-6">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400">© 2023 HERTZ. All rights reserved.</p>
                            <div className="flex items-center">
                                <a href="https://www.facebook.com/" className="mx-2 hover:text-white">
                                    <FaFacebookF className="text-gray-400 text-xl transition-all duration-200" />
                                </a>
                                <a href="https://www.twitter.com/" className="mx-2 hover:text-white">
                                    <FaTwitter className="text-gray-400 text-xl transition-all duration-200" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
