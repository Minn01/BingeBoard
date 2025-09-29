'use client'
import React from 'react'
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
    setIsSuccessful: React.Dispatch<React.SetStateAction<boolean>>
    setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>
}

function LogoutButton(
    { setIsSuccessful, setIsNavigating } : LogoutButtonProps
) {
    return (
        <button 
            onClick={async () => {
                setIsNavigating(true)
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    setIsNavigating(false);
                    setIsSuccessful(true);
                    // Redirect to login page on successful logout
                    
                } else {
                    window.alert("an error occurred during calling logout endpoint");
                }
            }} 
            title="Logout"
            className="ml-2 hover:text-red-200">
            <LogOut className="w-6 h-6" />
        </button>
    )
}

export default LogoutButton