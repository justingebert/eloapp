"use client";
import { useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, User } from "lucide-react";

interface AddPlayerDrawerProps {
    groupId: string;
    onPlayerCreated: () => void;
}

export default function AddPlayerDrawer({ groupId, onPlayerCreated }: AddPlayerDrawerProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/groups/${groupId}/players`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            if (response.ok) {
                setName("");
                setOpen(false);
                onPlayerCreated();
            } else {
                console.error("Failed to create player");
            }
        } catch (error) {
            console.error("Error creating player:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Player
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        Add New Player
                    </DrawerTitle>
                    <DrawerDescription>Add a new player to this group.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="px-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">
                            Player Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter player name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit} disabled={isLoading || !name.trim()}>
                        {isLoading ? "Creating..." : "Create Player"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
