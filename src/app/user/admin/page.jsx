"use client";
import userStore from "@/service/userStoreService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import toast from "react-hot-toast";
import Header from "@/app/components/Header";
import Table from "@/app/components/Table";

export default function AdminUser() {
  const router = useRouter();
  const { isOpen } = sidebarClick();
  const { user, setUser } = userStore();
  const { windowWidth } = windowWidthStore();
  const [columnConfig, setColumnConfig] = useState();

  const userStoreFill = async (setUser, router) => {
    if (Cookies.get("token")) {
      let { data } = await api.get("/user/profile");
      setUser(data);
      return data;
    }
    return null;
  };

  useEffect(() => {
    const fillUser = async () => {
      const fetchedUser = await userStoreFill(setUser, router);

      const baseColumns = [
        {
          title: "name",
          header: "Nama",
          type: "string",
          sortable: true,
          filter: true,
          filterPlaceholder: "Search by name",
        },
        {
          title: "email",
          header: "Email",
          type: "string",
          sortable: true,
          filter: true,
          filterPlaceholder: "Search by email",
        },
        {
          title: "img_profile",
          header: "Gambar",
          type: "string",
          sortable: true,
          filter: true,
          filterPlaceholder: "Search by gambar",
        },
        {
          title: "role",
          header: "Tipe User",
          type: "string",
          sortable: true,
          filter: true,
          filterPlaceholder: "Search by role",
        },
        {
          header: "Action",
          type: "string",
          toDetail: "/user/detail",
        },
      ];

      setColumnConfig(baseColumns);

      // if (user?.role !== "admin") {
      //   toast.error("You're not allowed to access this page!");
      //   router.push("/dashboard");
      // }
    };

    fillUser();
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <Header />
        <div
          className="h-screen relative pt-20 bottom-0 overflow-y-auto z-[0]"
          style={
            windowWidth >= 600
              ? {
                marginLeft: isOpen ? "250px" : "0px",
                transition: "margin-left 0.3s ease-in-out",
              }
              : {}
          }
        >
          <div className="flex flex-col mx-8 pb-20 ml-7 overflow-hidden">
            <div className="mx-16"></div>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">Users</h1>
            <p className="text-gray-600 mt-1">List of your users</p>
            <div className="mt-5 flex flex-col gap-4 ">
              <Table
                columns={columnConfig}
                titleTable="Users"
                baseUrlAPI="/user/profile/detail"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
