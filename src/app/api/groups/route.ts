import dbConnect from "@/db/dbConnect";
import Group from "@/db/models/group";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, passphrase } = body;

        if (!name || !passphrase) {
            return new Response("Missing required fields", { status: 400 });
        }

        await dbConnect();
        const group = await Group.create({
            name,
            passphrase,
        });
        if (!group) {
            return new Response("Failed to create group", { status: 500 });
        }
        
        return new Response(JSON.stringify(group), { status: 201 });
    } catch (error) {
        console.error("Error creating group:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}