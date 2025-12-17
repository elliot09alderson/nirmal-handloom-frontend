import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="container mx-auto px-6 py-24 text-off-white">
            <h1 className="text-4xl font-playfair mb-8 text-royal-gold">Shipping & Delivery Policy</h1>
            <div className="space-y-6 text-gray-300 font-lato leading-relaxed">
                <p>Last updated: December 17, 2025</p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">1. Shipment Processing Time</h2>
                <p>
                    All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
                <p>
                    Shipping charges for your order will be calculated and displayed at checkout.
                </p>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white/5 border border-white/10 text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-royal-gold">
                                <th className="py-3 px-4">Shipping Method</th>
                                <th className="py-3 px-4">Estimated Delivery Time</th>
                                <th className="py-3 px-4">Shipment Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-white/5">
                                <td className="py-3 px-4">Standard Shipping (India)</td>
                                <td className="py-3 px-4">5-7 business days</td>
                                <td className="py-3 px-4">Free</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-3 px-4">Express Shipping</td>
                                <td className="py-3 px-4">2-3 business days</td>
                                <td className="py-3 px-4">₹250</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">3. Shipment Confirmation & Order Tracking</h2>
                <p>
                    You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">4. Customs, Duties and Taxes</h2>
                <p>
                    Nirmal Handloom is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">5. Damages</h2>
                <p>
                    Nirmal Handloom is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
                </p>
            </div>
        </div>
    );
};

export default ShippingPolicy;
