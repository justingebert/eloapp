import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Player from "@/db/models/player";
import Group from "@/db/models/group";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const players = await Player.find({ group: params.id }).sort({ createdAt: -1 });

        return NextResponse.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Player name is required" }, { status: 400 });
        }

        const player = new Player({
            group: params.id,
            name,
        });

        await player.save();

        // Add player to group's players array
        await Group.findByIdAndUpdate(params.id, { $push: { players: player._id } });

        return NextResponse.json(player);
    } catch (error) {
        console.error("Error creating player:", error);
        return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
    }
}
