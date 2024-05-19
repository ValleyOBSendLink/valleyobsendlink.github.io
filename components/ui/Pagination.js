"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage = 1,
  totalEntries = 0,
  perPage = 50,
}) {
  let totalPages = Math.ceil(totalEntries / perPage) || 1;

  let currentSearchParam = useSearchParams();
  let searchParam = new URLSearchParams(currentSearchParam.toString());
  searchParam.delete("page");

  let search = searchParam.toString() ? `&${searchParam.toString()}` : "";

  return (
    <nav aria-label="navigation" className="mt-5">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage == 1 ? "disabled" : ""}`}>
          <Link
            className="page-link"
            href={currentPage == 1 ? "#" : `?page=${currentPage - 1}${search}`}
          >
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </Link>
        </li>

        <li
          className={`page-item ${currentPage == totalPages ? "disabled" : ""}`}
        >
          <Link
            className="page-link"
            href={
              currentPage == totalPages
                ? "#"
                : `?page=${Number(currentPage) + 1}`
            }
          >
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
