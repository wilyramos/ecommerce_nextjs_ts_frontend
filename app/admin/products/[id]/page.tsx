import React from 'react'

type params = Promise<{
  id: string;
}>; // This is a promise that resolves to an object with an id property

export default async function ProductDetailsPage({ params }: { params: params }) {
  const { id } = await params;

  return (
    <div>ProductDetailsPage {id}</div>
  )
}
