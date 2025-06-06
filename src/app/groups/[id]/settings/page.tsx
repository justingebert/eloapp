"use client";
import { useGroups } from "@/components/GroupProvider";
import { Settings, Info, Users, Gamepad2, Calendar, Key, Copy, Eye, EyeOff } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Group } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GroupSettingsPage() {
    const params = useParams();
    const groupId = params.id as string;
    const { groupsData, storedGroups, isLoadingGroups } = useGroups();
    const [group, setGroup] = useState<Group | null>(null);
    const [storedGroup, setStoredGroup] = useState<{ id: string; name: string; passphrase: string } | null>(null);
    const [showPassphrase, setShowPassphrase] = useState(false);
    const [showSharePassphrase, setShowSharePassphrase] = useState(false);

    useEffect(() => {
        if (groupsData.length > 0 && groupId) {
            const foundGroup = groupsData.find((g) => g.id === groupId);
            setGroup(foundGroup || null);
        }

        if (storedGroups.length > 0 && groupId) {
            const foundStoredGroup = storedGroups.find((g) => g.id === groupId);
            setStoredGroup(foundStoredGroup || null);
        }
    }, [groupsData, storedGroups, groupId]);

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${label} copied to clipboard`);
        } catch (error) {
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleGroupShare = () => {
        if (!group || !storedGroup) return;
        const shareText = `Join my group on GameHub!

Link: ${window.location.origin}/groups/${group.id}?passphrase=${storedGroup.passphrase}

Group ID: ${group.id}
Passphrase: ${storedGroup.passphrase}`;
        copyToClipboard(shareText, "Group details");
    };

    const maskPassphrase = (passphrase: string) => {
        return "•".repeat(passphrase.length);
    };

    if (isLoadingGroups || !group || !storedGroup) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Loading group settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold flex items-center">
                    <Settings className="w-6 h-6 mr-2" />
                    Settings
                </h2>
            </div>

            {/* Group Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Group Information
                </h3>

                <div className="space-y-3">
                    <div className="border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Group Name</p>
                                <p className="text-sm text-muted-foreground">{group.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium">Group ID</p>
                                <p className="text-sm text-muted-foreground font-mono">{group.id}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(group.id, "Group ID")}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="border rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium">Passphrase</p>
                                <p className="text-sm text-muted-foreground font-mono">
                                    {showPassphrase ? storedGroup.passphrase : maskPassphrase(storedGroup.passphrase)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowPassphrase(!showPassphrase)}>
                                    {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(storedGroup.passphrase, "Passphrase")}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-xl p-4">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Created</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(group.createdAt).toLocaleDateString()} at{" "}
                                    {new Date(group.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Statistics</h3>

                <div className="grid grid-cols-2 gap-3">
                    <div className="border rounded-xl p-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Gamepad2 className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">{group.games?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Games</p>
                    </div>

                    <div className="border rounded-xl p-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">{group.players?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Players</p>
                    </div>
                </div>
            </div>

            {/* Share Group */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Share Group</h3>
                <div className="border rounded-xl p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                        Share these details with others to let them join your group:
                    </p>
                    <div className="space-y-2">
                        <div className="bg-muted rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Group ID</p>
                            <p className="font-mono text-sm">{group.id}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Passphrase</p>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-sm">
                                    {showSharePassphrase
                                        ? storedGroup.passphrase
                                        : maskPassphrase(storedGroup.passphrase)}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSharePassphrase(!showSharePassphrase)}
                                    className="h-6 px-2"
                                >
                                    {showSharePassphrase ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button className="w-full mt-3" variant="outline" onClick={handleGroupShare}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Group Details
                    </Button>
                </div>
            </div>
        </div>
    );
}
