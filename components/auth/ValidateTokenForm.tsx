import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { validateToken } from "@/actions/validate-token-action";
import { useActionState } from "react";
import { toast } from "react-toastify";


type validateTokenProps = {
    setIsValidToken: Dispatch<SetStateAction<boolean>>
    token: string
    setToken: Dispatch<SetStateAction<string>>
}
export default function ValidateTokenForm( { setIsValidToken, token, setToken }: validateTokenProps ) { 

    const [ isComplete, setIsComplete ] = useState(false)

    // send token to server
    const validateTokenInput = validateToken.bind(null, token)
    const [ state, dispatch ] = useActionState(validateTokenInput, {
        errors: [],
        success: ""
    })


    useEffect(() => {
        if(state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
            })
        }
        if(state.success) {
            toast.success(state.success)
            setIsValidToken(true)
        }
    }, [state, setIsValidToken])

    const handleChange = (token: string) => {
        setIsComplete(false)
        setToken(token)
    }

    const handleComplete = () => {
        setIsComplete(true)
    }

    return (
        <form action={dispatch} className="hidden">
            <div className="flex justify-center gap-5 my-10">
                <PinInput
                    value={token}
                    onChange={handleChange}
                    onComplete={handleComplete}
                >
                    <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                    <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                    <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                    <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                    <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                    <PinInputField className="h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white" />
                </PinInput>
                <button
                    type="submit"
                    className={`h-10 w-10 text-center border border-gray-300 shadow rounded-lg placeholder-white ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    {isComplete ? '✓' : 'Submit'}
                </button>

            </div>
        </form>
    );
}