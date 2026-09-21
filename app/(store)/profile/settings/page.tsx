// File: frontend/app/(store)/profile/settings/page.tsx
import { verifySession } from "@/src/auth/dal";
import { H3, P, Hr } from "@/components/ui/TypographyV3";
import { UpdatePasswordForm } from "@/src/components/profile-v3/settings/UpdatePasswordForm";
import { LogoutButton } from "@/src/components/profile-v3/settings/LogoutButton";

export const metadata = {
    title: "Configuración | Mi Perfil",
};

export default async function ProfileSettingsPage() {
    // verifySession maneja la redirección automáticamente si no hay token válido
    await verifySession();

    return (
        <div className="space-y-6">
            <div>
                <H3>Configuración de la Cuenta</H3>
                <P className="mt-1">Gestiona la seguridad y accesos de tu cuenta.</P>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <P className="font-medium text-text-primary">Seguridad de la Contraseña</P>
                        <P className="text-xs text-text-tertiary">
                            Asegúrate de usar una contraseña larga y difícil de adivinar.
                        </P>
                    </div>

                    <UpdatePasswordForm />
                </div>

                <Hr />

                <div className="space-y-4">
                    <div>
                        <P className="font-medium text-text-primary">Sesión Activa</P>
                        <P className="text-xs text-text-tertiary">
                            Cierra la sesión en este dispositivo de forma segura.
                        </P>
                        <LogoutButton />
                    </div>
                </div>

                <Hr />

              
            </div>
        </div>
    );
}