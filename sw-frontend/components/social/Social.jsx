import Link from "next/link";

const Social = ({ items = [] }) => {
  return (
    <>
      {items?.map(([Item, url], i) => (
        <li key={i}>
          <Link href={url}>
            <Item />
          </Link>
        </li>
      ))}
    </>
  );
};

export default Social;
