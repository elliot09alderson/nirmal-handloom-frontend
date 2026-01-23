import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'Nirmal Handloom';
    const siteDescription = 'Discover the finest handloom sarees and fabrics at Nirmal Handloom. Authentic craftsmanship, premium quality, and timeless elegance.';
    const siteUrl = 'https://nirmalhandloom.in';
    const defaultImage = '/logo.png'; // Assuming there is a logo or fallback image

    return (
        <Helmet>
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name="description" content={description || siteDescription} />
            <meta name="keywords" content={keywords || 'handloom, sarees, silk, cotton, indian craftsmanship, nirmal handloom'} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
            <meta property="og:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
            <meta property="og:description" content={description || siteDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url ? `${siteUrl}${url}` : siteUrl} />
            <meta property="twitter:title" content={title ? `${title} | ${siteTitle}` : siteTitle} />
            <meta property="twitter:description" content={description || siteDescription} />
            <meta property="twitter:image" content={image || defaultImage} />
            
            <link rel="canonical" href={url ? `${siteUrl}${url}` : siteUrl} />
        </Helmet>
    );
};

export default SEO;
