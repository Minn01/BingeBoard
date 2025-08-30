"use client";

import Header from "./Header"
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: LayoutClientProps) {
    const pathName = usePathname();
    const isAuthRoute = ['/login', '/signup'].includes(pathName) 

    return (
        <>
            {!isAuthRoute && <Header />}
            <main className={isAuthRoute ? '' : 'pt-[74px]'}>
                {children}
            </main>
        </>
    );
}

type LayoutClientProps = {
    children: React.ReactNode;
}
