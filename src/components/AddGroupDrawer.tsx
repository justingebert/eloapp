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

export interface AddGroupDrawerProps {
    className?: string;
    onGroupAdded: () => void;
}

export function AddGroupDrawer({ className, onGroupAdded }: AddGroupDrawerProps) {
    const [name, setName] = React.useState("");
    const [passphrase, setPassphrase] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/groups/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, passphrase }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Failed to add Group", {
                    description: errorData.message,
                });
            }

            setName("");
            setPassphrase("");
            onGroupAdded();
        } catch (err: any) {
            console.error("Error creating group:", err);
            toast.error("Failed to add group", {
                description: err || "An error occurred while adding the group.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button className={className}>
                    Add Existing Group
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Add Existing Group</DrawerTitle>
                        <DrawerDescription>Enter a name and passphrase of the group.</DrawerDescription>
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
                            {isLoading ? "Checking..." : "Add"}
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
