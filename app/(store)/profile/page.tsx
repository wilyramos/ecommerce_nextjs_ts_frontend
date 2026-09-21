// File: frontend/app/(store)/profile/page.tsx
import { redirect } from "next/navigation";
import { getTokenOptional } from "@/src/auth/dal";
import { userService } from "@/src/services/user-v3.service";
import { ProfileForm } from "@/src/components/profile-v3/ProfileForm";

export default async function ProfilePage() {
    const token = await getTokenOptional();
    if (!token) {
        redirect("/auth/login?redirect=/profile");
    }

    let user = null;
    try {
        user = await userService.getProfile(token);
    } catch (error) {
        console.error("[ProfilePage] Error fetching user profile:", error);
        redirect("/auth/login?redirect=/profile");
    }

    return <ProfileForm initialUser={user} />;
}