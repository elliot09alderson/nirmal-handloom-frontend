import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto px-6 py-24 text-off-white">
            <h1 className="text-4xl font-playfair mb-8 text-royal-gold">Privacy Policy</h1>
            <div className="space-y-6 text-gray-300 font-lato leading-relaxed">
                <p>Last updated: December 17, 2025</p>
                <p>
                    At Nirmal Handloom ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy specifically addresses how we collect, use, disclose, and safeguard your information when you visit our website nirmalhandloom.com.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">1. Collection of Information</h2>
                <p>
                    We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you give to us voluntarily when you register with the Site or when you choose to participate in various activities related to the Site.
                    </li>
                    <li>
                        <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                    </li>
                    <li>
                        <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, Razorpay, and you are encouraged to review their privacy policy and contact them directly for responses to your questions.
                    </li>
                </ul>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">2. Use of Your Information</h2>
                <p>
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Create and manage your account.</li>
                    <li>Process your payments and refunds.</li>
                    <li>Send you an email regarding your order or account status.</li>
                    <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                    <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                </ul>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">3. Disclosure of Your Information</h2>
                <p>
                    We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                    </li>
                    <li>
                        <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing (Razorpay), data analysis, email delivery, hosting services, customer service, and marketing assistance.
                    </li>
                </ul>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">4. Security of Your Information</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>

                <h2 className="text-2xl font-playfair text-white mt-8 mb-4">5. Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <address className="not-italic mt-4">
                    <strong>Nirmal Handloom</strong><br />
                    B4 wholesale cloth market, Pulgaon district durg<br />
                    CG, India<br />
                    Phone: +91 62613 41129<br />
                    Email: support@nirmalhandloom.com
                </address>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
