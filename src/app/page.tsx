"use client";
import { AddGroupDrawer } from "@/components/AddGroupDrawer";
import { useGroups } from "@/components/GroupProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const { saveGroup, groupsData, isLoadingGroups, hasError, refreshGroups } = useGroups();

    const handleGroupAdded = (id: string, name: string, passphrase: string) => {
        saveGroup(id, name, passphrase);
        refreshGroups();
    };

    const handleGroupClick = (groupId: string) => {
        router.push(`/groups/${groupId}`);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Groups</h1>
                <AddGroupDrawer className="" onGroupAdded={handleGroupAdded} />
            </div>

            {isLoadingGroups ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading groups...</p>
                </div>
            ) : hasError ? (
                <div className="text-center py-8">
                    <p className="text-destructive">Error loading groups</p>
                    <Button onClick={refreshGroups} className="mt-2">
                        Retry
                    </Button>
                </div>
            ) : groupsData.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No groups found</p>
                    <p className="text-sm text-muted-foreground">Create or join a group to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupsData.map((group) => (
                        <div
                            key={group.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleGroupClick(group.id)}
                        >
                            <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                Created: {new Date(group.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
