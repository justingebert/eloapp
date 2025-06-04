import dbConnect from "@/db/dbConnect";
import Group from "@/db/models/group";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, passphrase } = body;

        if (!name || !passphrase) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await dbConnect();
        
        // Check if group name already exists
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) {
            return new Response(JSON.stringify({ message: "Group name already exists" }), { 
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const group = await Group.create({
            name,
            passphrase,
        });
        
        if (!group) {
            return new Response(JSON.stringify({ message: "Failed to create group" }), { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({ 
            id: group._id, 
            name: group.name,
            message: "Group created successfully" 
        }), { 
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error creating group:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}