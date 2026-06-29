import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiDownload, FiMail, FiCheckCircle, FiShield, FiZap, FiDatabase,
    FiMapPin, FiFileText, FiLock, FiUserPlus, FiArrowRight, FiArrowDown
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '919930994315';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20SD%20CodeHub%2C%20I%20have%20a%20question%20about%20Data%20Extractor`;
const EMAIL_LINK = 'mailto:sdcodehub@gmail.com';
const DOWNLOAD_URL = '/sd-extractor.zip';

const Home = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100">

            {/* --- NAV --- */}
            <nav className="sticky top-0 z-40 backdrop-blur bg-slate-900/95 border-b border-white/5">
                <div className="container mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
                    <div className="text-2xl font-black tracking-tighter text-white">
                        SD<span className="text-indigo-400"> EXTRACTOR</span>
                        <span className="block text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase -mt-1">by SD CodeHub</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-300">
                        <a href="#features" className="hover:text-indigo-400 transition">Features</a>
                        <a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a>
                        <a href="#install" className="hover:text-indigo-400 transition">How to Install</a>
                        <Link to="/user-login" className="hover:text-indigo-400 transition">Log In</Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition normal-case tracking-normal">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO --- */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/20 blur-[140px] rounded-full"></div>
                <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="container mx-auto px-6 lg:px-12 pt-20 pb-24 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 border border-white/10 text-[12px] font-bold uppercase tracking-widest text-indigo-200">
                        <FiMapPin /> Google Maps Lead Extractor
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
                        Pull Business Leads<br />from <span className="text-indigo-400">Google Maps</span> in One Click
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 mb-10 font-light max-w-2xl mx-auto">
                        Extract business names, phone numbers, websites and ratings into a clean
                        spreadsheet — fast, accurate, and right from your browser.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a href={DOWNLOAD_URL} download
                            className="inline-flex items-center px-9 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-900/50 hover:-translate-y-0.5">
                            <FiDownload className="mr-3 text-2xl" /> Download Extension
                        </a>
                        <Link to="/signup"
                            className="inline-flex items-center px-9 py-4 bg-white/10 border border-white/20 text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all">
                            <FiUserPlus className="mr-3 text-2xl" /> Create Account
                        </Link>
                    </div>
                    <p className="mt-5 text-[12px] uppercase tracking-[0.25em] text-slate-400 font-bold">
                        Free to download · Activate with your license key
                    </p>

                    {/* Product preview mock */}
                    <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden text-left">
                        <div className="px-5 py-3 bg-slate-900 flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">SD Extractor — Live Output</span>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            </div>
                        </div>
                        <table className="w-full text-left text-[13px] text-slate-700">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 font-black uppercase tracking-tighter text-[11px]">
                                    <th className="p-4">Business</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Website</th>
                                    <th className="p-4">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['SD CodeHub', '+91 99309 94315', 'sdcodehub.com', '4.9'],
                                    ['Elite Tech Solutions', '+91 70201 12345', 'elitetech.in', '4.6'],
                                    ['Global Exports Pvt Ltd', '+91 91580 99887', 'globalex.com', '4.4'],
                                ].map((r, i) => (
                                    <tr key={i} className="border-t border-slate-50">
                                        <td className="p-4 font-bold text-slate-900">{r[0]}</td>
                                        <td className="p-4 font-mono">{r[1]}</td>
                                        <td className="p-4 text-indigo-600">{r[2]}</td>
                                        <td className="p-4">⭐ {r[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- STATS BAR --- */}
            <section className="bg-slate-900 text-white border-t border-white/5">
                <div className="container mx-auto px-6 lg:px-12 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        ['1-Click', 'Extraction'],
                        ['CSV / Excel', 'Export'],
                        ['100% Local', 'Your data stays private'],
                        ['24/7', 'WhatsApp Support'],
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-2xl md:text-3xl font-black text-indigo-400">{s[0]}</div>
                            <div className="text-[12px] uppercase tracking-widest text-slate-400 font-bold mt-1">{s[1]}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FEATURES --- */}
            <section id="features" className="py-28 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need to find leads</h2>
                        <p className="text-lg text-slate-500 font-light">Built for sales teams, agencies, and growth hackers.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
                        {[
                            { icon: <FiZap />, title: 'High-Speed Scraping', desc: 'Pull hundreds of listings in minutes without browser lag.' },
                            { icon: <FiShield />, title: 'Privacy First', desc: 'Extraction runs locally — your search data never leaves your PC.' },
                            { icon: <FiDatabase />, title: 'Clean CSV Export', desc: 'One-click export to Excel/CSV, perfectly formatted for your CRM.' },
                            { icon: <FiMapPin />, title: 'Global Reach', desc: 'Works with every country and city listed on Google Maps.' },
                            { icon: <FiFileText />, title: 'Rich Fields', desc: 'Business name, address, phone, website and rating in every row.' },
                            { icon: <FiLock />, title: 'Licensed Access', desc: 'Secure license keys bound to your device keep your seat yours.' },
                        ].map((f, i) => (
                            <div key={i} className="group">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-light">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- INSTALL STEPS --- */}
            <section id="install" className="py-28 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">How to Install</h2>
                        <p className="text-lg text-slate-500 font-light">
                            Get set up in under 2 minutes. Just follow these steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6 mb-14">
                        {[
                            { step: '01', title: 'Download', desc: 'Click “Download Extension” to get the .zip file.' },
                            { step: '02', title: 'Extract', desc: 'Unzip the downloaded file into a folder on your PC.' },
                            { step: '03', title: 'Developer Mode', desc: 'Open chrome://extensions and turn on Developer Mode (top-right).' },
                            { step: '04', title: 'Load Unpacked', desc: 'Click “Load unpacked” and select the extracted folder.' },
                            { step: '05', title: 'Activate', desc: 'Open the extension, paste your license key, and start extracting.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                                <div className="text-sm font-black text-indigo-600 mb-3 tracking-[0.3em] font-mono">{item.step}</div>
                                <h3 className="text-lg font-bold mb-2 uppercase">{item.title}</h3>
                                <p className="text-slate-500 font-light text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-6 max-w-3xl mx-auto text-center mb-12">
                        <p className="text-amber-800 text-sm font-medium">
                            ⚠️ The extension is <strong>free to download</strong>, but it stays locked until your
                            license key is verified. Don’t have a key yet?{' '}
                            <Link to="/signup" className="font-black underline">Create an account &amp; request one</Link>.
                        </p>
                    </div>

                    <div className="text-center">
                        <a href={DOWNLOAD_URL} download
                            className="inline-flex items-center px-10 py-5 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all">
                            <FiDownload className="mr-3" /> Download Extension (.zip)
                        </a>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section id="pricing" className="py-28 bg-slate-900 text-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold tracking-tight mb-4">Simple, honest pricing</h2>
                        <p className="text-lg text-slate-400 font-light">Pick a plan, get verified, start extracting.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-slate-800/40 p-10 border border-slate-700 rounded-3xl">
                            <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-6 font-mono">Monthly</h3>
                            <div className="text-5xl font-bold mb-8 tracking-tighter">₹199 <span className="text-base font-normal text-slate-500">/ mo</span></div>
                            <ul className="space-y-4 mb-10 text-slate-300 font-light">
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-indigo-400" /> Unlimited lead extraction</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-indigo-400" /> CSV / Excel export</li>
                                <li className="flex items-center gap-3"><FiCheckCircle className="text-indigo-400" /> WhatsApp support</li>
                            </ul>
                            <Link to="/signup" className="block text-center py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition">Get Monthly</Link>
                        </div>

                        <div className="bg-indigo-600 p-10 rounded-3xl relative shadow-2xl shadow-indigo-900/40">
                            <span className="absolute -top-4 right-8 bg-white text-indigo-600 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-xl">Best Value</span>
                            <h3 className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-6 font-mono">Yearly</h3>
                            <div className="text-5xl font-bold mb-8 tracking-tighter">₹1,699 <span className="text-base font-normal text-indigo-200">/ yr</span></div>
                            <ul className="space-y-4 mb-10 text-white font-medium">
                                <li className="flex items-center gap-3"><FiCheckCircle /> Save ₹689 vs monthly</li>
                                <li className="flex items-center gap-3"><FiCheckCircle /> Priority activation</li>
                                <li className="flex items-center gap-3"><FiCheckCircle /> VIP WhatsApp support</li>
                            </ul>
                            <Link to="/signup" className="block text-center py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">Get Yearly</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SUPPORT / WHATSAPP --- */}
            <section id="contact" className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                        <div className="flex items-center gap-6">
                            <FaWhatsapp className="text-6xl shrink-0" />
                            <div>
                                <h2 className="text-3xl font-black mb-1">Need help? Talk to us</h2>
                                <p className="text-white/90 font-light">Have a query or want a license key? Contact or WhatsApp us at <strong>+91 99309 94315</strong>.</p>
                            </div>
                        </div>
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                            className="px-9 py-4 bg-white text-green-700 font-black rounded-2xl hover:scale-105 transition text-sm uppercase tracking-widest flex items-center gap-2 shrink-0">
                            <FaWhatsapp className="text-xl" /> Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="pt-20 pb-10 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <div className="text-2xl font-black tracking-tighter mb-5">
                                SD<span className="text-indigo-600"> EXTRACTOR</span>
                            </div>
                            <p className="text-slate-500 font-light leading-relaxed">
                                A product by <strong className="text-slate-700">SD CodeHub</strong>. Professional Google Maps
                                data extraction tools for sales teams worldwide.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-6">Product</h4>
                            <ul className="space-y-3 text-[15px] font-medium text-slate-500">
                                <li><a href="#features" className="hover:text-indigo-600 transition">Features</a></li>
                                <li><a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a></li>
                                <li><a href="#install" className="hover:text-indigo-600 transition">How to Install</a></li>
                                <li><a href={DOWNLOAD_URL} download className="hover:text-indigo-600 transition">Download</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-6">Account</h4>
                            <ul className="space-y-3 text-[15px] font-medium text-slate-500">
                                <li><Link to="/signup" className="hover:text-indigo-600 transition">Create Account</Link></li>
                                <li><Link to="/user-login" className="hover:text-indigo-600 transition">Log In</Link></li>
                                <li><Link to="/login" className="hover:text-indigo-600 transition">Admin Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-6">Contact</h4>
                            <ul className="space-y-3 text-[15px] font-medium text-slate-500">
                                <li><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 transition"><FaWhatsapp className="text-green-500" /> +91 99309 94315</a></li>
                                <li><a href={EMAIL_LINK} className="flex items-center gap-2 hover:text-indigo-600 transition"><FiMail className="text-indigo-500" /> codehubsd@gmail.com</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} SD CodeHub. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* --- FLOATING WHATSAPP BUTTON --- */}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 transition"
                title="Chat on WhatsApp">
                <FaWhatsapp className="text-white text-3xl" />
            </a>
        </div>
    );
};

export default Home;
