import React from 'react';
import {
    FiDownload, FiMail, FiMessageCircle, FiCheckCircle,
    FiShield, FiZap, FiDatabase, FiSearch, FiMapPin,
    FiFileText, FiBarChart2, FiLock, FiGlobe, FiExternalLink
} from 'react-icons/fi';

const Home = () => {
    const whatsappLink = "https://wa.me/919834972896?text=Hi%20I%20want%20to%20purchase%20Data%20Extractor%20subscription";
    const emailLink = "mailto:kalkidigitals@gmail.com";

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-50">

            {/* --- HEADER --- */}
            <nav className="py-5 border-b border-slate-50 bg-gray-100">
                <div className="container mx-auto px-12 flex justify-between items-center">
                    <div className="text-2xl font-black tracking-tighter text-slate-900">
                        DATA<span className="text-indigo-600"> EXTRACTOR</span>
                    </div>
                    <div className="hidden md:flex gap-10 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        <a href="#features" className="hover:text-indigo-600 transition">Features</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
                        <a href="#download" className="hover:text-indigo-600 transition text-indigo-600">Download</a>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-20 pb-28">
                <div className="container mx-auto px-12">
                    <div className="max-w-4xl">
                        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8">
                            Reliable Lead Extraction <br />
                            for <span className="text-indigo-600">Growth Teams.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-light max-w-2xl">
                            The professional choice for Google Maps scraping. Extract validated business data, phones, and emails with one click.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-10 py-5 bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-xl hover:-translate-y-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="mr-3 w-6 h-6" alt="WhatsApp" /> Request License Key              </a>
                            <a href="#download"
                                className="inline-flex items-center justify-center px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 text-lg font-bold rounded-xl hover:border-slate-900 transition-all">
                                <FiDownload className="mr-3 text-2xl" /> Download Tool
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DATA PREVIEW SECTION --- */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="container mx-auto px-12">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="lg:w-1/3">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900">High-Fidelity Extraction</h2>
                            <p className="text-lg text-slate-500 mb-8 leading-relaxed font-light">
                                Our engine bypasses common limitations to pull complete business profiles directly into your spreadsheet.
                            </p>
                            <div className="space-y-4">
                                {["Name & Category", "Verified Email", "Direct Phone", "Official Website", "Social Profiles"].map((item) => (
                                    <div key={item} className="flex items-center gap-3 text-lg font-medium text-slate-700">
                                        <FiCheckCircle className="text-indigo-500 text-xl" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-2/3 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Real-time Output Preview</span>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[14px] border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-tighter">
                                            <th className="p-5">Business Name</th>
                                            <th className="p-5">Email Address</th>
                                            <th className="p-5">Phone Number</th>
                                            <th className="p-5">Website</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-600">
                                        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                            <td className="p-5 font-bold text-slate-900 underline decoration-indigo-200 underline-offset-4">Kalki Digitals</td>
                                            <td className="p-5 italic text-indigo-600">contact@kalki.com</td>
                                            <td className="p-5 font-mono">+91 98349 72896</td>
                                            <td className="p-5 text-slate-400">kalkidigitals.com</td>
                                        </tr>
                                        <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                            <td className="p-5 font-bold text-slate-900 underline decoration-indigo-200 underline-offset-4">Elite Tech Sol.</td>
                                            <td className="p-5 italic text-indigo-600">hr@elitetech.in</td>
                                            <td className="p-5 font-mono">+91 70201 12345</td>
                                            <td className="p-5 text-slate-400">elitetech.in</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition">
                                            <td className="p-5 font-bold text-slate-900 underline decoration-indigo-200 underline-offset-4">Global Exports</td>
                                            <td className="p-5 italic text-indigo-600">info@globalex.com</td>
                                            <td className="p-5 font-mono">+91 91580 99887</td>
                                            <td className="p-5 text-slate-400">globalex.com</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-32 bg-white">
                <div className="container mx-auto px-12">
                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            { icon: <FiZap />, title: "High-Speed Scraping", desc: "Optimized for volume. Pull hundreds of listings in minutes without browser lag." },
                            { icon: <FiShield />, title: "Privacy First", desc: "Local extraction ensures your search data never leaves your computer." },
                            { icon: <FiDatabase />, title: "Clean Data Export", desc: "One-click export to Excel/CSV with perfect formatting for your CRM." },
                            { icon: <FiMapPin />, title: "Global Reach", desc: "Supports every country and city listed on Google Maps worldwide." },
                            { icon: <FiFileText />, title: "Social Scraper", desc: "Automatically finds LinkedIn, FB, and Instagram links from websites." },
                            { icon: <FiLock />, title: "Anti-Ban Tech", desc: "Smart-mimic technology keeps your IP safe from bot detection." },
                        ].map((feat, i) => (
                            <div key={i} className="group">
                                <div className="text-indigo-600 text-4xl mb-8 group-hover:scale-110 transition-transform duration-300">{feat.icon}</div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feat.title}</h3>
                                <p className="text-lg text-slate-500 leading-relaxed font-light">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section id="pricing" className="py-32 bg-slate-900 text-white border-y border-slate-800">
                <div className="container mx-auto px-12">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="bg-slate-800/40 p-12 border border-slate-700 rounded-3xl">
                            <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-6 font-mono">License: Monthly</h3>
                            <div className="text-6xl font-bold mb-10 italic tracking-tighter">₹499 <span className="text-lg font-normal text-slate-600">/ mo</span></div>
                            <ul className="space-y-5 mb-12 text-lg text-slate-400 font-light">
                                <li className="flex items-center gap-4"><FiCheckCircle className="text-indigo-500" /> Unlimited Lead Extraction</li>
                                <li className="flex items-center gap-4"><FiCheckCircle className="text-indigo-500" /> Instant Activation Key</li>
                                <li className="flex items-center gap-4"><FiCheckCircle className="text-indigo-500" /> WhatsApp Support</li>
                            </ul>
                            <a href={whatsappLink} className="block text-center py-5 bg-white text-slate-900 text-lg font-bold rounded-xl hover:bg-slate-200 transition">Get Monthly Key</a>
                        </div>

                        <div className="bg-indigo-600 p-12 rounded-3xl relative shadow-2xl shadow-indigo-500/20">
                            <span className="absolute -top-4 right-10 bg-white text-indigo-600 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-xl">Most Popular</span>
                            <h3 className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em] mb-6 font-mono">License: Annual</h3>
                            <div className="text-6xl font-bold mb-10 italic tracking-tighter">₹3,999 <span className="text-lg font-normal text-indigo-200">/ yr</span></div>
                            <ul className="space-y-5 mb-12 text-lg text-white font-medium">
                                <li className="flex items-center gap-4"><FiCheckCircle /> 2 Months Free Access</li>
                                <li className="flex items-center gap-4"><FiCheckCircle /> Priority Server Access</li>
                                <li className="flex items-center gap-4"><FiCheckCircle /> VIP Support Channel</li>
                            </ul>
                            <a href={whatsappLink} className="block text-center py-5 bg-slate-900 text-white text-lg font-bold rounded-xl hover:bg-slate-800 transition shadow-xl">Activate Annual License</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DOWNLOAD & STEPS --- */}
            <section id="download" className="py-32 bg-white">
                <div className="container mx-auto px-12">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-20 text-slate-900 tracking-tight">Simple Installation</h2>
                        <div className="grid md:grid-cols-3 gap-16 mb-24">
                            {[
                                { step: "01", title: "Download", desc: "Get the extension .zip source file." },
                                { step: "02", title: "Load", desc: "Enable Developer Mode in Chrome Extensions." },
                                { step: "03", title: "Activate", desc: "Paste your license key to unlock Pro." },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="text-sm font-black text-indigo-600 mb-4 tracking-[0.3em] font-mono">{item.step}</div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900 uppercase">{item.title}</h3>
                                    <p className="text-slate-500 font-light text-lg leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <a href="/kalkidataextractor.zip" download className="inline-flex items-center px-12 py-6 bg-indigo-600 text-white text-xl font-bold rounded-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all">
                            <FiDownload className="mr-3" /> Download Extension (.zip)
                        </a>
                        <div className="mt-8 text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">Build 2.4.0 — Verified Stable</div>
                    </div>
                </div>
            </section>

            {/* --- ELITE FOOTER --- */}
            <footer className="pt-24 pb-12 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        {/* Column 1: Brand */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="text-2xl font-black text-slate-900 tracking-tighter mb-6">
                                DATA<span className="text-indigo-600">EXTRACTOR</span>
                            </div>
                            <p className="text-slate-500 font-light leading-relaxed mb-6">
                                Built by Kalki Digitals. We provide enterprise-level scraping tools for sales professionals worldwide.
                            </p>
                           
                        </div>

                        {/* Column 2: Product */}
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Platform</h4>
                            <ul className="space-y-4 text-[15px] font-medium text-slate-500">
                                <li><a href="#features" className="hover:text-indigo-600 transition">Core Features</a></li>
                                <li><a href="#pricing" className="hover:text-indigo-600 transition">License Pricing</a></li>
                                <li><a href="#download" className="hover:text-indigo-600 transition">Download Build</a></li>
                                <li className="flex items-center gap-2">Changelog <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-black">v2.4</span></li>
                            </ul>
                        </div>

                        {/* Column 3: Contact */}
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Direct Contact</h4>
                            <ul className="space-y-4 text-[15px] font-medium text-slate-500">
                                <li><a href={whatsappLink} className="flex items-center gap-2 hover:text-indigo-600 transition"><FiMessageCircle className="text-indigo-500" /> WhatsApp Support</a></li>
                                <li><a href={emailLink} className="flex items-center gap-2 hover:text-indigo-600 transition tracking-tight"><FiMail className="text-indigo-500" /> kalkidigitals@gmail.com</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Trust */}
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Security</h4>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm mb-2">
                                    <FiShield /> Verified Tool
                                </div>
                                <p className="text-xs text-slate-400 font-light leading-relaxed">
                                    Our software is locally executed and never transmits your scraped data to external servers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} KALKI DIGITALS. ALL RIGHTS RESERVED.
                        </div>
                        <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <a href="#" className="hover:text-slate-900 transition">Terms</a>
                            <a href="#" className="hover:text-slate-900 transition">Privacy</a>
                            <a href="#" className="hover:text-slate-900 transition underline underline-offset-4 decoration-indigo-200">Legal Notice</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;