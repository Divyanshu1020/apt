import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
    return (
      <footer className="bg-gray-800 text-gray-300">
        <div className="w-full md:max-w-screen-lg lg:max-w-screen-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                  <p>
                    123 Business Avenue<br />
                    Suite 100<br />
                    San Francisco, CA 94107
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href="tel:+1-555-123-4567" className="hover:text-white">+1 (555) 123-4567</a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href="mailto:contact@company.com" className="hover:text-white">contact@company.com</a>
                </div>
              </div>
            </div>
  
            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">About Us</a>
                </li>
                <li>
                  <a href="/services" className="hover:text-white transition-colors">Services</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                </li>
              </ul>
            </div>
  
            {/* Legal */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/refund" className="hover:text-white transition-colors">Refund Policy</a>
                </li>
              </ul>
            </div>
          </div>
  
          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-sm">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;