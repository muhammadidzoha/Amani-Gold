import React from "react";
import { Home, CreditCard, UserRoundCog } from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  {
    id: 1,
    name: "Dashboard",
    icon: <Home size="18px" />,
    target: "/",
  },
  { id: 2, name: "Users", icon: <UserRoundCog size="18px" />, target: "/user" },
  { id: 3, name: "Cards", icon: <CreditCard size="18px" />, target: "/card" },
];

const Sidebar = () => {
  return (
    <div
      id="application-sidebar"
      className="hs-overlay [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px]
  hidden
  fixed inset-y-0 start-0 z-[60]
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700
 "
    >
      <div className="px-8 pt-2.5">
        {/* <!-- Logo --> */}
        <a
          className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
          href="/"
          aria-label="Logo"
        >
          <img src="/logo.png" alt="" width="200px" />
        </a>
        {/* <!-- End Logo --> */}
      </div>

      <nav
        className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
        data-hs-accordion-always-open
      >
        <ul className="space-y-1.5">
          {menus.map((menu) => (
            <li key={menu.id}>
              <NavLink
                to={menu.target}
                className={({ isActive }) =>
                  `flex items-center gap-x-3.5 py-2 text-neutral-700 dark:text-gold px-2.5 text-sm rounded-lg ${
                    isActive ? "dark:bg-neutral-700 hover:bg-neutral-900 " : ""
                  }`
                }
              >
                {menu.icon}
                {menu.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
