import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    productTitle: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    if (images.length === 0) {
        return (
            <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-lg bg-gray-50 aspect-square">
            <div className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((src, index) => (
                    <div key={index} className="min-w-full h-full flex-shrink-0">
                        <img
                            src={src}
                            alt={`${productTitle} - Image ${index + 1}`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm text-gray-800 shadow-md hover:bg-white transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm text-gray-800 shadow-md hover:bg-white transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-slate-900' : 'bg-gray-300'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageGallery;