'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { deployProject } from "../../services/deployService";

const DeployForm = ({ setDeploymentStatus }: { setDeploymentStatus: (status: string) => void }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [githubURL, setGithubURL] = useState(searchParams.get("githubUrl") || "");

    useEffect(() => {
        setGithubURL(searchParams.get("githubUrl") || "");
    }, [searchParams]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!githubURL.trim()) {
            setDeploymentStatus("Please enter a valid GitHub repository URL.");
            return;
        }

        setDeploymentStatus("Deploying...");

        try {
            const response = await deployProject(githubURL);

            if (response.success && response.deployUrl) {
                setDeploymentStatus(`Project deployed! Access it at: ${response.deployUrl}`);
            } else if (response.error) {
                setDeploymentStatus(`Error: ${response.error}`);
            } else {
                setDeploymentStatus("Unexpected response from the server.");
            }
        } catch (error) {
            console.error("Error during deployment:", error);
            setDeploymentStatus("An error occurred while communicating with the server.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRepoUrl = e.target.value;
        setGithubURL(newRepoUrl);

        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("githubUrl", newRepoUrl);

        router.replace(`?${newSearchParams.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center text-white">Deploy Your GitHub Project</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={githubURL}
                    onChange={handleChange}
                    placeholder="Enter GitHub Repository URL"
                    className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Deploy
                </button>
            </div>
        </form>
    );
};

export default DeployForm;
