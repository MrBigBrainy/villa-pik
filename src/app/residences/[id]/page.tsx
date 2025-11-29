"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Check, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ReservationModal from "@/components/ReservationModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

interface Residence {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  location: string;
  features: {
    beds: number;
    baths: number;
    sqft: number;
  };
  sold?: boolean;
}

export default function ResidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [residence, setResidence] = useState<Residence | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchResidence = async () => {
      try {
        const docRef = doc(db, "residences", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setResidence({ id: docSnap.id, ...docSnap.data() } as Residence);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching residence:", error);
        toast.error("Failed to load residence details");
      } finally {
        setLoading(false);
      }
    };

    fetchResidence();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!residence) {
    notFound();
    return null;
  }

  // Generate Google Maps embed URL from location
  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyASn2uBzg3uFUVALYyMem6fGN7sr7J09fQ&q=${encodeURIComponent(residence.location)}`;

  return (
    <main className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <Navbar />
      
      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        residenceName={residence.name}
      />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={residence.image}
          alt={residence.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-center text-white">
          <Link 
            href="/#residences" 
            className="inline-flex items-center text-sm font-bold tracking-widest uppercase mb-8 hover:text-zinc-300 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Link>
          <h1 className="text-5xl md:text-7xl font-serif mb-4">{residence.name}</h1>
          <div className="flex items-center text-lg font-light tracking-wide">
            <MapPin className="w-5 h-5 mr-2" />
            {residence.location}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Main Content */}
            <div className="w-full lg:w-2/3 space-y-12">
              {/* Features Grid */}
              <div className="flex flex-wrap gap-8 pb-12 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-50">
                    <Bed className="w-6 h-6 text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wide">Bedrooms</p>
                    <p className="text-xl font-serif text-zinc-900">{residence.features.beds}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-50">
                    <Bath className="w-6 h-6 text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wide">Bathrooms</p>
                    <p className="text-xl font-serif text-zinc-900">{residence.features.baths}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-50">
                    <Maximize className="w-6 h-6 text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wide">Area</p>
                    <p className="text-xl font-serif text-zinc-900">{residence.features.sqft} sqft</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-3xl font-serif mb-6">About this Residence</h2>
                <p className="text-zinc-600 leading-relaxed text-lg font-light">
                  {residence.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-2xl font-serif mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Private Pool", "Ocean View", "Smart Home System", "Wine Cellar", "Home Theater", "24/7 Security"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-600">
                      <Check className="w-5 h-5 text-zinc-900" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Maps */}
              <div>
                <h3 className="text-2xl font-serif mb-6">Location</h3>
                <div className="w-full h-96 bg-zinc-100 border border-zinc-200">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapsUrl}
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-zinc-500 mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {residence.location}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-32 bg-zinc-50 p-8 border border-zinc-100">
                <p className="text-sm text-zinc-500 uppercase tracking-wide mb-2">Price</p>
                <div className="text-4xl font-serif text-zinc-900 mb-8">{residence.price}</div>
                
                {residence.sold && (
                  <div className="mb-4 bg-red-100 text-red-700 p-3 text-center font-bold">
                    SOLD
                  </div>
                )}
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-zinc-900 text-white font-bold tracking-widest uppercase hover:bg-zinc-800 transition-colors mb-4 flex items-center justify-center gap-2" 
                  disabled={residence.sold}
                >
                  <Calendar className="w-5 h-5" />
                  {residence.sold ? "No Longer Available" : "Make Reservation"}
                </button>
                <button className="w-full py-4 border border-zinc-900 text-zinc-900 font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors">
                  Download Brochure
                </button>

                <div className="mt-8 pt-8 border-t border-zinc-200">
                  <h4 className="font-semibold mb-4">Need Help?</h4>
                  <p className="text-sm text-zinc-600 mb-2">Contact our team for more information</p>
                  <a href="tel:+66123456789" className="text-sm text-zinc-900 font-medium">+66 12 345 6789</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
