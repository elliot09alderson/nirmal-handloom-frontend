import React, { useEffect, useState, useContext } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api, { getImageUrl } from '../../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiPackage, FiImage, FiUploadCloud } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        subcategory: '', 
        countInStock: '',
        isActive: true,
        discount: 0
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // For editing, keep track of existing URLs

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]); 

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page]);

    // Clean up object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get(`/products?page=${page}&limit=20&showAll=true`);
            if (data && data.products && Array.isArray(data.products)) {
                setProducts(data.products);
                setPage(data.page || 1);
                setPages(data.pages || 1);
            } else {
                 console.error("Invalid response format:", data);
                 setProducts([]); 
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products", error);
            setProducts([]); // Ensure valid array on error
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const [selectedProducts, setSelectedProducts] = useState([]);

    // Select All Handler
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allProductIds = filteredProducts.map(p => p._id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    // Single Select Handler
    const handleSelectProduct = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;
        
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            try {
                await api.post('/products/delete-many', { ids: selectedProducts });
                setSelectedProducts([]);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting products", error);
                alert("Error deleting products: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category?._id || product.category,
            subcategory: product.subcategory || '',
            countInStock: product.countInStock,
            isActive: product.isActive,
            discount: product.discount
        });
        // Set existing images
        const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
        setExistingImages(images);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            category: '', 
            subcategory: '',
            countInStock: '',
            isActive: true,
            discount: 0
        });
        setExistingImages([]);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (product) => {
         try {
            const newStatus = !product.isActive;
            setProducts(products.map(p => p._id === product._id ? { ...p, isActive: newStatus } : p));
            await api.put(`/products/${product._id}`, { isActive: newStatus });
        } catch (error) {
            console.error("Error updating product status", error);
            fetchProducts();
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]); // Append new files
            
            // Create previews
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare FormData
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('price', formData.price);
        submitData.append('description', formData.description);
        submitData.append('category', formData.category);
        submitData.append('countInStock', formData.countInStock);
        submitData.append('isActive', formData.isActive);
        submitData.append('discount', formData.discount);
        if (formData.subcategory) submitData.append('subcategory', formData.subcategory);

        // Append images
        selectedFiles.forEach(file => {
            submitData.append('images', file);
        });

        // For editing: If no new files, we might need to send existing image URL to keep it?
        // Our backend logic: if req.files exists, it replaces images. 
        // If we want to ADD to existing, backend needs to change or we handle it here logic.
        // Current Backend Logic: replaced if req.files.length > 0.
        // User asked: "preview there itself" in "add product".
        // Let's stick to standard multipart submit. URL handling might be tricky if mixed.
        // For now, if new files uploaded, they replace/add (depending on backend).
        // My backend logic replaces `images` array if new files are sent.
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (editingProduct) {
                // If editing and no new files selected, we don't send 'images' field so backend keeps existing.
                // If new files selected, they will REPLACE existing in current backend logic.
                // If user wants to keep existing + add new, backend needs refactor to append. 
                // Given implicit requirement usually implies "Add", but for MVP "Replace" is safer implementation 
                // unless I refactor backend to merge.
                // Refactoring backend to merge might be safer for "Add Product" flow (fresh), 
                // but for "Edit", users might assume replace. 
                // Let's assume replace for now or if selectedFiles is empty, it keeps old.
                await api.put(`/products/${editingProduct._id}`, submitData, config);
            } else {
                await api.post('/products', submitData, config);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
            alert("Error saving product: " + (error.response?.data?.message || error.message));
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to render image source (handle local uploads vs external URLs)
    // Now uses the centralized getImageUrl utility
    const renderImageSrc = (img) => getImageUrl(img);

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-playfair text-off-white">Product Inventory</h1>
                <div className="flex gap-4 w-full md:w-auto items-center">
                    {selectedProducts.length > 0 && (
                        <button 
                            onClick={handleBulkDelete}
                            className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-500/30 transition-all"
                        >
                            <FiTrash2 /> Delete ({selectedProducts.length})
                        </button>
                    )}

                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-royal-gold transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="bg-royal-gold text-royal-blue px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-lg hover:shadow-royal-gold/20"
                    >
                        <FiPlus /> New Product
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-gold"></div>
                </div>
            ) : (
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-off-white">
                            <thead className="bg-white/5 text-royal-gold uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="p-5 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded border-white/20 bg-white/10 text-royal-gold focus:ring-royal-gold"
                                            checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-5">Product Details</th>
                                    <th className="p-5">Price & Stock</th>
                                    <th className="p-5">Category</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredProducts.map((product) => (
                                    <motion.tr 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={product._id} 
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-5">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 rounded border-white/20 bg-white/10 text-royal-gold focus:ring-royal-gold"
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={() => handleSelectProduct(product._id)}
                                            />
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                                                    {product.image ? (
                                                        <img 
                                                            src={getImageUrl(product.image)} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover" 
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-500"><FiImage /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">ID: {product._id.substring(20)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="font-bold text-royal-gold">₹{product.price}</p>
                                            <p className={`text-xs ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                                            </p>
                                        </td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <button 
                                                onClick={() => handleStatusToggle(product)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${product.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30'}`}
                                            >
                                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                                {product.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(product)} className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors"><FiEdit2 /></button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-royal-blue border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        >
                             <div className="sticky top-0 bg-royal-blue/95 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-playfair text-off-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"><FiX size={24}/></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Product Name</label>
                                    <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold transition-colors" 
                                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-400">₹</span>
                                            <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 p-3 text-white focus:outline-none focus:border-royal-gold transition-colors" 
                                                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Stock Quantity</label>
                                        <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold transition-colors" 
                                            value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Category</label>
                                        <select required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold transition-colors appearance-none" 
                                            value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                            <option value="" className="bg-royal-blue text-gray-400">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id} className="bg-royal-blue">{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                     <div>
                                        <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Visibility</label>
                                        <div className="flex items-center gap-4 p-3 border border-white/10 rounded-xl bg-white/5">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.isActive} 
                                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-royal-gold focus:ring-royal-gold"
                                                />
                                                <span className="text-sm text-gray-300">Active (Visible to customers)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                 <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Images</label>
                                    
                                    {/* Existing Images (Edit Mode) */}
                                    {existingImages.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-400 mb-2">Existing Images</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {existingImages.map((img, idx) => (
                                                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                                                        <img 
                                                            src={getImageUrl(img)} 
                                                            alt={`Existing ${idx}`} 
                                                            className="w-full h-full object-cover" 
                                                            onError={(e) => { e.target.style.display = 'none'; }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Area */}
                                     {/* Hidden File Input */}
                                     <input 
                                        type="file" 
                                        id="file-upload"
                                        multiple 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 hover:border-royal-gold transition-all cursor-pointer group"
                                    >
                                        <FiUploadCloud size={32} className="text-gray-400 group-hover:text-royal-gold mb-2 transition-colors" />
                                        <p className="text-sm text-gray-300">Click to upload images</p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                                    </label>

                                    {/* Previews */}
                                    {previewUrls.length > 0 && (
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            <AnimatePresence>
                                                {previewUrls.map((url, index) => (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        key={url} 
                                                        className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group"
                                                    >
                                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeSelectedFile(index)}
                                                            className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <FiX size={12} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-royal-gold mb-2 font-bold">Description</label>
                                    <textarea required rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-royal-gold transition-colors" 
                                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                                </div>
                                
                                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold">Cancel</button>
                                    <button type="submit" className="px-6 py-3 rounded-xl bg-royal-gold text-royal-blue font-bold hover:bg-white transition-colors shadow-lg shadow-royal-gold/20">
                                        {editingProduct ? 'Save Changes' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};
export default AdminProducts;
