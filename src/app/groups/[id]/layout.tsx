"use client";
import { useGroups } from "@/components/GroupProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Gamepad2, Users, Settings } from "lucide-react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Group } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface GroupLayoutProps {
    children: React.ReactNode;
}

export default function GroupLayout({ children }: GroupLayoutProps) {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const groupId = params.id as string;
    const { groupsData, isLoadingGroups } = useGroups();
    const [group, setGroup] = useState<Group | null>(null);

    useEffect(() => {
        if (groupsData.length > 0 && groupId) {
            const foundGroup = groupsData.find((g) => g.id === groupId);
            setGroup(foundGroup || null);
        }
    }, [groupsData, groupId]);

    const isGamesTab = pathname.includes("/games");
    const isPlayersTab = pathname.includes("/players");
    const isSettingsTab = pathname.includes("/settings");

    if (isLoadingGroups) {
        return (
            <div className="flex flex-col h-[100dvh]">
                {/* Header Skeleton */}
                <div>
                    <div className="flex items-center justify-between">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="h-6 w-32" />
                        <div className="w-8" />
                    </div>
                </div>

                <Separator className="my-4" />

                {/* Content Area Skeleton */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="border rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Skeleton className="w-12 h-12 rounded-xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation Skeleton */}
                <div className="border-t bg-background">
                    <nav className="flex">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center py-3 px-2">
                                <Skeleton className="w-5 h-5 mb-1 rounded" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </nav>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="p-4">
                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Group not found</p>
                    <Button onClick={() => router.push("/")}>
                        <ArrowLeft />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh]">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-lg font-semibold truncate mx-4">{group.name}</h1>
                    <div className="w-8" /> {/* Spacer for alignment */}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4">{children}</div>

            {/* Bottom Navigation */}
            <div className="border-t bg-background -mx-4 -mb-4">
                <nav className="flex">
                    <Link
                        href={`/groups/${groupId}/games`}
                        className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                            isGamesTab ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Gamepad2 className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Games</span>
                    </Link>
                    <Link
                        href={`/groups/${groupId}/players`}
                        className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                            isPlayersTab ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Users className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Players</span>
                    </Link>
                    <Link
                        href={`/groups/${groupId}/settings`}
                        className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                            isSettingsTab ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Settings className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Settings</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}
