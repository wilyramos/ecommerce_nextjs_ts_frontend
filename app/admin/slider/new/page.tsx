// File: frontend/app/admin/banner/new/page.tsx
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CreateSliderBannerForm from "@/components/admin/banner/CreateSliderBannerForm";

export default function NewSliderPage() {
    return (
        <AdminPageWrapper
            title="Nuevo Banner del Slider"
            breadcrumbItems={[
                { label: "Home", href: "/admin" },
                { label: "Slider", href: "/admin/slider" },
            ]}
            breadcrumbCurrent="Nuevo Banner"
        >
            <div className="max-w-screen-2xl mx-auto">                
                <CreateSliderBannerForm />
            </div>
        </AdminPageWrapper>
    );
}