import React from 'react'
import NavBar from "@/components/navigation/NavBar";

export default function layout({ children }: { children : React.ReactNode }) {
    return (
        <>
            <NavBar />
            <main>
                {children}
            </main>
        </>
    )
}