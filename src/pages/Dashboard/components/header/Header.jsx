import React from "react";
import { LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/ui/Breadcrumb";
import axios from "axios";
import { BASE_URL, USERS } from "../../../../config";
import useSWR from "swr";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("auth");
    navigate("/auth/login");
  };

  const fetcher = async () => {
    const auth = JSON.parse(sessionStorage.getItem("auth"));
    if (!auth) {
      navigate("/auth/login");
      return;
    }

    const response = await axios.get(`${BASE_URL}/${USERS}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      withCredentials: true,
    });
    return response.data;
  };

  const { data } = useSWR("user", fetcher);

  return (
    <>
      <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-700">
        <nav
          className="flex basis-full items-center w-full mx-auto px-4 sm:px-6"
          aria-label="Global"
        >
          <div className="me-5 mt-[5px] lg:me-0 lg:hidden">
            {/* <!-- Logo --> */}
            <a
              className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
              href="/"
              aria-label="Logo"
            >
              <img src="/logo.png" alt="" width="250px" />
            </a>
            {/* <!-- End Logo --> */}
          </div>

          <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
            <div className="sm:hidden">
              <button
                type="button"
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
              >
                <Search color="#FFD874" size="18px" />
              </button>
            </div>

            <div className="hidden sm:block">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <div className="relative min-w-72 md:min-w-80">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                  <Search color="#FFD874" size="18px" />
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="py-2 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-gold focus:ring-gold disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-gold dark:text-gold dark:placeholder-gold dark:focus:ring-neutral-600"
                  placeholder="Search"
                />
              </div>
            </div>

            <div className="flex flex-row items-center justify-end gap-2">
              <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                <button
                  id="hs-dropdown-with-header"
                  type="button"
                  className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                >
                  <img
                    className="inline-block size-[32px] rounded-full ring-2 ring-white dark:ring-gold"
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                    alt="Description"
                  />
                </button>

                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-900 dark:border dark:border-neutral-700"
                  aria-labelledby="hs-dropdown-with-header"
                >
                  <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-800">
                    <p className="text-sm text-gray-500 dark:text-gold">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gold">
                      {data?.Email_UA}
                    </p>
                  </div>
                  <div className="mt-2 py-2 first:pt-0 last:pb-0">
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gold dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                    >
                      <LogOut />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Breadcrumb />
    </>
  );
};

export default Header;
