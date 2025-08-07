import { getCurrentUser } from "@/src/auth/currentUser"
import ProfileForm from "@/components/profile/ProfileForm";


export default async function ProfilePage() {
    const user = await getCurrentUser();

    // console.log('User profile:', user);

    // get current user
    if (!user) {
        return (
            <div>
                <p>No se ha encontrado el usuario.</p>
            </div>
        );
    }


    return (
        <>
            <div>
                <ProfileForm user={user} />
            </div>
        </>
    );
}
