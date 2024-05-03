"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  username: string;
  elo: number;
  gamesPlayed: number;
}

interface Team {
  winningTeam: string[];
  losingTeam: string[];
}

const TeamSelectionPage = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Team>({
    winningTeam: [],
    losingTeam: [],
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/players");
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = (await response.json()) as User[];
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  const handleSelectPlayer = (team: "winningTeam" | "losingTeam", index: number, player: string) => {
    setSelectedPlayers((prevSelected) => {
      const newSelected = { ...prevSelected };
      newSelected[team][index] = player;
      return newSelected;
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlayers),
      });
      if (response.ok) {
        console.log("Success:", await response.json());
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  const userSelector = (team: "winningTeam" | "losingTeam", index: number) => {
    const selected = [...selectedPlayers.winningTeam, ...selectedPlayers.losingTeam];
    const selectedValue = selectedPlayers[team][index] || "";

    return (
      <Select value={selectedValue} onValueChange={(player) => handleSelectPlayer(team, index, player)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select player">
            {selectedValue ? selectedValue : "Select a player"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {players
            .filter((player) => !selected.includes(player.username))
            .map((player) => (
              <SelectItem key={player.username} value={player.username}>
                {player.username}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div>
      <h2>Winning Team</h2>
      <div>{userSelector("winningTeam", 0)}</div>
      <div>{userSelector("winningTeam", 1)}</div>

      <h2>Losing Team</h2>
      <div>{userSelector("losingTeam", 0)}</div>
      <div>{userSelector("losingTeam", 1)}</div>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default TeamSelectionPage;
