// File: frontend/app/admin/pages/[id]/page.tsx

import { notFound } from "next/navigation";
import { PageService } from "@/src/modules/page/page.service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditPageForm from "@/src/modules/page/admin/EditPageForm";

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminEditPage({ params }: EditPageProps) {
    const { id } = await params;

    try {
        const res = await PageService.getPageById(id);
        const pageData = res?.data;

        if (!pageData) {
            notFound();
        }

        return (
            <AdminPageWrapper
                title={`Editar Página: ${pageData.title}`}
                breadcrumbItems={[
                    { label: "Panel", href: "/admin" },
                    { label: "Páginas", href: "/admin/pages" }
                ]}
                breadcrumbCurrent="Editar"
                showBackButton={true}
            >
                <div className="max-w-7xl mx-auto">
                    <EditPageForm 
                        initialData={{
                            id: pageData._id,
                            title: pageData.title,
                            slug: pageData.slug,
                            content: pageData.content,
                            isActive: pageData.isActive,
                            seo: {
                                metaTitle: pageData.seo?.metaTitle || "",
                                metaDescription: pageData.seo?.metaDescription || ""
                            }
                        }} 
                    />
                </div>
            </AdminPageWrapper>
        );
    } catch {
        notFound();
    }
}