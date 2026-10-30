export const BUSINESS_PHONE = "+91 97172 56514";
export const BUSINESS_PHONE_HREF = "tel:+919717256514";
export const BUSINESS_EMAIL = "paintersgurgaon@gmail.com";

// Display address shown on UI
export const DISPLAY_ADDRESS = "Gurgaon (Gurugram), Haryana, India";

// Schema / Registered address
export const BUSINESS_ADDRESS_DETAILS = {
  streetAddress: "H-16/137, Block H, Sangam Vihar",
  addressLocality: "New Delhi",
  addressRegion: "Delhi",
  postalCode: "110080",
  addressCountry: "IN",
};
export const BUSINESS_ADDRESS = `${BUSINESS_ADDRESS_DETAILS.streetAddress}, ${BUSINESS_ADDRESS_DETAILS.addressLocality}, ${BUSINESS_ADDRESS_DETAILS.addressRegion} - ${BUSINESS_ADDRESS_DETAILS.postalCode}`;
export const BUSINESS_ADDRESS_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(BUSINESS_ADDRESS);
export const BUSINESS_ADDRESS_EMBED_URL =
  `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS_ADDRESS)}&output=embed`;
