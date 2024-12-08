'use client';

import React, { useState } from "react";
import DeployForm from "./components/DeployForm";
import DeploymentStatus from "./components/DeploymentStatus";

const App = () => {
  const [deploymentStatus, setDeploymentStatus] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Deploy Your GitHub Project
          </h1>
          <p className="mt-4 text-lg font-light text-gray-400">
            Enter your GitHub repository URL and deploy it to the cloud effortlessly.
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
          <DeployForm setDeploymentStatus={setDeploymentStatus} />
          {deploymentStatus && <DeploymentStatus status={deploymentStatus} />}
        </div>
      </div>
    </div>
  );
};

export default App;
