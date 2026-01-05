import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiPlus, FiMapPin, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        phone: '',
        isDefault: false,
        latitude: null,
        longitude: null
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get('/users/address');
            setAddresses(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse Geocoding using OpenStreetMap (Nominatim)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    const address = data.address;
                    setFormData(prev => ({
                        ...prev,
                        street: address.road || address.house_number || '',
                        city: address.city || address.town || address.village || address.county || '',
                        state: address.state || '',
                        zip: address.postcode || '',
                        country: address.country || 'India',
                        latitude,
                        longitude
                    }));
                    setLocationLoading(false);
                } catch (error) {
                    console.error("Error fetching address details:", error);
                    alert("Located coordinates but failed to get address details. You can fill them manually.");
                    // Still save coords
                     setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude
                    }));
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert('Unable to retrieve your location');
                setLocationLoading(false);
            }
        );
    };

    const handleEdit = (addr) => {
        setEditingId(addr._id);
        setFormData({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            country: addr.country,
            phone: addr.phone,
            isDefault: addr.isDefault,
            latitude: addr.latitude,
            longitude: addr.longitude
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const { data } = await api.delete(`/users/address/${id}`);
                setAddresses(data); 
            } catch (error) {
                console.error(error);
                alert("Failed to delete address");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { data } = await api.put(`/users/address/${editingId}`, formData);
                setAddresses(data);
            } else {
                const { data } = await api.post('/users/address', formData);
                setAddresses(data);
            }
            setIsFormOpen(false);
            setEditingId(null);
            setFormData({
                street: '',
                city: '',
                state: '',
                zip: '',
                country: 'India',
                phone: '',
                isDefault: false,
                latitude: null,
                longitude: null
            });
        } catch (error) {
            console.error(error);
            alert("Failed to save address");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
             <div className="flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <div>
                    <h2 className="text-2xl font-playfair text-off-white">My Addresses</h2>
                    <p className="text-sm text-gray-400">Manage your shipping addresses ({addresses.length}/4)</p>
                </div>
                {addresses.length < 4 && !isFormOpen && (
                    <button 
                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                        className="bg-royal-gold text-royal-blue px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-lg hover:shadow-royal-gold/20"
                    >
                        <FiPlus /> Add New
                    </button>
                )}
            </div>

            {/* Address Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-playfair text-royal-gold">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                                <div className="flex items-center gap-3">
                                     <button 
                                        type="button"
                                        onClick={detectLocation}
                                        disabled={locationLoading}
                                        className="text-xs bg-royal-blue text-royal-gold border border-royal-gold px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-royal-gold hover:text-royal-blue transition-colors"
                                    >
                                        <FiMapPin /> {locationLoading ? 'Locating...' : 'Use Current Location'}
                                    </button>
                                    <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Street Address</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold" 
                                        value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">City</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold" 
                                        value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">State</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold" 
                                        value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">ZIP Code</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold" 
                                        value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Phone</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold" 
                                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <input type="checkbox" id="isDefault" className="w-5 h-5 accent-royal-gold"
                                        checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                                    <label htmlFor="isDefault" className="text-gray-300">Set as default address</label>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 rounded-xl text-white hover:bg-white/10">Cancel</button>
                                    <button type="submit" className="bg-royal-gold text-royal-blue px-8 py-2 rounded-xl font-bold hover:bg-white transition-all shadow-lg">{editingId ? 'Update' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={addr._id} 
                        className={`p-6 rounded-2xl border ${addr.isDefault ? 'border-royal-gold bg-royal-gold/5' : 'border-white/10 bg-white/5'} backdrop-blur-md relative group`}
                    >
                        {addr.isDefault && (
                            <span className="absolute top-4 right-4 bg-royal-gold text-royal-blue text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <FiCheck /> Default
                            </span>
                        )}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-white/10 rounded-full text-royal-gold">
                                <FiMapPin size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-white text-lg">{addr.street}</p>
                                <p className="text-gray-400">{addr.city}, {addr.state} - {addr.zip}</p>
                                <p className="text-gray-400">{addr.country}</p>
                                <p className="text-sm text-gray-500 mt-2 font-mono">{addr.phone}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(addr)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"><FiEdit2 /></button>
                            <button onClick={() => handleDelete(addr._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><FiTrash2 /></button>
                        </div>
                    </motion.div>
                ))}
                {addresses.length === 0 && !loading && !isFormOpen && (
                    <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                         No addresses saved yet. Add one now!
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ManageAddresses;
