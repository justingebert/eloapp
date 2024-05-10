"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const CreateUserPage = () => {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });
            if (response.ok) {
                console.log("User created:", await response.json());
                router.push("/")
            } else {
                console.error("Failed to create user");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h1 className="text-2xl mb-4">Create User</h1>
            <Input
                type="text"
                value={username}
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 w-[300px]"
            />
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create User"}
            </Button>
        </div>
    );
};

export default CreateUserPage;
