// Static content for the "Our Clients" logo slider on the About page.
// Logo files live in /public/assets/images/about-us/clients/ - add, remove or reorder entries here.

export type ClientLogo = {
  name: string;
  logo: string;
};

export const ourClients = {
  title: "Our Clients",
  title_ar: "عملاؤنا",
  logos: [
    { name: "Majid Al Futtaim", logo: "/assets/images/about-us/clients/1.svg" },
    { name: "SABIC", logo: "/assets/images/about-us/clients/2.svg" },
    { name: "Saudi Electricity Company", logo: "/assets/images/about-us/clients/3.svg" },
    { name: "Emaar", logo: "/assets/images/about-us/clients/4.svg" },
    { name: "DAMAC", logo: "/assets/images/about-us/clients/5.svg" },
    { name: "ROSHN", logo: "/assets/images/about-us/clients/6.svg" },
    { name: "Seven", logo: "/assets/images/about-us/clients/7.svg" },
  ] as ClientLogo[],
};
