// File: frontend/app/(store)/legal/layout.tsx

import SidebarPages from "@/components/home/pages/SidebarPages";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="flex w-full max-w-screen-2xl mx-auto px-4 md:px-8 pt-8 pb-24 md:pb-8 gap-0 md:gap-8">
                <SidebarPages />
                <section className="flex-1 min-w-0">
                    {children}
                </section>
            </div>
        </main>
    );
}