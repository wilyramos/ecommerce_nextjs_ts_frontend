import React from "react"
import { FaShoppingCart } from "react-icons/fa"
import ItemCarrito from "@/components/cart/ItemCarrito"
import { useCartStore } from "@/src/store/cartStore"
import ResumenCarrito from "@/components/cart/ResumenCarrito";


export default function CarritoPage() {


    return (
        <main className="max-w-6xl mx-auto px-10 py-5">

            <div className="grid gap-6 ">
                <section className="lg:col-span-2 space-y-4">
                    <div className="">
                        <ResumenCarrito />
                    </div>

                </section>



            </div>
        </main>
    );
}