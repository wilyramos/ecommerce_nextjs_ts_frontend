import { getCurrentUser } from "@/src/auth/currentUser";
import ProfileForm from "@/components/profile/ProfileForm";
import { HeadingH1 } from "@/components/ui/Heading";
import Link from "next/link";
import { FiLock, FiUser } from "react-icons/fi";

export default async function AdminProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl border border-gray-200 mx-auto">
                <p className="text-red-500">No se ha encontrado el usuario.</p>
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto p-6">
            <HeadingH1>Perfil de {user.nombre}</HeadingH1>

            {/* Acciones minimalistas */}
            <div className="flex items-center gap-6 my-6 text-gray-700 text-sm">
                <Link
                    href="/admin/profile/change-password"
                    className="flex items-center gap-1 border-b border-transparent hover:border-gray-800 transition-colors"
                >
                    <FiLock className="text-base" />
                    Cambiar contraseña
                </Link>
                <Link
                    href="/admin/profile"
                    className="flex items-center gap-1 border-b border-transparent hover:border-gray-800 transition-colors"
                >
                    <FiUser className="text-base" />
                    Perfil
                </Link>
            </div>

            {/* Formulario de perfil */}
            <div>
                <ProfileForm user={user} />
            </div>
        </section>
    );
}
