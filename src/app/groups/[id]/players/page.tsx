"use client";
import AddPlayerDrawer from "@/components/AddPlayerDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Player } from "@/lib/types";

export default function GroupPlayersPage() {
    const params = useParams();
    const groupId = params.id as string;

    const {
        data: players,
        error: playersError,
        mutate: mutatePlayers,
    } = useSWR<Player[]>(groupId ? `/api/groups/${groupId}/players` : null, fetcher);

    const handlePlayerCreated = () => {
        mutatePlayers();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    Players
                </h2>
                <AddPlayerDrawer groupId={groupId} onPlayerCreated={handlePlayerCreated} />
            </div>

            {/* Players List */}
            {!players && !playersError ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-8" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : playersError ? (
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load players</p>
                </div>
            ) : players?.length === 0 ? (
                <div className="text-center py-12">
                    <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2 text-lg">No players yet</p>
                    <p className="text-sm text-muted-foreground">Add your first player to get started!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {players?.map((player) => (
                        <div key={player._id} className="border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{player.name}</h3>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Joined {new Date(player.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground text-right">
                                    <div>ID</div>
                                    <div>{player._id.slice(-6)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
