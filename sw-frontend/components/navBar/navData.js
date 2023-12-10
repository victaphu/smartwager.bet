export const navData = [
  {
    id: "au@81",
    itm: "Home",
    url: "/",
    dropdown: false,
  },
  {
    id: "au@201",
    itm: "Dashboard",
    url: "#",
    dropdown: true,
    dropdown_itms: [
      {
        id: "du@02",
        dp_itm: "Dashboard",
        url: "/dashboard",
      }
    ],
  }
];

export default navData;
