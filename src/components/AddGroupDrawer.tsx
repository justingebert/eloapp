"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface AddGroupDrawerProps {
    className?: string;
    onGroupAdded: (id: string, name: string, passphrase: string, action: "created" | "joined") => void;
}

export function AddGroupDrawer({ className, onGroupAdded }: AddGroupDrawerProps) {
    const [name, setName] = React.useState("");
    const [passphrase, setPassphrase] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/groups/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, passphrase }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error("Failed to add group", {
                    description: errorData.message,
                });
                return;
            }

            const data = await response.json();

            onGroupAdded(data.id, name, passphrase, data.action);

            toast.success(data.message, { position: "top-center" });
            setName("");
            setPassphrase("");
        } catch (err: any) {
            console.error("Error adding group:", err);
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
                <Button className={className}>Add Group</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Add Group</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0 space-y-4">
                        <div>
                            <Input
                                id="group-name"
                                placeholder="Group Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Input
                                id="group-passphrase"
                                placeholder="Passphrase"
                                type="password"
                                value={passphrase}
                                onChange={(e) => setPassphrase(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleSubmit} disabled={isLoading || !name || !passphrase}>
                            {isLoading ? "Adding..." : "Add Group"}
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
