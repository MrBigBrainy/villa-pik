"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  residenceName: string;
}

export default function ReservationModal({ isOpen, onClose, residenceName }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate reservation submission
    toast.success("Reservation request submitted successfully! We'll contact you soon.");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      message: "",
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif">Make a Reservation</h2>
            <p className="text-sm text-zinc-500 mt-1">{residenceName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Check-in Date *</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 mb-1">Check-out Date *</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Number of Guests *</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-600 mb-1">Special Requests (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:border-zinc-900"
                placeholder="Any special requests or questions?"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-zinc-900 text-white py-3 hover:bg-zinc-800 transition-colors"
              >
                Submit Reservation
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-zinc-300 text-zinc-900 py-3 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
