import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
    const [meetingID, setMeetingID] = useState("");
    const navigate = useNavigate();

    // Check if the user is logged in by verifying the presence of a token
    useEffect(() => {
        const token = localStorage.getItem("token"); // Or sessionStorage
        if (!token) {
            // Redirect to login page if the user is not logged in
            navigate("/");
        }
    }, [navigate]);

    const createNewMeeting = () => {
        const id = uuidV4();
        navigate(`/room/${id}`);
    };

    const joinMeeting = () => {
        if (meetingID.trim()) {
            navigate(`/room/${meetingID.trim()}`);
        } else {
            alert("Please enter a valid Meeting ID.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
            {/* Hero Section */}
            <header className="w-full py-6">
                <h1 className="text-5xl font-bold text-center tracking-wide drop-shadow-lg">
                    Welcome to <span className="text-yellow-400">Meetify</span>
                </h1>
                <p className="mt-3 text-center text-lg">
                    Your one-stop solution for virtual meetings. Start or join a meeting with ease.
                </p>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center gap-8">
                {/* Illustration */}
                <div className="w-96">
                    <img
                        src="https://via.placeholder.com/400x300.png?text=Meeting+Illustration"
                        alt="Meeting Illustration"
                        className="rounded-lg shadow-lg"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        className="px-8 py-4 bg-yellow-400 text-gray-900 text-lg font-bold rounded-md shadow-xl hover:bg-yellow-500 hover:scale-105 transition-all"
                        onClick={createNewMeeting}
                    >
                        Create a New Meeting
                    </button>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Enter Meeting ID"
                            value={meetingID}
                            onChange={(e) => setMeetingID(e.target.value)}
                            className="px-4 py-3 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button
                            className="px-8 py-4 bg-green-500 text-white text-lg font-bold rounded-md shadow-xl hover:bg-green-600 hover:scale-105 transition-all"
                            onClick={joinMeeting}
                        >
                            Join Meeting
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="w-full py-4 bg-gray-900 text-center">
                <p className="text-sm text-gray-400">
                    © 2024 Meetify. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
