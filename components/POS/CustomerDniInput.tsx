import { useActionState } from "react"
import { useEffect } from "react"
import { fetchDniAction } from "@/actions/pos/fetch-dni-action"
import { toast } from "sonner"
import { useCartStore } from "@/src/store/cartStore"
import { BsSearch } from "react-icons/bs"

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
            className="w-full mx-auto mt-10"
            noValidate
            action={dispatch}
        >
            <div className="relative flex items-center">
                <input
                    type="text"
                    id="dni"
                    name="dni"
                    placeholder="Buscar cliente por DNI"
                    className="w-full pl-4 pr-10 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                    pattern="\d{8,11}"
                    title="El DNI debe tener entre 8 y 11 dígitos"
                    maxLength={11}
                />
                <BsSearch
                    size={18}
                    className="absolute right-4 text-gray-400 pointer-events-none"
                />
            </div>
        </form>
    )
}
