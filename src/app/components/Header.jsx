"use client";
import api from "@/service/apiService";
import sidebarClick from "@/service/sidebarStoreService";
import userStore from "@/service/userStoreService";
import windowWidthStore from "@/service/windowWidthService";
import { faArrowLeftLong, faDashboard, faHeartPulse, faLaptopFile, faMale, faPenRuler, faProcedures, faRunning, faTools } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

export default function Header() {
  const pathname = usePathname().split("/")[1].toLowerCase();

  const router = useRouter();
  let { isOpen, setSidebarClick } = sidebarClick();
  const { user, setUser, clearUser } = userStore();
  const { windowWidth, setWindowWidth } = windowWidthStore();
  const [loading, setLoading] = useState(true);

  const handleSidebarClick = () => {
    setSidebarClick(!isOpen);
    if (windowWidth < 600) {
      if (isOpen) {
        document.getElementById("bgDark").classList.add("hidden");
      } else {
        document.getElementById("bgDark").classList.remove("hidden");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (windowWidth > 768) {
      setSidebarClick(true);
    } else {
      setSidebarClick(false);
    }

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const userStoreFill = async (setUser, router) => {
    if (Cookies.get("token")) {
      let { data } = await api.get("/user/profile");
      setUser(data);
    }
  }

  useEffect(() => {
    const fillUser = async () => {
      await userStoreFill(setUser, router);
    }
    fillUser();
  }, []);

  const handleRemoveBgDark = (e) => {
    e.target.classList.add("hidden");
    setSidebarClick(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refresh_token");
    toast.success("You have been logged out successfully.");
    router.push("/auth/login");
    // clearUser();
  };

  return (
    <div className="bg-gray-100 w-full h-full pr-10 flex flex-row-reverse gap-3 justify-center absolute">
      <div className="bg-gray-100 opacity-95 fixed w-full h-[68px] z-[1]"></div>
      <div className="bg-[#C5DEFC] shadow-md h-[55px] w-full flex ms-4 mt-3 p-5 rounded-lg relative z-10">
        <div className="self-center flex w-full justify-between items-center">
          <div
            className="flex hover:cursor-pointer"
            onClick={handleSidebarClick}
          >
            <div className="flex flex-col gap-1 size-5 items-center h-fit">
              <span className="border border-b-3 border-blue-800 rounded-full w-full"></span>
              <span className="border border-b-3 border-blue-800 rounded-full w-full"></span>
              <span className="border border-b-3 border-blue-800 rounded-full w-full"></span>
            </div>
          </div>
          <div className="flex gap-5">
            <span className="self-center text-blue-800 font-medium">
              {user?.name}
            </span>
            {
              <img
                src={user?.img_profile ?? "/user.png"}
                className="rounded-full size-10 "
                alt=""
              />
            }
          </div>
        </div>
      </div>
      <div
        className={
          isOpen === true && windowWidth < 600
            ? "absolute w-full top-0 left-0 h-full z-10 flex"
            : "z-10"
        }
        style={{ transition: "width 0.3s ease-in-out" }}
      >
        <div
          className="bg-white relative h-full flex flex-col pt-4 gap-2"
          style={{
            width: isOpen ? "250px" : "0px",
            transition: "width 0.3s ease-in-out",
          }}
        >
          <div className="w-full absolute flex justify-center h-[50px]">
            <Link
              href="/dashboard"
              className="flex justify-center text-2xl font-semibold text-gray-900"
            >
              <img
                src="/icon-removebg-preview.png"
                className=" mr-3 h-12 sm:h-10"
                alt="Flowbite React Logo"
              />
            </Link>
          </div>
          <div className="mt-10 flex-grow overflow-y-auto overflow-x-hidden pt-3">
            <div className="flex flex-col">
              <div className="mt-3 mx-5">
                <div className="flex flex-col gap-1">
                  <Link className={("px-[20px] py-[10px] rounded-lg font-medium cursor-pointer hover:text-blue-700 transition flex gap-3") + (pathname === 'dashboard' ? ' bg-blue-800 text-white hover:text-white' : '')} href="/dashboard"><FontAwesomeIcon size="lg" className="self-center w-5" icon={faDashboard} /><span className="flex-grow-1">Dashboard</span></Link>
                  {/* <Link className={("px-[20px] py-[10px] rounded-lg font-medium cursor-pointer hover:text-blue-700 transition flex gap-3") + (pathname === 'feedback' ? ' bg-blue-800 text-white hover:text-white' : '')} href="/feedback"><FontAwesomeIcon size="lg" className="self-center w-5" icon={faPenRuler} /><span className="flex-grow-1">Feedback</span></Link> */}
                  {/* {user?.role === 'admin' ? (<Link className={("px-[20px] py-[10px] rounded-lg font-medium cursor-pointer hover:text-blue-700 transition flex gap-3") + (pathname === 'performance' ? ' bg-blue-800 text-white hover:text-white' : '')} href="/performance"><FontAwesomeIcon size="lg" className="self-center w-5" icon={faLaptopFile} /><span className="flex-grow-1">Performance</span></Link>) : null} */}
                  <Link className={("px-[20px] py-[10px] rounded-lg font-medium cursor-pointer hover:text-blue-700 transition flex gap-3") + (pathname === 'scans' ? ' bg-blue-800 text-white hover:text-white' : '')} href="/scans"><FontAwesomeIcon size="lg" className="self-center w-5" icon={faTools} /><span className="flex-grow-1">Scans</span></Link>
                  <Link className={("px-[20px] py-[10px] rounded-lg font-medium cursor-pointer hover:text-blue-700 transition flex gap-3") + (pathname === 'user' ? ' bg-blue-800 text-white hover:text-white' : '')} href={user?.role === "admin" ? "/user/admin" : `/user/detail/${user?.id}`}><FontAwesomeIcon size="lg" className="self-center w-5" icon={faMale} /><span className="flex-grow-1">User</span></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-0 w-full absolute h-fit py-1 px-3 pb-5">
            <div
              className="bg-[#145cb4] hover:bg-[#1474b4] rounded-lg"
              onClick={handleLogout}
            >
              <Link
                href="/auth/login"
                className="flex gap-1 items-center px-4 py-3 text-sm font-medium text-white"
              >
                <FontAwesomeIcon icon={faArrowLeftLong} className="mr-2 h-6 w-6" />
                <span>Log Out</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          id="bgDark"
          className="w-full flex-grow bg-gray-800 opacity-80 hidden"
          style={{ transition: "display 0.3s ease-in-out" }}
          onClick={(e) => handleRemoveBgDark(e)}
        ></div>
      </div>
    </div>
  );
}
