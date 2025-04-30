

export default function ForgotPasswordForm() {
    return (
        <form
            className="mt-2 space-y-2 text-gray-700"
            noValidate
            // action={}
        >
            <div className="flex flex-col gap-1">
                <label
                    className="font-bold "
                    htmlFor="email"
                >Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email de Registro"
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    name="email"
                />
            </div>
        </form>
    )
}