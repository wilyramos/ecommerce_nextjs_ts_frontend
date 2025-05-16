import React from 'react'

export function SkeletonProduct() {
    return (
        <div className="animate-pulse flex flex-col space-y-4">
            <div className="rounded-lg bg-gray-200 h-48 w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/6"></div>
        </div>
    )
}

export function SkeletonCard() {
    return (

        <div className="animate-pulse flex flex-col space-y-4">
            <div className="rounded-lg bg-gray-200 h-48 w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/6"></div>
        </div>


       
    )
}

export function SkeletonCategory() {
    return (
        <div className="animate-pulse flex flex-col space-y-4">
            <div className="rounded-lg bg-gray-200 h-24 w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/6"></div>
        </div>
    )
}


