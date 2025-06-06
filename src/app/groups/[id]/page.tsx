"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function GroupPage() {
    const router = useRouter();
    const params = useParams();
    const groupId = params.id as string;

    useEffect(() => {
        // Redirect to games tab by default
        router.replace(`/groups/${groupId}/games`);
    }, [router, groupId]);

    return (
        <div className="text-center py-8">
            <p className="text-muted-foreground">Redirecting...</p>
        </div>
    );
}
