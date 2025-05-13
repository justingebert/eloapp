"use client";

import * as React from "react";
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
import { toast } from "sonner";

export interface CreateGroupDrawerProps {
    className?: string;
    onGroupCreated: () => void;
}

export function CreateGroupDrawer({ className, onGroupCreated }: CreateGroupDrawerProps) {
    const [name, setName] = React.useState("");
    const [passphrase, setPassphrase] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, passphrase }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Failed to create group", {
                    description: errorData.message || "An error occurred while creating the group.",
                });
            }

            setName("");
            setPassphrase("");
            onGroupCreated();
        } catch (err: any) {
            console.error("Error creating group:", err);
            toast.error("Failed to create group", {
                description: err || "An error occurred while creating the group.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className={className}>
                    Create Group
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Create New Group</DrawerTitle>
                        <DrawerDescription>Enter a name and passphrase for your new group.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0 space-y-4">
                        <div>
                            <label htmlFor="group-name" className="text-sm font-medium">
                                Group Name
                            </label>
                            <Input
                                id="group-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="group-passphrase" className="text-sm font-medium">
                                Passphrase
                            </label>
                            <Input
                                id="group-passphrase"
                                type="password"
                                value={passphrase}
                                onChange={(e) => setPassphrase(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleSubmit} disabled={isLoading || !name || !passphrase}>
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" disabled={isLoading}>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
