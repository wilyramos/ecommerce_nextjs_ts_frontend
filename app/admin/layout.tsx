import Logo from "@/components/ui/Logo"
import { verifySession } from '@/src/auth/dal'




export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    
    
    await verifySession();
    
    return (
        <div>
            <h1>Admin Layout</h1>
            {children}
        </div>
    )
}