export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  isExpressAvailable: boolean;
  standardDays: number;
  expressDays: number;
  codAvailable: boolean;
}

export const PINCODE_DATABASE: { [key: string]: PincodeInfo } = {
  // Metro hubs
  '400001': { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '400050': { pincode: '400050', city: 'Mumbai (Bandra)', state: 'Maharashtra', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '110001': { pincode: '110001', city: 'New Delhi', state: 'Delhi', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '110020': { pincode: '110020', city: 'South Delhi', state: 'Delhi', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '560001': { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '560100': { pincode: '560100', city: 'Bengaluru (Electronic City)', state: 'Karnataka', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '500001': { pincode: '500001', city: 'Hyderabad', state: 'Telangana', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '600001': { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', isExpressAvailable: true, standardDays: 3, expressDays: 1, codAvailable: true },
  '700001': { pincode: '700001', city: 'Kolkata', state: 'West Bengal', isExpressAvailable: true, standardDays: 3, expressDays: 1, codAvailable: true },
  '411001': { pincode: '411001', city: 'Pune', state: 'Maharashtra', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '380001': { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '302001': { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '201301': { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '122001': { pincode: '122001', city: 'Gurugram', state: 'Haryana', isExpressAvailable: true, standardDays: 2, expressDays: 1, codAvailable: true },
  '682001': { pincode: '682001', city: 'Kochi', state: 'Kerala', isExpressAvailable: true, standardDays: 3, expressDays: 2, codAvailable: true },
  '226001': { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', isExpressAvailable: true, standardDays: 3, expressDays: 2, codAvailable: true },
  '452001': { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh', isExpressAvailable: true, standardDays: 3, expressDays: 2, codAvailable: true },
  '141001': { pincode: '141001', city: 'Ludhiana', state: 'Punjab', isExpressAvailable: true, standardDays: 3, expressDays: 2, codAvailable: true },
  '834003': { pincode: '834003', city: 'Ranchi (Birsa Chowk)', state: 'Jharkhand', isExpressAvailable: true, standardDays: 1, expressDays: 1, codAvailable: true },
};

export const checkPincodeDelivery = (pincode: string): PincodeInfo => {
  const cleanPin = pincode.trim();
  if (PINCODE_DATABASE[cleanPin]) {
    return PINCODE_DATABASE[cleanPin];
  }
  // Fallback for valid 6 digit pincodes
  if (/^\d{6}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      city: 'Your City',
      state: 'India',
      isExpressAvailable: false,
      standardDays: 4,
      expressDays: 2,
      codAvailable: true,
    };
  }
  throw new Error('Please enter a valid 6-digit Indian PIN code.');
};
