'use client'
import React from 'react'
import { LogOut } from "lucide-react";

function LogoutButton() {
    return (
        <button 
            onClick={async () => {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    // Redirect to login page on successful logout
                    window.location.href = '/login';
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