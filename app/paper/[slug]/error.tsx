"use client";

export default function Error({
    error,
}: {
    error: Error;
}) {
    return (
        <div
            style={{
                padding: 40
            }}
        >
            <h1>Unable to load paper</h1>

            <pre>{error.message}</pre>
        </div>
    );
}