import Footer from "@/components/home/Footer"
import NavBar from "@/components/navigation/NavBar"


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col min-h-screen ">

                <NavBar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>

        </>
    )
}


