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

        // Find group by name and verify passphrase
        const group = await Group.findOne({ name, passphrase });

        if (!group) {
            return new Response(JSON.stringify({ message: "Invalid group name or passphrase" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({
                id: group._id,
                name: group.name,
                message: "Successfully joined group",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error authenticating group:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
