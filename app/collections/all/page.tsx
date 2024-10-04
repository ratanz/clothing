'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount?: number;
  status?: string;
}

const categories = ['New', 'Hoodies', 'Tees', 'Jackets', 'Pants', 'Skate']

export default function CollectionPage() {
  const { data: session } = useSession()
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data as Product[])
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ToastContainer />
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/video/starseffect.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative p-10 z-10 min-h-screen bg-black bg-opacity-50 text-white">
        <header className="p-4 pl-10 flex justify-between items-center">
          <nav>
            <Link href="/shop" className="mr-4 hover:text-gray-300">Shop</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </nav>
          <div className="flex-1 flex justify-center">
            <Image src="/images/textlogo.png" alt="Logo" width={100} height={50} className="mx-auto text-white" />
          </div>
          <div className="flex items-center justify-center w-fit ">
            <Search className="w-6 h-6 mr-4 cursor-pointer" />
            <Link href="/cart" className="flex items-center cursor-pointer mr-4">
              <ShoppingCart className="w-6 h-6 mr-2" />
              <span>Cart ({cart.length})</span>
            </Link>
            {session ? (
              <div className="flex items-center">
                <span className="mr-2">{session.user?.name}</span>
                <button onClick={() => signOut()} className="bg-red-500 text-white px-2 py-1 rounded">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/signup">
                <User className="w-6 h-6 cursor-pointer" />
              </Link>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex">
            <aside className="w-1/5 p-10  pr-4">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <ul>
                {categories.map((category, index) => (
                  <li key={index} className="mb-2">
                    <Link href="#" className="hover:text-gray-300">{category}</Link>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="w-full h-full">
              <div className="flex gap-8 flex-row">
                {products.map((product) => (
                  <div key={product._id} className="relative group">
                    <div className="w-full mb-4 border-2 border-white rounded-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        objectFit="cover"
                        className="rounded-lg transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute flex items-center justify-center w-full top-52 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-white text-black py-2 px-4 mb-4 rounded-md transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 mb-2">{product.description}</p>
                    <p className="text-sm text-gray-400">
                      ₹{product.price.toFixed(2)}
                      {product.discount && (
                        <>
                          {' '}
                          <span className="line-through">₹{(product.price - product.discount).toFixed(2)}</span>
                        </>
                      )}
                    </p>
                    {product.status && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}