import React from "react";
import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const CamelCase = capitalizeFirstLetter(path);

  return (
    <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex justify-between items-center py-2">
        {/* <!-- Breadcrumb --> */}
        <ol className="ms-3 flex items-center whitespace-nowrap">
          <li className="flex items-center text-sm text-gray-800 dark:text-gold">
            Home
            {path.length > 0 && (
              <svg
                className="flex-shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-gold"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </li>
          <li
            className="text-sm font-semibold text-gray-800 truncate dark:text-gold"
            aria-current="page"
          >
            {CamelCase}
          </li>
        </ol>
        {/* <!-- End Breadcrumb --> */}

        {/* <!-- Sidebar --> */}
        <button
          type="button"
          className="py-2 px-3 flex justify-center items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-gray-600 dark:border-gold dark:text-gold dark:hover:text-neutral-200"
          data-hs-overlay="#application-sidebar"
          aria-controls="application-sidebar"
          aria-label="Sidebar"
        >
          <svg
            className="flex-shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
          </svg>
          <span className="sr-only">Sidebar</span>
        </button>
        {/* <!-- End Sidebar --> */}
      </div>
    </div>
  );
};

export default Breadcrumb;
