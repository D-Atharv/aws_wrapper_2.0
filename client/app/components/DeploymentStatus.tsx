const DeploymentStatus = ({ status }: { status: string }) => {
    return (
        <div className="text-center mt-4">
            <p className="text-lg text-white">{status}</p>
        </div>
    );
};

export default DeploymentStatus;
