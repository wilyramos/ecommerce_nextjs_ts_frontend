// components/admin/AdminPageWrapper.tsx
import BackButton from "@/components/ui/BackButton";

type AdminPageWrapperProps = {
    title: string;
    children: React.ReactNode;
    showBackButton?: boolean;
    actions?: React.ReactNode;
};


export default function AdminPageWrapper({ title, children, showBackButton = true, actions }: AdminPageWrapperProps) {
    return (
        <div className="flex flex-col h-full">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-200 pb-1 shrink-0">
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                <div className="flex items-center gap-2">
                    {actions}
                    {showBackButton && <BackButton />}
                </div>
            </header>

            <section className="flex flex-col flex-1 min-h-0">{children}</section>
        </div>
    );
}