import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BusinessIcon from "@mui/icons-material/Business";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/img/logo.png";
import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 xl:hidden xl:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex xl:flex! flex-col absolute z-40 left-0 top-0 xl:static xl:left-auto xl:top-auto xl:translate-x-0 h-[100dvh] 
          overflow-y-scroll xl:overflow-y-auto no-scrollbar w-72 xl:w-21 
          xl:sidebar-expanded:!w-72 2xl:w-72! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-72"
          } ${variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : "shadow-xs border-r border-gray-200 border-dashed"
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="xl:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <img src={logo} alt="Logo" className="w-auto max-w-full" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span
                className="hidden xl:block xl:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                general
              </span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup
                activecondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname === "/" || pathname.includes("dashboard")
                            ? ""
                            : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <GridViewRoundedIcon
                              className={`shrink-0 fill-current ${pathname === "/" ||
                                  pathname.includes("dashboard")
                                  ? "text-violet-500"
                                  : "text-gray-400 dark:text-gray-500"
                                }`}
                            />

                            <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Dashboard
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Main
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("user") &&
                  "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  }`}
              >
                <NavLink
                  end
                  to="/user"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("user")
                      ? ""
                      : "hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center">
                    <PersonIcon
                      className={`shrink-0 fill-current ${pathname.includes("user")
                          ? "text-violet-500"
                          : "text-gray-400 dark:text-gray-500"
                        }`}
                    />
                    <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Staff Management
                    </span>
                  </div>
                </NavLink>
              </li>
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("company") &&
                  "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  }`}
              >
                <NavLink
                  end
                  to="/company"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("company")
                      ? ""
                      : "hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center">
                    <BusinessIcon
                      className={`shrink-0 fill-current ${pathname.includes("company")
                          ? "text-violet-500"
                          : "text-gray-400 dark:text-gray-500"
                        }`}
                    />
                    <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Company & Site Mgt
                    </span>
                  </div>
                </NavLink>
              </li>
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("contact-inquiry") &&
                  "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  }`}
              >
                <NavLink
                  end
                  to="/contact-inquiry"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("contact-inquiry")
                      ? ""
                      : "hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center">
                    <LeaderboardIcon
                      className={`shrink-0 fill-current ${pathname.includes("contact-inquiry")
                          ? "text-violet-500"
                          : "text-gray-400 dark:text-gray-500"
                        }`}
                    />
                    <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Leads
                    </span>
                  </div>
                </NavLink>
              </li>
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${pathname.includes("salesOrder") &&
                  "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  }`}
              >
                <NavLink
                  end
                  to="/salesOrder"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("salesOrder")
                      ? ""
                      : "hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center">
                    <RealEstateAgentIcon
                      className={`shrink-0 fill-current ${pathname.includes("salesOrder")
                          ? "text-violet-500"
                          : "text-gray-400 dark:text-gray-500"
                        }`}
                    />

                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Sales Order Management
                    </span>
                  </div>
                </NavLink>
              </li>

              <SidebarLinkGroup
                activecondition={/^\/(inventory|inward-outward-request|categories)(\/|$)/.test(
                  pathname
                )}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        // className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                        //   pathname.includes("inventory")
                        //     ? ""
                        //     : "hover:text-gray-900 dark:hover:text-white"
                        // }`}
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${/^\/(inventory|inward-outward-request|categories)(\/|$)/.test(
                          pathname
                        )
                            ? ""
                            : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Inventory2RoundedIcon
                              className={`shrink-0 fill-current ${/^\/(inventory|inward-outward-request|categories)(\/|$)/.test(
                                pathname
                              )
                                  ? "text-violet-500"
                                  : "text-gray-400 dark:text-gray-500"
                                }`}
                            />

                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Inventory Management
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/inventory"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Inventory
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/inward-outward-request"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Inward/Outward Request
                              </span>
                            </NavLink>
                          </li>
                          {/* <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/categories"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Category Management
                              </span>
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                activecondition={pathname.includes("warehouse")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${open
                            ? ""
                            : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <WarehouseIcon
                              className={`shrink-0 fill-current ${pathname.includes("warehouse")
                                  ? "text-violet-500"
                                  : "text-gray-400 dark:text-gray-500"
                                }`}
                            />
                            <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Warehouse
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/warehouse"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Warehouse
                              </span>
                            </NavLink>
                          </li>
                          {/* <li className="mb-1 last:mb-0 p-2">
                            <NavLink end to="/ dark:hover:text-gray-200 transition duration-150 truncate">
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                               Warehouse Report
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink end to="/ hover:text-gray-700 dark:hover:text-gray-200 transition duration-150 truncate">
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                               GRN
                              </span>
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activecondition={
                  pathname.includes("warrantyMgt") ||
                  pathname.includes("serviceMgt")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("finance")
                            ? ""
                            : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <VerifiedIcon
                              className={`shrink-0 fill-current ${/^\/(warrantyMgt|serviceMgt)(\/|$)/.test(
                                pathname
                              )
                                  ? "text-violet-500"
                                  : "text-gray-400 dark:text-gray-500"
                                }`}
                            />
                            <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Warranty & Service Mgt
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/warrantyMgt"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Warranty Management
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/serviceMgt"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Service Management
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span
                className="hidden xl:block xl:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                More
              </span>
            </h3>
            <ul className="mt-3">
              {/* Settings */}
              <SidebarLinkGroup
                activecondition={
                  pathname.includes("/setting/service") ||
                  pathname.includes("/setting/inventory")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("settings")
                            ? ""
                            : "hover:text-gray-900 dark:hover:text-white"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <SettingsOutlinedIcon
                              className={`shrink-0 fill-current ${pathname.includes("setting/inventory")
                                  ? "text-violet-500"
                                  : "text-gray-400 dark:text-gray-500"
                                }`}
                            />
                            <span className="text-sm font-medium ml-4 xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Settings
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"
                                }`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="xl:hidden xl:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                          {/* <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/setting/service"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium xl:opacity-0 xl:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ">
                              Service
                              </span>
                            </NavLink>
                          </li> */}

                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/setting/inventory"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ">
                                Inventory
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/staff"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ">
                                Staff
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/companySetting"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ">
                                Company
                              </span>
                            </NavLink>
                          </li>
                          <li className="mb-1 last:mb-0 p-2">
                            <NavLink
                              end
                              to="/role"
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " +
                                (isActive
                                  ? "text-violet-500"
                                  : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 ">
                                Role
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>

            {/* <ul className="mt-3">
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${
                  pathname.includes("inbox") &&
                  "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                }`}
              >
                <NavLink
                  end
                  to="/setting/service"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("inbox")
                      ? ""
                      : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                  <SettingsOutlinedIcon
                              className={`shrink-0 fill-current ${
                                pathname.includes("finance")
                                  ? "text-violet-500"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Settings
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul> */}
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden xl:inline-flex 2xl:hidden justify-end mt-auto cursor-pointer">
          <div className="w-12 pl-4 pr-3 py-2">
            <button
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
