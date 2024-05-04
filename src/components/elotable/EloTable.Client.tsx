"use client";

import React, { useEffect, useState } from "react";
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

interface User {
  username: string;
  elo: number[];
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/players");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const determineTrend = (elo: number[]) => {
    if (elo.length < 2) {
      return "-"; // No trend data
    }

    const latest = elo[elo.length - 1];
    const previous = elo[elo.length - 2];
    return latest > previous ? "↑" : latest < previous ? "↓" : "-";
  };

  return (
    <Table>
      <TableCaption>Current user ELO standings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead className="text-right">ELO</TableHead>
          <TableHead className="text-right">Games Played</TableHead>
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
              <TableCell className="text-right">{user.elo.length-1}</TableCell>
              <TableCell className="text-right">{determineTrend(user.elo)}</TableCell>
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
  );
}