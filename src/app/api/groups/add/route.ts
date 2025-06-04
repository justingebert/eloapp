import dbConnect from "@/db/dbConnect";
import Group from "@/db/models/group";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, passphrase } = body;

        if (!name || !passphrase) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await dbConnect();

        const existingGroup = await Group.findOne({ name });

        if (existingGroup) {
            if (existingGroup.passphrase !== passphrase) {
                return new Response(JSON.stringify({ message: "Invalid passphrase for existing group" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(
                JSON.stringify({
                    id: existingGroup._id,
                    name: existingGroup.name,
                    message: "Successfully joined existing group",
                    action: "joined",
                }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } else {
            const newGroup = await Group.create({
                name,
                passphrase,
            });

            if (!newGroup) {
                return new Response(JSON.stringify({ message: "Failed to create group" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

            return new Response(
                JSON.stringify({
                    id: newGroup._id,
                    name: newGroup.name,
                    message: "Successfully created new group",
                    action: "created",
                }),
                {
                    status: 201,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    } catch (error) {
        console.error("Error handling group:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
