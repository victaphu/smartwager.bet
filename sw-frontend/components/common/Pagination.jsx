import Image from "next/image";
import Link from "next/link";
import arrow_left from "/public/images/icon/arrow-left.png";
import arrow_right from "/public/images/icon/arrow-right.png";

const Pagination = () => {
  return (
    <nav
      aria-label="Page navigation"
      className="d-flex justify-content-center mt-60"
    >
      <ul className="pagination justify-content-center align-items-center">
        <li className="page-item">
          <Link className="page-btn previous" href="{id}" aria-label="Previous">
            <Image src={arrow_left} alt="icon" />
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link xlr" href="{id}">
            1
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link xlr active" href="{id}">
            2
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link xlr" href="{id}">
            3
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-link xlr" href="{id}">
            4
          </Link>
        </li>
        <li className="page-item">
          <Link className="page-btn next" href="{id}" aria-label="Next">
            <Image src={arrow_right} alt="icon" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
