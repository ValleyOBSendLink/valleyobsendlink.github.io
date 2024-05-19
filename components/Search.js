"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search({ isDisabled = false, children }) {
  const path = usePathname();
  const search = useSearchParams();
  const navigate = useRouter();

  let uid = search.get("uid") || "";

  let sort = search.get("sort") || "";
  let reverseSort = "";
  if (sort === "asc") {
    reverseSort = "desc";
  }

  if (sort === "desc") {
    reverseSort = "";
  }

  if (sort === "") {
    reverseSort = "asc";
  }

  let searchParam = new URLSearchParams(search.toString());
  searchParam.delete("sort");

  let searchFull = searchParam.toString() ? `&${searchParam.toString()}` : "";

  const [searchValue, setSearchValue] = useState(search.get("q") || "");

  function handleSearch(e) {
    e.preventDefault();
    navigate.push(`${path}?q=${searchValue}${uid ? `&uid=${uid}` : ""}`);
  }

  return (
    <div
      className="search-dv"
      style={{
        maxWidth: children ? "850px" : undefined,
      }}
    >
      <form onSubmit={handleSearch} id="search_form">
        <button type="submit">
          <img src="/asset/img/search-icon.png" alt="Search" />
        </button>
        <input
          type="text"
          name="search"
          id="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
        />
      </form>
      <span className="ic-dv arrow-ic">
        {isDisabled ? (
          <img src="/asset/img/up-dwn-arr.png" alt="Icon" />
        ) : (
          <Link
            href={
              searchFull
                ? `${path}?sort=${reverseSort}${searchFull}`
                : `${path}?sort=${reverseSort}`
            }
          >
            <img src="/asset/img/up-dwn-arr.png" alt="Icon" />
          </Link>
        )}
      </span>
      {children}
    </div>
  );
}
