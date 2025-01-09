"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Item } from "@/data/data";
import { fuzzySearch } from "../../utils/fuzzySearch";
import FilterPanel from "./FilterPanel";
// import { ChevronDown, Filter, SortAsc } from 'lucide-react'

interface DataTableProps {
  initialItems: Item[];
}

function highlightText(text: string, highlight: string): JSX.Element {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(
    `(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-800 rounded px-1"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function DataTable({ initialItems }: DataTableProps) {
  const [items] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Item>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Item>>(
    new Set(Object.keys(initialItems[0]) as (keyof Item)[])
  );
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    ratingMin: 0,
    manufacturers: [] as string[],
    weightRange: [0, 10],
    releaseDate: "",
    stockMin: 0,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const newActiveFilters = [];
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000)
      newActiveFilters.push("Price");
    if (filters.ratingMin > 0) newActiveFilters.push("Rating");
    if (filters.manufacturers.length > 0) newActiveFilters.push("Manufacturer");
    if (filters.weightRange[0] > 0 || filters.weightRange[1] < 10)
      newActiveFilters.push("Weight");
    if (filters.releaseDate) newActiveFilters.push("Date");
    if (filters.stockMin > 0) newActiveFilters.push("Stock");
    setActiveFilters(newActiveFilters);
  }, [filters]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = items;

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    result = result.filter(
      (item) =>
        item.price >= filters.priceRange[0] &&
        item.price <= filters.priceRange[1] &&
        item.rating >= filters.ratingMin &&
        item.weight >= filters.weightRange[0] &&
        item.weight <= filters.weightRange[1] &&
        item.stock >= filters.stockMin &&
        (filters.manufacturers.length === 0 ||
          filters.manufacturers.includes(item.manufacturer)) &&
        (filters.releaseDate === "" ||
          new Date(item.releaseDate) >= new Date(filters.releaseDate))
    );

    if (searchTerm) {
      result = fuzzySearch(result, searchTerm, [
        "id",
        "name",
        "category",
        "price",
        "stock",
        "rating",
        "releaseDate",
        "manufacturer",
        "weight",
        "dimensions",
      ]);
    }

    result.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, searchTerm, sortColumn, sortDirection, categoryFilter, filters]);

  const pageCount = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categoryFilter, searchTerm]);

  const paginatedItems = useMemo(() => {
    return filteredAndSortedItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  const handleSort = useCallback(
    (column: keyof Item) => {
      if (column === sortColumn) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
      setShowSortOptions(false);
    },
    [sortColumn, sortDirection]
  );

  const toggleColumnVisibility = (column: keyof Item) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const exportToCSV = () => {
    const headers = Array.from(visibleColumns).join(",");
    const csvContent = [headers];

    filteredAndSortedItems.forEach((item) => {
      const row = Array.from(visibleColumns)
        .map((col) => item[col])
        .join(",");
      csvContent.push(row);
    });

    const csvString = csvContent.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "table-data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderPageNumbers = useCallback(() => {
    const pageNumbers = [];
    let ellipsisAdded = false;

    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 mx-1 rounded transition-colors duration-200 ${
              currentPage === i
                ? "bg-blue-500 text-white dark:bg-blue-700"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            }`}
          >
            {i}
          </button>
        );
        ellipsisAdded = false;
      } else if (!ellipsisAdded) {
        pageNumbers.push(
          <span key={`ellipsis-${i}`} className="px-2">
            ...
          </span>
        );
        ellipsisAdded = true;
      }
    }

    return pageNumbers;
  }, [currentPage, pageCount]);

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex gap-2 flex-wrap items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Food">Food</option>
              </select>
              <div className="relative">
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  {/* <Filter size={16} /> */}
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="bg-white text-blue-500 rounded-full px-2 py-1 text-xs font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
                {activeFilters.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700">
                    {activeFilters.map((filter) => (
                      <div
                        key={filter}
                        className="px-4 py-2 text-sm dark:text-white"
                      >
                        {filter}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600 flex items-center gap-2"
                >
                  {/* <SortAsc size={16} /> */}
                  Sort
                </button>
                {showSortOptions && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700">
                    {(Object.keys(items[0]) as Array<keyof Item>).map(
                      (column) => (
                        <button
                          key={column}
                          onClick={() => handleSort(column)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 dark:text-white dark:hover:bg-gray-700"
                        >
                          {column.charAt(0).toUpperCase() + column.slice(1)}
                          {sortColumn === column && (
                            <span className="ml-2">
                              {sortDirection === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600 flex items-center gap-2"
                >
                  Columns
                  {/* <ChevronDown size={16} /> */}
                </button>
                {showSortOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700">
                    {(Object.keys(items[0]) as Array<keyof Item>).map(
                      (column) => (
                        <label
                          key={column}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.has(column)}
                            onChange={() => toggleColumnVisibility(column)}
                            className="mr-2"
                          />
                          <span className="text-sm dark:text-white">
                            {column}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 border rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
              >
                Export CSV
              </button>
              <button
                onClick={toggleDarkMode}
                className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
          {showFilterPanel && (
            <FilterPanel
              filters={{
                ...filters,
                priceRange: filters.priceRange as [number, number],
                weightRange: filters.weightRange as [number, number],
              }}
              setFilters={
                setFilters as Dispatch<
                  SetStateAction<{
                    priceRange: [number, number];
                    ratingMin: number;
                    manufacturers: string[];
                    weightRange: [number, number];
                    releaseDate: string;
                    stockMin: number;
                  }>
                >
              }
              category={categoryFilter}
            />
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {Array.from(visibleColumns).map((column) => (
                    <th
                      key={column}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 dark:text-gray-400 dark:hover:bg-gray-600 ${
                        column === "price" ||
                        column === "stock" ||
                        column === "rating" ||
                        column === "weight"
                          ? "text-right"
                          : ""
                      }`}
                      onClick={() => handleSort(column)}
                    >
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                      {sortColumn === column && (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-200 dark:hover:bg-gray-700"
                  >
                    {Array.from(visibleColumns).map((column) => (
                      <td
                        key={column}
                        className={`px-6 py-4 whitespace-nowrap dark:text-gray-300 ${
                          column === "price" ||
                          column === "stock" ||
                          column === "rating" ||
                          column === "weight"
                            ? "text-right"
                            : ""
                        }`}
                      >
                        {column === "price"
                          ? highlightText(
                              `$${item[column].toFixed(2)}`,
                              searchTerm
                            )
                          : column === "rating" || column === "weight"
                          ? highlightText(item[column].toString(), searchTerm)
                          : highlightText(item[column].toString(), searchTerm)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedItems.length
              )}{" "}
              of {filteredAndSortedItems.length} items
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="itemsPerPage"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
                >
                  Previous
                </button>
                {renderPageNumbers()}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                  }
                  disabled={currentPage === pageCount}
                  className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <DataVisualization data={filteredAndSortedItems} /> */}
    </div>
  );
}
