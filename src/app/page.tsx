"use client";
import { AddGroupDrawer } from "@/components/AddGroupDrawer";
import { useGroups } from "@/components/GroupProvider";


export default function Home() {

    const { 
        saveGroup, 
        groupsData, 
        isLoadingGroups, 
        hasError, 
        refreshGroups 
    } = useGroups();

    
    const handleGroupAdded = (id: string, name: string, passphrase: string) => {
        saveGroup(id, name, passphrase);
        refreshGroups();
    };


    return (
        <div className="p-4">
            <AddGroupDrawer
                className=""
                onGroupAdded={handleGroupAdded}
            />
        </div>
    );
}
