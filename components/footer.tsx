import React from 'react';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-white" />
                            <span className="ml-2 text-xl font-semibold text-white">Artisan</span>
                        </div>
                        <p className="text-sm">
                            Crafting premium products for those who appreciate quality and design.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Sale Items
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Gift Cards
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Help</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    Returns
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    How to Order
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm hover:text-white transition-colors">
                                    How to Track
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Mail size={16} />
                                <span className="text-sm">support@artisan.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={16} />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin size={16} />
                                <span className="text-sm">123 Artisan St, NY 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800">
                    <p className="text-sm text-center">
                        © {new Date().getFullYear()} Artisan. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;