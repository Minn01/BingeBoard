"use client";

import Header from "./Header"
import { usePathname } from "next/navigation";

interface LayoutClientProps {
    children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
    const pathname = usePathname();
    const isAuthRoute = ['/login', '/signup'].includes(pathname);

    return (
        <>
            {!isAuthRoute && <Header />}
            <main className={isAuthRoute ? '' : 'pt-18'}>
                {children}
            </main>
        </>
    );
}