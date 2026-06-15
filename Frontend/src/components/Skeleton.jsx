import React from 'react';

/**
 * Reusable Skeleton loader component with smooth pulsing animation.
 * 
 * @param {object} props
 * @param {'text' | 'circular' | 'rectangular' | 'rounded'} [props.variant='text'] - The shape of the skeleton
 * @param {string|number} [props.width] - Custom width (e.g., '100%', '200px', 40)
 * @param {string|number} [props.height] - Custom height (e.g., '20px', 16)
 * @param {string} [props.className=''] - Additional Tailwind CSS classes
 */
const Skeleton = ({ 
    variant = 'text', 
    width, 
    height, 
    className = '' 
}) => {
    // Determine base shape styles
    let variantClass = 'rounded-md';
    if (variant === 'circular') {
        variantClass = 'rounded-full';
    } else if (variant === 'rectangular') {
        variantClass = 'rounded-none';
    } else if (variant === 'rounded') {
        variantClass = 'rounded-xl';
    }

    // Compose style object for custom dimensions
    const style = {};
    if (width !== undefined) {
        style.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
        style.height = typeof height === 'number' ? `${height}px` : height;
    }

    // Default classes: pulse animation and slate-200 base background color
    const baseClasses = 'animate-pulse bg-slate-200/80 dark:bg-slate-700/50';

    // If height is not specified, use default height based on variant
    const defaultHeightClass = !height && variant === 'text' ? 'h-4' : '';

    return (
        <div
            className={`${baseClasses} ${variantClass} ${defaultHeightClass} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
