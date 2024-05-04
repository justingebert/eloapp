import { ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dbConnect from "@/db/dbConnect";
import User, { IUser } from "@/db/models/User";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
    await dbConnect();
    const users: IUser[] = await User.find({});

    const determineTrend = (elo: number[]) => {
        if (elo.length < 2) {
            return "-"; // No trend data
        }

        const latest = elo[elo.length - 1];
        const previous = elo[elo.length - 2];
        if (latest > previous) {
            return <ArrowUp color="green" />;
        } else if (latest < previous) {
            return <ArrowDown color="red" />;
        } else {
            return "-";
        }
    };

    const lastEloDifference = (elo: number[]) => {
        if (elo.length < 2) {
            return 0; // No change
        }

        const latest = elo[elo.length - 1];
        const previous = elo[elo.length - 2];
        return latest - previous;
    };

    return (
        <div>
            <Table>
                <TableCaption>Current user ELO standings</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead className="text-right">ELO</TableHead>
                        <TableHead className="text-right">Games Played</TableHead>
                        <TableHead className="text-right">Last ELO Change</TableHead>
                        <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const latestElo = user.elo[user.elo.length - 1] || 100;
                        return (
                            <TableRow key={user.username}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell className="text-right">{latestElo}</TableCell>
                                <TableCell className="text-right">{user.elo.length - 1}</TableCell>
                                <TableCell className="text-right">{lastEloDifference(user.elo)}</TableCell>
                                <TableCell className="text-right">
                                    {determineTrend(user.elo)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total Players: {users.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex items-center justify-center m-4">
                <Link href="/loggame">
                    <Button>Log Game</Button>
                </Link>
            </div>
            <div>
                <Link href="/createplayer">
                    <Button>Create Player</Button>
                </Link>
            </div>
        </div>
    );
}
