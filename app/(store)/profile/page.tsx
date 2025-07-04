import { getCurrentUser } from "@/src/auth/currentUser"
import ProfileForm from "@/components/user/ProfileForm";


export default async function ProfilePage() {
    const user = await getCurrentUser();

    // console.log('User profile:', user);

    // get current user
    if (!user) {
        return (
            <div>
                <h1 className='text-2xl font-bold mb-4'>Perfil de usuario</h1>
                <p>No se ha encontrado el usuario.</p>
            </div>
        );
    }

    

    return (
        <>
            <div>
                <h1 className='text-2xl font-bold mb-4'>Perfil de usuario</h1>
                <ProfileForm user={user} />
            </div>
        </>
    )
}
