import { enquiries } from '../constants/enquiry.js';

/**
 * @param {string} text
 * @returns {string}
 */
const parseEnquiry = (text) => {
  const command = Object.keys(enquiries).find((key) => text.toLowerCase().includes(key.toLowerCase()));
  return enquiries[command];
};

export default parseEnquiry;
