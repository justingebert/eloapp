"use client";
import { useGroups } from "@/components/GroupProvider";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupPage() {
    const router = useRouter();
    const params = useParams();
    const groupId = params.id as string;
    const { groupsData, isLoadingGroups } = useGroups();
    const [group, setGroup] = useState<any>(null);

    useEffect(() => {
        if (groupsData.length > 0 && groupId) {
            const foundGroup = groupsData.find((g) => g.id === groupId);
            setGroup(foundGroup);
        }
    }, [groupsData, groupId]);

    if (isLoadingGroups) {
        return (
            <div className="p-4">
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading group...</p>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="p-4">
                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Group not found</p>
                    <Button onClick={() => router.push("/")}>Back to Groups</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
                    ← Back to Groups
                </Button>
            </div>

            <div className="border rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{group.name}</h1>
                <div className="space-y-2 text-muted-foreground">
                    <p>Group ID: {group.id}</p>
                    <p>Created: {new Date(group.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
