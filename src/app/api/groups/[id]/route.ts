import dbConnect from "@/db/dbConnect";
import Group from "@/db/models/group";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { passphrase } = body;
        const { id } = params;

        if (!passphrase) {
            return new Response(JSON.stringify({ message: "Passphrase required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await dbConnect();

        const group = await Group.findById(id);

        if (!group || group.passphrase !== passphrase) {
            return new Response(JSON.stringify({ message: "Invalid group or passphrase" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
            
        const groupData = {
            id: group._id,
            name: group.name,
            players: group.players,
            createdAt: group.createdAt,
        };

        return new Response(JSON.stringify(groupData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching group:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
