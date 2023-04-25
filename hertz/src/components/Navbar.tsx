import React from 'react';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
];

const Navbar: React.FC = () => {
    return (
        <nav className="bg-black text-white shadow-lg fixed w-full z-10">
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                        <a href="/" className="text-white hover:text-white">
                            HERTZ
                        </a>
                    </div>
                    <div className="hidden md:flex items-center">
                        {navItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="text-white hover:text-gray-300 mx-4"
                            >
                                {item.label}
                            </a>
                        ))}
                        <button className="bg-gray-800 text-white font-bold py-2 px-4 rounded ml-4 hover:bg-gray-700">
                            Login
                        </button>
                        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded ml-4 hover:bg-blue-600">
                            Sign Up
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-white hover:text-gray-300 focus:outline-none"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
