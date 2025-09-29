

import { Switch } from "@/components/ui/switch"



export default function CategorySwitches({ isActive }: { isActive?: boolean }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4 max-w-xs mx-auto border p-4 rounded bg-gray-50">
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">¿Categoría activa?</label>
                <Switch id="isActive" defaultChecked={isActive} />
            </div>

            <input className="hidden" name="isActive" defaultValue={isActive ? "true" : "false"} />
        </div>
    )
}