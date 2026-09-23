import React, { useState } from 'react';
import { X, Building2, Upload, Send, CheckCircle2, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';

interface CorporateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporateQuoteModal: React.FC<CorporateQuoteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitCorporateEnquiry } = useAdmin();
  const { showToast } = useShop();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState<number>(50);
  const [budget, setBudget] = useState('₹50,000 - ₹1,00,000');
  const [occasion, setOccasion] = useState('Festive & Diwali Gifting');
  const [requirements, setRequirements] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      showToast(`Attached reference file: ${file.name}`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !email || !phone) {
      showToast('Please fill out all required contact fields.', 'error');
      return;
    }

    submitCorporateEnquiry({
      companyName,
      contactPerson,
      email,
      phone,
      estimatedQuantity: Number(quantity),
      approximateBudget: budget,
      occasion,
      requirements: requirements || 'Custom company logo engraving with luxury magnetic packaging.',
      referenceFileUrl: fileName ? `https://storage.impressivegifts.in/corp/${fileName}` : undefined,
    });

    setIsSubmitted(true);
    showToast('Corporate quote enquiry received! Our B2B concierge will reach out within 2 hours.', 'success');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCompanyName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setRequirements('');
    setFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EAE4DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#882434] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Request Corporate Gifting Quote
              </h3>
              <p className="text-xs text-stone-500">
                Tiered bulk discounts • Custom logo branding • Premium box packaging
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  Enquiry Submitted Successfully!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Thank you, <strong>{contactPerson}</strong>! Our Corporate Gifting Account Manager for <strong>{companyName}</strong> has received your requirement.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200/80 text-xs text-stone-600 max-w-sm mx-auto space-y-1 text-left">
                <p><strong>Quantity:</strong> {quantity} Units</p>
                <p><strong>Budget Bracket:</strong> {budget}</p>
                <p><strong>Estimated Response:</strong> Within 2 Business Hours</p>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6E1B28] transition-colors cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Infosys, TCS, Razorpay"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Rohan Sharma (HR Lead)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 8986613412"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Estimated Quantity
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Approximate Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  >
                    <option value="Under ₹50,000">Under ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                    <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                    <option value="₹5,00,000+">₹5,00,000+</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Occasion / Event
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                  >
                    <option value="Festive & Diwali Gifting">Festive & Diwali Gifting</option>
                    <option value="Employee Welcome Kits">Employee Welcome Kits</option>
                    <option value="Annual Rewards & Recognition">Annual Rewards & Recognition</option>
                    <option value="Client Appreciation Hampers">Client Appreciation Hampers</option>
                    <option value="Conference & Event Merchandise">Conference & Event Merchandise</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Customization Requirements
                </label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Tell us about your product preferences, branding details (engraving, color scheme, ribbon printing), or target delivery date..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                />
              </div>

              {/* Upload Reference File */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Upload Logo or Employee Spreadsheet (Optional)</span>
                  {fileName && (
                    <span className="text-emerald-700 font-normal lowercase flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {fileName}
                    </span>
                  )}
                </label>

                <label className="border-2 border-dashed border-stone-300 hover:border-[#882434] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-stone-50 hover:bg-[#FAF8F5]">
                  <Upload className="w-6 h-6 text-stone-400 mb-1" />
                  <span className="text-xs font-semibold text-stone-700">
                    Click to attach file (.AI, .PDF, .PNG, .XLSX)
                  </span>
                  <span className="text-[10px] text-stone-400">Max size 25MB</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Corporate Quote</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
