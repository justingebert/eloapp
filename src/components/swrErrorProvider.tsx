"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { toast } from "sonner";

export default function SWRErrorHandlingProvider({ children }: { children: ReactNode }) {
    return (
        <SWRConfig
            value={{
                onError: (error, key) => {
                    console.error("SWR Error:", error, "Key:", key);

                    let message = "Failed to load data";
                    let description = "Please try again later";

                    toast.error(message, {
                        description,
                    });
                },
                errorRetryCount: 2,
                errorRetryInterval: 3000,
            }}
        >
            {children}
        </SWRConfig>
    );
}
