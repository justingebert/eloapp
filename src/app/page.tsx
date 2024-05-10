// Importing necessary components and libraries
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dbConnect from "@/db/dbConnect";
import User, { IUser } from '@/db/models/User';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { get } from 'http';

async function getUsers(){
    const res = await fetch('http://localhost:3000/api/players', { cache: 'no-store' });
    return res.json();
}

export default async function Home() {
    let users: IUser[] = await getUsers();

    // Sort users by the last ELO
    users.sort((a, b) => (b.elo[b.elo.length - 1] || 100) - (a.elo[a.elo.length - 1] || 100));

    // Function to determine the last ELO difference
    const lastEloDifference = (elo: number[]) => {
        if (elo.length < 2) {
            return 0; // No change if not enough data
        }
        const latest = elo[elo.length - 1];
        const previous = elo[elo.length - 2];
        const difference = latest - previous;
        const color = difference > 0 ? "green" : difference < 0 ? "red" : "black";
        return <div style={{ color }}>{difference}</div>;
    };

    // Function to calculate winning or losing streaks
    const calculateStreak = (elo: number[]) => {
        if (elo.length < 2) {
            return { streak: 0, type: "-" }; // No streak data
        }

        let streak = 1;
        let type = (elo[elo.length - 1] > elo[elo.length - 2]) ? "up" : "down";

        for (let i = elo.length - 2; i > 0; i--) {
            if ((elo[i] > elo[i - 1] && type === "up") || (elo[i] < elo[i - 1] && type === "down")) {
                streak++;
            } else {
                break;
            }
        }

        return { streak: streak, type: type };
    };

    // Function to display the streak with an arrow icon
    const displayStreak = (streakData:any) => {
        if (streakData.streak < 2) return "-";
        const Arrow = streakData.type === "up" ? ArrowUp : ArrowDown;
        const color = streakData.type === "up" ? "green" : "red";
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span>{streakData.streak}</span>
                <Arrow color={color} style={{ marginLeft: '4px' }} />
            </div>
        );
    };

    return (
        <div>
            <Table>
                <TableCaption>Current user ELO standings</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead className="text-right">ELO</TableHead>
                        <TableHead className="text-right">Last ELO Change</TableHead>
                        <TableHead className="text-right">Streak</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const latestElo = user.elo[user.elo.length - 1] || 100;
                        const streakData = calculateStreak(user.elo);
                        return (
                            <TableRow key={user.username}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell className="text-right">{latestElo}</TableCell>
                                <TableCell className="text-right">{lastEloDifference(user.elo)}</TableCell>
                                <TableCell className="text-right">
                                    {displayStreak(streakData)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total Players: {users.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex items-center justify-center m-4">
                <Link href="/loggame">
                    <Button>Log Game</Button>
                </Link>
            </div>
            <div className="flex items-center justify-center mt-20">
                <Link href="/createplayer">
                    <Button variant={"secondary"}>Create Player</Button>
                </Link>
            </div>
        </div>
    );
}
