//Navbar component to display the navigation bar on the top of the page. It contains the logo, links, and buttons for login, register, add review, and logout. The buttons are conditionally rendered based on the user's authentication status. The user can navigate to the home page, profile page, login page, register page, and create review page using the links in the navigation bar. The user can also add a review and logout using the buttons in the navigation bar.

import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Check if the user is logged in

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Section: Logo and Links */}
                <div className="flex items-center space-x-4">
                    <h1
                        className="text-xl font-bold cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        Stayly
                    </h1>
                    <ul className="flex space-x-4">
                        <li className="cursor-pointer" onClick={() => navigate("/")}>
                            Home
                        </li>
                        {token && (
                            <li className="cursor-pointer" onClick={() => navigate("/profile")}>
                                Profile
                            </li>
                        )}
                    </ul>
                </div>

                {/* Right Section: Buttons */}
                <div className="flex items-center space-x-4">
                    {token ? (
                        <>
                            <button
                                onClick={() => navigate("/create-review")}
                                // className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                className="bg-green-500 text-sm sm:text-base text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-600" //Update Add Review Button in reponse to mobile view

                            >
                                Add Review
                            </button>
                            <button
                                onClick={handleLogout}
                                //className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" // Match with the Add Review Button
                                className="bg-red-500 text-sm sm:text-base text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-blue-500 text-sm sm:text-base text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="bg-gray-500 text-sm sm:text-base text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-gray-600"
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
