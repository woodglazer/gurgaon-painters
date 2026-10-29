export const BUSINESS_PHONE = "+91 97172 56514";
export const BUSINESS_PHONE_HREF = "tel:+919717256514";
export const BUSINESS_EMAIL = "paintersgurgaon@gmail.com";
export const BUSINESS_ADDRESS_DETAILS = {
  streetAddress: "B-474, Basement, Greenfield Colony",
  addressLocality: "Faridabad",
  addressRegion: "Haryana",
  postalCode: "121010",
  addressCountry: "IN",
};
export const BUSINESS_ADDRESS = `${BUSINESS_ADDRESS_DETAILS.streetAddress}, ${BUSINESS_ADDRESS_DETAILS.addressLocality}, ${BUSINESS_ADDRESS_DETAILS.addressRegion} - ${BUSINESS_ADDRESS_DETAILS.postalCode}`;
export const BUSINESS_ADDRESS_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(BUSINESS_ADDRESS);
export const BUSINESS_ADDRESS_EMBED_URL =
  `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS_ADDRESS)}&output=embed`;
