const PRIMARY_WHATSAPP = "919800049797";

export const BUSINESS_CONTACT = {
  phoneDisplay: "+91 98000 49797",
  phoneHref: "tel:+919800049797",
  alternatePhoneDisplay: "08913 571346",
  alternatePhoneHref: "tel:+918913571346",
  email: "info@yojosolutions.com",
  emailHref: "mailto:info@yojosolutions.com",
  address:
    "P.No. 664, MIG Midilapuri, VUDA Colony, PM Palem, Madhurawada, Visakhapatnam 530048, India",
} as const;

export function whatsappHref(message = "Hello Yojo Solutions, I would like to know more.") {
  return `https://wa.me/${PRIMARY_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
