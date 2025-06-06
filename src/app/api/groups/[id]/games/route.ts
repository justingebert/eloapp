import dbConnect from "@/db/dbConnect";
import Game from "@/db/models/game";
import Group from "@/db/models/group";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const groupId = params.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return new Response(JSON.stringify({ message: "Group not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const games = await Game.find({ group: groupId }).populate("players");

        return new Response(JSON.stringify(games), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching games:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { name, icon, teamsize } = body;
        const groupId = params.id;

        if (!name) {
            return new Response(JSON.stringify({ message: "Game name is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await dbConnect();

        const group = await Group.findById(groupId);
        if (!group) {
            return new Response(JSON.stringify({ message: "Group not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const game = await Game.create({
            group: groupId,
            name,
            icon: icon || "",
            teamsize: teamsize || 1,
            players: [],
        });

        await Group.findByIdAndUpdate(groupId, {
            $push: { games: game._id },
        });

        return new Response(
            JSON.stringify({
                id: game._id,
                name: game.name,
                icon: game.icon,
                teamsize: game.teamsize,
                message: "Game created successfully",
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating game:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
