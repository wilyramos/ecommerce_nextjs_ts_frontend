"use client"
import { useEffect, useState } from 'react'
import ValidateTokenForm from './ValidateTokenForm'
import ResetPasswordForm from './ResetPasswordForm'

import { useSearchParams } from 'next/navigation'



export default function PasswordResetHandler() {


    const [isValidToken, setIsValidToken] = useState(false)
    const [ token, setToken ] = useState('')

    const searchParams = useSearchParams()
    const tokenURL = searchParams.get('token');
    
    useEffect(() => {
        if (tokenURL) {
            setToken(tokenURL)
        }
    }, [tokenURL])


    return (
        <>
            {!isValidToken ?
                <ValidateTokenForm
                    setIsValidToken={setIsValidToken}
                    token={token}
                    setToken={setToken}

                /> :
                <ResetPasswordForm 
                    token={token}
                />

            }
        </>
    )
}
