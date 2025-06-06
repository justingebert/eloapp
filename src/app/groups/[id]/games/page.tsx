"use client";
import AddGameDrawer from "@/components/AddGameDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Users } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Game } from "@/lib/types";

export default function GroupGamesPage() {
    const params = useParams();
    const groupId = params.id as string;

    const {
        data: games,
        error: gamesError,
        mutate: mutateGames,
    } = useSWR<Game[]>(groupId ? `/api/groups/${groupId}/games` : null, fetcher);

    const handleGameCreated = () => {
        mutateGames();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                    <Gamepad2 className="w-6 h-6 mr-2" />
                    Games
                </h2>
                <AddGameDrawer groupId={groupId} onGameCreated={handleGameCreated} />
            </div>

            {/* Games List */}
            {!games && !gamesError ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="border rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : gamesError ? (
                <div className="text-center py-8">
                    <p className="text-red-500">Failed to load games</p>
                </div>
            ) : games?.length === 0 ? (
                <div className="text-center py-12">
                    <Gamepad2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2 text-lg">No games yet</p>
                    <p className="text-sm text-muted-foreground">Create your first game to get started!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {games?.map((game) => (
                        <div key={game._id} className="border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        {game.icon ? (
                                            <span className="text-xl">{game.icon}</span>
                                        ) : (
                                            <Gamepad2 className="w-6 h-6 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{game.name}</h3>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Users className="w-4 h-4 mr-1" />
                                            {game.teamsize} vs {game.teamsize}
                                            <span className="mx-2">•</span>
                                            {game.players?.length || 0} players
                                        </div>
                                    </div>
                                </div>
                                {/* TODO last match info */}
                                <div className="text-xs text-muted-foreground text-right">
                                    <div>Created</div>
                                    <div>{new Date(game.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
