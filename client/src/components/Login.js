import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        const url = `https://vcall-ouea.onrender.com/api/auth/${isSignup ? 'signup' : 'login'}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "An error occurred");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate(isSignup ? "/login" : "/dashboard");
        } catch (error) {
            setErrorMessage(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleForm = () => {
        setIsSignup((prev) => !prev);
        setFormData({ name: "", email: "", password: "" });
        setErrorMessage("");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
                    {isSignup ? "Sign Up" : "Log In"}
                </h2>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {errorMessage && (
                        <div className="mb-4 text-red-500 text-sm text-center">{errorMessage}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : (isSignup ? "Sign Up" : "Log In")}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <button
                        onClick={toggleForm}
                        className="ml-1 text-indigo-600 hover:underline focus:outline-none"
                    >
                        {isSignup ? "Log In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;

