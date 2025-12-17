import React, { useEffect, useState, useContext } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { user } = useContext(AuthContext);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        subcategory: '', // Can be empty if not selected
        countInStock: '',
        image: '' // URL for now, upload logic would go here ideally or external URL
    });
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get(`/products?pageNumber=${page}`);
            setProducts(data.products);
            setPage(data.page);
            setPages(data.pages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products", error);
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

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category?._id || product.category,
            subcategory: product.subcategory || '',
            countInStock: product.countInStock,
            image: product.image
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            category: '', // Reset
            subcategory: '',
            countInStock: '',
            image: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // In a real app, handle image upload via FormData here
            // const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            // For now sending JSON with image URL
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
            alert("Error saving product: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-playfair text-off-white">Products</h1>
                <button 
                    onClick={handleCreate}
                    className="bg-royal-gold text-royal-blue px-4 py-2 rounded-sm font-bold flex items-center gap-2 hover:bg-white transition-colors"
                >
                    <FiPlus /> Add Product
                </button>
            </div>

            {loading ? (
                <p className="text-white">Loading...</p>
            ) : (
                <div className="bg-white/5 rounded-sm border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-off-white">
                        <thead className="bg-white/10 text-royal-gold uppercase text-sm">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-white/5">
                                    <td className="p-4 text-xs font-mono opacity-70">{product._id.substring(20)}...</td>
                                    <td className="p-4">{product.name}</td>
                                    <td className="p-4">₹{product.price}</td>
                                    <td className="p-4">{product.category?.name || 'Unknown'}</td>
                                    <td className="p-4 flex gap-3">
                                        <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-white"><FiEdit2 /></button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-white"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Pagination Controls could go here */}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-royal-blue border border-white/20 p-8 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-playfair text-off-white">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><FiX size={24}/></button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-royal-gold mb-1">Name</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/20 p-2 text-white" 
                                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-royal-gold mb-1">Price</label>
                                    <input type="number" required className="w-full bg-white/5 border border-white/20 p-2 text-white" 
                                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm text-royal-gold mb-1">Stock</label>
                                    <input type="number" required className="w-full bg-white/5 border border-white/20 p-2 text-white" 
                                        value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-royal-gold mb-1">Category</label>
                                <select required className="w-full bg-white/5 border border-white/20 p-2 text-white" 
                                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm text-royal-gold mb-1">Image URL</label>
                                <input type="text" required className="w-full bg-white/5 border border-white/20 p-2 text-white" 
                                    value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm text-royal-gold mb-1">Description</label>
                                <textarea required rows="4" className="w-full bg-white/5 border border-white/20 p-2 text-white" 
                                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            
                            <button type="submit" className="w-full bg-royal-gold text-royal-blue font-bold py-3 mt-4 hover:bg-white">{editingProduct ? 'Update Product' : 'Create Product'}</button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminProducts;
