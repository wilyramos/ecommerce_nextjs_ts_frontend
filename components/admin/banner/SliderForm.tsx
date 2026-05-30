"use client";

import Alert from "@/components/ui/Alert";
import { type SliderBanner } from "@/src/schemas/slider.schema";
import GeneralSection from "./form-sections/GeneralSection";
import PromoSection from "./form-sections/PromoSection";
import AppearanceSection from "./form-sections/AppearanceSection";
import ScheduleSection from "./form-sections/ScheduleSection";

interface SliderFormProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
    generalError?: string;
}

export default function SliderForm({
    initialData,
    fields,
    fieldErrors,
    generalError,
}: SliderFormProps) {

    return (
        <div className="space-y-4">
            {generalError && (
                <Alert variant="error" mode="banner">{generalError}</Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-2">
                {/* COLUMNA PRINCIPAL */}
                <div className="lg:col-span-3 space-y-6">
                    <GeneralSection initialData={initialData} fields={fields} fieldErrors={fieldErrors} />
                    <PromoSection initialData={initialData} fields={fields} fieldErrors={fieldErrors} />
                </div>

                {/* COLUMNA LATERAL */}
                <aside className="space-y-6">
                    <AppearanceSection initialData={initialData} fields={fields} />
                    <ScheduleSection initialData={initialData} fieldErrors={fieldErrors} />
                </aside>
            </div>
        </div>
    );
}