"use client";
import { useState, useRef, useEffect } from "react";
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
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Focus the first input when drawer opens
    useEffect(() => {
        if (open && nameInputRef.current) {
            // Small delay to ensure the drawer is fully rendered
            setTimeout(() => {
                nameInputRef.current?.focus();
            }, 100);
        }
    }, [open]);

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
                    <DrawerTitle>Add New Player</DrawerTitle>
                    <DrawerDescription>Add a new player to this group.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="px-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">
                            Player Name
                        </label>
                        <Input
                            ref={nameInputRef}
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
