interface DeployResponse {
    success: boolean;
    deployUrl?: string;
    error?: string;
}

const apiClient = {
    async post<T, R>(endpoint: string, body: T): Promise<R> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.json() as Promise<R>;
    },
};

export async function deployProject(githubURL: string): Promise<DeployResponse> {
    try {
        const response = await apiClient.post<{ githubURL: string }, { s3URL: string }>("/build", {
            githubURL,
        });
        return { success: true, deployUrl: response.s3URL };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unknown error occurred." };
    }
}
