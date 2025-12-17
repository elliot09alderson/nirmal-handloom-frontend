import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="container mx-auto px-6 py-24 text-off-white">
            <h1 className="text-4xl font-playfair mb-8 text-royal-gold">Cancellation & Refund Policy</h1>
            <div className="space-y-6 text-gray-300 font-lato leading-relaxed">
                <p>Last updated: December 17, 2025</p>
                <p>
                    Thank you for shopping at Nirmal Handloom. If, for any reason, You are not completely satisfied with a purchase, We invite You to review our policy on refunds and returns.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">1. Conditions for Returns</h2>
                <p>
                    In order for the Goods to be eligible for a return, please make sure that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>The Goods were purchased in the last 7 days.</li>
                    <li>The Goods are in the original packaging.</li>
                    <li>The product is unused and in the same condition that you received it.</li>
                    <li>The item must have the receipt or proof of purchase.</li>
                </ul>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">2. Goods not eligible for return</h2>
                <p>
                    The following Goods cannot be returned:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>The supply of Goods made to Your specifications or clearly personalized.</li>
                    <li>The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.</li>
                </ul>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">3. Returning Goods</h2>
                <p>
                    You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods at the following address:
                </p>
                <address className="not-italic mt-2 mb-4 bg-white/5 p-4 rounded-sm border border-white/10">
                    Nirmal Handloom<br/>
                    Returns Department<br/>
                    Shop No 5, Silk Market, Varanasi<br/>
                    Uttar Pradesh 221001, India
                </address>
                <p>
                    We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">4. Refunds</h2>
                <p>
                    Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                </p>
                <p>
                    If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">5. Contact Us</h2>
                <p>
                    If you have any questions about our Returns and Refunds Policy, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li>By email: support@nirmalhandloom.com</li>
                    <li>By phone: +91 98765 43210</li>
                </ul>
            </div>
        </div>
    );
};

export default RefundPolicy;
