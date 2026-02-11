"use client";
import React, { useEffect, useState } from "react";
import { Plus, MapPin, Edit2, Trash2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { profileService } from "@/lib/profileService";
import { useAuth } from "@/context/AuthContext";

export default function AddressesPage() {
    const { user, isLoading: isAuthLoading, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const loadAddresses = async () => {
        setIsLoading(true);
        try {
            await refreshProfile();
        } catch (error) {
            console.error("Failed to load addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        setDeletingId(addressId);
        try {
            await profileService.deleteAddress(addressId);
            await refreshProfile();
        } catch (error) {
            console.error("Failed to delete address:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSetDefault = async (addressId: string, addressType: string) => {
        try {
            await profileService.updateAddress(addressId, { is_default: true, address_type: addressType as any });
            await loadAddresses();
        } catch (error) {
            console.error("Failed to set default address:", error);
        }
    };

    if (isAuthLoading || (isLoading && !user?.addresses.length)) {
        return (
            <ProfileLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full" />
                </div>
            </ProfileLayout>
        );
    }

    const addresses = user?.addresses || [];

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                            Saved Locations
                        </h1>
                        <p className="text-neutral-gray text-sm">Manage your curated shipping and billing destinations</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-8 py-3 bg-primary-dark text-white rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest shadow-sm hover:shadow-lg"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        New Address
                    </button>
                </div>

                {/* Addresses Grid */}
                <AnimatePresence>
                    {addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((address) => (
                                <motion.div
                                    key={address.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-2xl border border-neutral-sand p-8 relative hover:border-[#d4af37]/30 transition-all group"
                                >
                                    {/* Default Badge */}
                                    {address.isDefault && (
                                        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            <CheckCircle size={12} strokeWidth={2.5} />
                                            Primary
                                        </div>
                                    )}

                                    {/* Address Type & Label */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-lg bg-neutral-cream">
                                            <MapPin className="text-primary-dark" size={18} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-sm font-bold text-primary-dark uppercase tracking-widest">
                                            {address.type}
                                        </span>
                                    </div>

                                    {/* Address Details */}
                                    <div className="text-sm text-neutral-gray space-y-1.5 mb-8">
                                        <p className="font-display text-lg text-primary-dark mb-2">{address.firstName} {address.lastName}</p>
                                        <p className="font-medium leading-relaxed">{address.street}</p>
                                        {address.apartment && <p className="font-medium leading-relaxed">{address.apartment}</p>}
                                        <p className="font-medium leading-relaxed">
                                            {address.city}
                                            {address.state && `, ${address.state}`} {address.zipCode}
                                        </p>
                                        <p className="font-medium leading-relaxed">{address.country}</p>

                                        <div className="pt-4 flex flex-col gap-2">
                                            {address.phone && (
                                                <p className="text-[11px] uppercase tracking-wider text-neutral-gray/70">Contact: <span className="text-primary-dark font-semibold">{address.phone}</span></p>
                                            )}
                                            {address.deliveryInstructions && (
                                                <div className="mt-2 p-3 bg-neutral-cream/30 border border-neutral-sand/30 rounded-lg">
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-gray mb-1">Inquiry/Note</p>
                                                    <p className="text-xs italic leading-relaxed">{address.deliveryInstructions}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(address.id, address.type)}
                                                className="flex-1 py-2.5 bg-neutral-cream text-primary-dark rounded-xl hover:bg-[#d4af37]/10 transition-colors text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                Set Primary
                                            </button>
                                        )}
                                        <button className="p-2.5 border border-neutral-sand rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors">
                                            <Edit2 size={16} strokeWidth={1.5} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            disabled={deletingId === address.id}
                                            className="p-2.5 border border-neutral-sand rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-50"
                                        >
                                            {deletingId === address.id ? (
                                                <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full" />
                                            ) : (
                                                <Trash2 size={16} strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-neutral-sand p-12 text-center">
                            <MapPin className="mx-auto mb-4 text-neutral-gray" size={64} />
                            <h2 className="font-display text-2xl text-primary-dark mb-2">No Addresses Saved</h2>
                            <p className="text-neutral-gray mb-6">Add your first address to make checkout faster</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-block px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-black transition-colors"
                            >
                                Add Address
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </ProfileLayout>
    );
}
