import React, { useState, useEffect } from "react";
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { academyContact, coursesData } from "../data";
import logoImg from "../assets/images/truth_quran_new_logo_1784203145448.jpg";
import { getCMSData } from "../cmsStore";

interface FooterProps {
  setView: (view: string) => void;
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ setView, onNavigate }: FooterProps) {
  const [cms, setCms] = useState(getCMSData());

  useEffect(() => {
    const handleSync = () => setCms(getCMSData());
    window.addEventListener("cms_data_updated", handleSync);
    return () => window.removeEventListener("cms_data_updated", handleSync);
  }, []);

  const handleLinkClick = (id: string) => {
    setView(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <footer className="bg-[#07080b] border-t border-[#d9b45c]/18 pt-16 pb-8 text-left relative z-10" id="academy-footer">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Column 1: Brand Blurb (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5" id="footer-col-1">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => handleLinkClick("home")}>
              <div className="w-12 h-12 rounded-xl border border-[#d9b45c]/40 flex items-center justify-center overflow-hidden bg-[#0e1015] flex-shrink-0">
                <img 
                  src={cms.customImages?.siteLogo?.url || logoImg} 
                  alt={cms.customImages?.siteLogo?.alt || "Truth Quran Logo"} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-xs tracking-wider text-[#f3ecd8] uppercase">
                  {cms.siteLogoText} <span className="text-[#d9b45c]">{cms.siteLogoSubText}</span>
                </span>
                <span className="font-serif italic text-[10px] text-[#d9b45c] leading-none">
                  Academy
                </span>
              </div>
            </div>
            <p className="text-xs text-[#c9c2ab] leading-relaxed max-w-sm">
              Truth Quran Academy is a premium global platform providing highly specialized, personalized 1-on-1 Quran, Tajweed, and Arabic language classes for children, sisters, and adults of all ages, taught by certified scholars.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={academyContact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#d9b45c]/15 bg-[#0e1015] flex items-center justify-center text-[#c9c2ab] hover:text-[#f2d98a] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c]/50 transition-all duration-300"
                aria-label="Facebook Profile"
              >
                <Facebook size={16} />
              </a>
              <a
                href={academyContact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#d9b45c]/15 bg-[#0e1015] flex items-center justify-center text-[#c9c2ab] hover:text-[#f2d98a] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c]/50 transition-all duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram size={16} />
              </a>
              <a
                href={`${academyContact.whatsapp}?text=Salam%20Truth%20Quran%20Academy.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#d9b45c]/15 bg-[#0e1015] flex items-center justify-center text-[#c9c2ab] hover:text-[#5fe396] hover:bg-[#1fae5b]/10 hover:border-[#1fae5b]/40 transition-all duration-300"
                aria-label="WhatsApp Support"
              >
                <MessageCircle size={16} className="fill-current/10" />
              </a>
            </div>
          </div>

          {/* Column 2: Program Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4" id="footer-col-2">
            <h4 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} className="text-[#d9b45c]" />
              <span>Syllabus Pages</span>
            </h4>
            <ul className="space-y-2.5 text-left">
              <li>
                <button
                  onClick={() => handleLinkClick("courses")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer block"
                >
                  All Quran Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("noorani-qaida")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer block"
                >
                  Noorani Qaida foundation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("kids-classes")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer block"
                >
                  Classes for Kids
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy Navigation (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4" id="footer-col-3">
            <h4 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} className="text-[#d9b45c]" />
              <span>Academy</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleLinkClick("home")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  Home Academy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("about")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("videos")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  Video Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("fees")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("download")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  Download Quran
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("blog")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  Academy Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("contact")}
                  className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors cursor-pointer"
                >
                  Contact Admissions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Location Contact Info (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4" id="footer-col-4">
            <h4 className="font-sans font-bold text-xs text-[#f3ecd8] uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} className="text-[#d9b45c]" />
              <span>Contact Us</span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={14} className="text-[#d9b45c] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-[#c9c2ab] leading-relaxed">
                  {cms.contactAddress}
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={14} className="text-[#d9b45c] flex-shrink-0" />
                <span className="text-xs text-[#c9c2ab]">{cms.contactPhone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={14} className="text-[#d9b45c] flex-shrink-0" />
                <a href={`mailto:${cms.contactEmail}`} className="text-xs text-[#c9c2ab] hover:text-[#f2d98a] transition-colors">
                  {cms.contactEmail}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar separated by gold hairline */}
        <div className="border-t border-[#d9b45c]/18 pt-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4" id="footer-bottom-bar">
          <p className="text-[10px] text-[#c9c2ab] uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Truth Quran Academy. All Rights Reserved.
          </p>
          <p className="text-[10px] text-[#c9c2ab] uppercase tracking-wider">
            Developed by{" "}
            <span className="text-[#d9b45c] font-bold group-hover:text-[#f2d98a] transition-colors">
              {cms.developerName}
            </span>{" "}
            | Truth Quran Academy
          </p>
        </div>

      </div>
    </footer>
  );
}
