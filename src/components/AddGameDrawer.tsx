"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Gamepad2 } from "lucide-react";

interface AddGameDrawerProps {
    groupId: string;
    onGameCreated?: () => void;
}

export default function AddGameDrawer({ groupId, onGameCreated }: AddGameDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        icon: "",
        teamsize: "0",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Please enter a game name");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/groups/${groupId}/games`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    icon: formData.icon.trim(),
                    teamsize: parseInt(formData.teamsize),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create game");
            }

            toast.success("Game created successfully!");
            setFormData({ name: "", icon: "", teamsize: "1" });
            setIsOpen(false);
            onGameCreated?.();
        } catch (error) {
            console.error("Error creating game:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create game");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button size={"icon"} disabled={isLoading}>
                    <Plus />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        Create New Game
                    </DrawerTitle>
                    <DrawerDescription>
                        Add a new game to your group. Games help organize matches and track rankings.
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Game Name *
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="e.g., Table Tennis, Spikeball, Mario Kart..."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="icon" className="text-sm font-medium">
                            Icon
                        </label>
                        <Input
                            id="icon"
                            type="text"
                            maxLength={2}
                            placeholder="🏓 (emoji)"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="teamsize" className="text-sm font-medium">
                            Team Size
                        </label>
                        <Select
                            value={formData.teamsize}
                            onValueChange={(value) => setFormData({ ...formData, teamsize: value })}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Variable</SelectItem>
                                <SelectItem value="1">1 vs 1</SelectItem>
                                <SelectItem value="2">2 vs 2</SelectItem>
                                <SelectItem value="3">3 vs 3</SelectItem>
                                <SelectItem value="4">4 vs 4</SelectItem>
                                <SelectItem value="5">5 vs 5</SelectItem>
                                <SelectItem value="6">6 vs 6</SelectItem>
                                <SelectItem value="7">7 vs 7</SelectItem>
                                <SelectItem value="8">8 vs 8</SelectItem>
                                <SelectItem value="9">9 vs 9</SelectItem>
                                <SelectItem value="10">10 vs 10</SelectItem>
                                <SelectItem value="11">11 vs 11</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DrawerFooter className="-p-6">
                        <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Game"}
                        </Button>
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                        
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
