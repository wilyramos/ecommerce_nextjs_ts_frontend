import SidebarPages from "@/components/home/pages/SidebarPages";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-[var(--store-bg)] min-h-screen py-12 md:py-20">
            <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-6">
                <SidebarPages />
                <main className="flex-1 md:pl-6">{children}</main>
            </div>
        </main>
    );
}