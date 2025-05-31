"use client";
import { CreateGroupDrawer } from "@/components/CreateGroupDrawer";
import { AddGroupDrawer } from "@/components/AddGroupDrawer";


export default function Home() {

    
    const handleGroupCreated = () => {
        console.log("Group created! Refreshing list or taking other actions...");
    };

    const handleGroupAdded = () => {
        console.log("Group added! Refreshing list or taking other actions...");
    };

    return (
        <div className="p-4">
            <CreateGroupDrawer 
                className="" 
                onGroupCreated={handleGroupCreated} 
            />
            <AddGroupDrawer
                className=""
                onGroupAdded={handleGroupAdded}
            />
        </div>
    );
}
