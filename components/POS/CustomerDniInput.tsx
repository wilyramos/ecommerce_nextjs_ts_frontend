

import { useActionState } from "react"
import { useEffect } from "react"
import { fetchDniAction } from "@/actions/pos/fetch-dni-action"
import { toast } from "sonner"
import { useCartStore } from "@/src/store/cartStore"

export default function CustomerDniInput() {

    const { setDni } = useCartStore();

    const [state, dispatch] = useActionState(fetchDniAction, {
        errors: [],
        success: "",
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            const dni = state.success.replace("DNI registrado correctamente: ", "");
            setDni(dni);
        }

    }, [state, setDni])


    return (
        <form
            className='flex flex-col gap-4 w-full max-w-md mx-auto mt-10'
            noValidate
            action={dispatch}
        >

            <div className="flex justify-between items-center gap-2">
                <input
                    type="text"
                    id="dni"
                    name="dni"
                    placeholder="Ingrese el DNI del cliente"
                    className="w-full px-2 py-1 border border-gray-300 rounded "
                    required
                    pattern="\d{8,11}" // Validación para DNI peruano (8 a 11 dígitos)
                    title="El DNI debe tener entre 8 y 11 dígitos"
                    maxLength={11}

                />
            </div>

        </form>
    )
}