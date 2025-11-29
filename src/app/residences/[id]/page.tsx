"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Check, Calendar, Star, Share2, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ReservationModal from "@/components/ReservationModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

interface Residence {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  subImages?: string[];
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
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchResidence = async () => {
      try {
        const docRef = doc(db, "residences", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Residence;
          // Mock subImages if they don't exist
          if (!data.subImages || data.subImages.length === 0) {
            data.subImages = [
              data.image,
              data.image, // In a real app, these would be different images
              data.image,
              data.image,
            ];
          }
          setResidence({ ...data, id: docSnap.id });
          setActiveImage(data.image);
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

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
      <div className="relative h-[85vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={activeImage || residence.image}
            alt={residence.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        <div className="absolute top-24 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link 
              href="/#residences" 
              className="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collection
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="container mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-4xl"
            >
              <motion.div variants={fadeIn} className="flex items-center gap-4 mb-4">
                <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                  Exclusive
                </span>
                <div className="flex items-center text-sm font-medium tracking-wide">
                  <MapPin className="w-4 h-4 mr-1" />
                  {residence.location}
                </div>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight">
                {residence.name}
              </motion.h1>
              
              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-8 text-lg">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 opacity-80" />
                  <span>{residence.features.beds} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 opacity-80" />
                  <span>{residence.features.baths} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 opacity-80" />
                  <span>{residence.features.sqft} sqft</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Thumbs (Floating) */}
      <div className="container mx-auto px-6 -mt-16 relative z-10 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-4 rounded-xl shadow-xl border border-zinc-100"
        >
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
            {residence.subImages?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden group ${activeImage === img ? 'ring-2 ring-zinc-900' : ''}`}
              >
                <Image
                  src={img}
                  alt={`View ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${activeImage === img ? 'bg-transparent' : ''}`} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left Column: Details */}
            <div className="w-full lg:w-2/3 space-y-16">
              
              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif text-zinc-900 mb-6">About this Residence</h2>
                <p className="text-zinc-600 leading-relaxed text-lg font-light text-justify">
                  {residence.description}
                </p>
                <p className="mt-4 text-zinc-600 leading-relaxed text-lg font-light text-justify">
                  Experience the epitome of luxury living in this meticulously designed sanctuary. 
                  Every detail has been crafted to offer an unparalleled lifestyle of comfort and elegance.
                  From the moment you step inside, you are greeted by an atmosphere of sophistication and tranquility.
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-serif text-zinc-900 mb-8">Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {["Private Pool", "Ocean View", "Smart Home", "Wine Cellar", "Home Theater", "24/7 Security", "Private Gym", "Chef's Kitchen", "Spa"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-zinc-900">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-serif text-zinc-900">Location</h3>
                  <p className="text-zinc-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {residence.location}
                  </p>
                </div>
                <div className="w-full h-[400px] bg-zinc-100 rounded-2xl overflow-hidden shadow-inner border border-zinc-200 relative group">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapsUrl}
                    allowFullScreen
                    className="grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 pointer-events-none border-4 border-white/50 rounded-2xl" />
                </div>
              </motion.div>

            </div>

            {/* Right Column: Sticky Reservation */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm text-zinc-400 uppercase tracking-wider font-medium mb-1">Price per night</p>
                      <div className="text-4xl font-serif text-zinc-900">{residence.price}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-zinc-900">4.98</span>
                      <span className="text-zinc-400">(128 reviews)</span>
                    </div>
                    <div className="h-px bg-zinc-100" />
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Check-in</span>
                      <span className="text-zinc-900 font-medium">3:00 PM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Check-out</span>
                      <span className="text-zinc-900 font-medium">11:00 AM</span>
                    </div>
                  </div>
                  
                  {residence.sold ? (
                    <div className="w-full py-4 bg-zinc-100 text-zinc-400 font-bold tracking-widest uppercase text-center rounded-xl cursor-not-allowed mb-4">
                      Sold Out
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-4 bg-zinc-900 text-white font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all hover:shadow-lg hover:-translate-y-1 rounded-xl mb-4 flex items-center justify-center gap-2 group"
                    >
                      <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Reserve Now
                    </button>
                  )}
                  
                  <button className="w-full py-4 border border-zinc-200 text-zinc-600 font-bold tracking-widest uppercase hover:bg-zinc-50 hover:border-zinc-300 transition-colors rounded-xl text-xs">
                    Contact Host
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-zinc-400">
                      You won't be charged yet
                    </p>
                  </div>
                </motion.div>
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
