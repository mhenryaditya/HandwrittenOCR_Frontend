"use client";
import userStore from "@/service/userStoreService";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import Table from "../../components/Table";
import { faArrowAltCircleLeft, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "flowbite-react";

export default function Scan() {
  const router = useRouter();
  const { isOpen } = sidebarClick();
  const { user, setUser } = userStore();
  const { windowWidth } = windowWidthStore();

  const [columnConfig, setColumnConfig] = useState(null)

  const userStoreFill = async (setUser, router) => {
    if (Cookies.get('token')) {
      let { data } = await api.get('/user/profile');
      setUser(data);
      return data;
    }
    return null;
  };

  function configNew(role) {
    if (role === 'admin') {
      return { header: 'Action', type: 'string', toDetail: '/scans/detail', toRemove: '/scans' };
    } else if (role === 'user') {
      return {
        header: 'Action',
        type: 'string',
        toDetail: '/scans/detail',
        toRemove: '/scans',
      };
    }
    return null;
  }

  useEffect(() => {
    const fillUser = async () => {
      const fetchedUser = await userStoreFill(setUser, router);

      const baseColumns = [
        { title: 'user.name', header: 'Nama', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by name' },
        { title: 'image_path', header: 'Gambar', type: 'image', sortable: true, filter: true, filterPlaceholder: 'Search by gambar' },
        { title: 'predicted', header: 'Prediksi', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by prediksi' },
      ];

      const actionConfig = configNew(fetchedUser?.role);
      if (actionConfig) baseColumns.push(actionConfig);

      setColumnConfig(baseColumns);
    };

    fillUser();
  }, []);

  return (
    <>
      <div className="overflow-hidden">
        <Header />
        <div className="h-screen relative pt-20 bottom-0 overflow-y-auto z-[0]" style={windowWidth >= 600 ? { marginLeft: isOpen ? "250px" : "0px", transition: "margin-left 0.3s ease-in-out" } : {}}>
          <div className="flex flex-col mx-8 pb-20 ml-7 overflow-hidden">
            <div className="mx-16"></div>
            <div className="flex justify-between mt-2">
              <div className="">
                <h1 className="text-3xl font-bold text-gray-800">History Scan</h1>
                <p className="text-gray-600 mt-1">History prediction of your uploaded scan with OCR system</p>
              </div>
              <Button className="w-fit bg-blue-700 text-white flex gap-2 mr-3 self-center cursor-pointer" onClick={() => router.push("/scans")}>
                <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                <span>Back</span>
              </Button>
            </div>
            {/* <h1 className="text-3xl font-bold text-gray-800">Scan</h1>
            <p className="text-gray-600 mt-1">List of your scan</p> */}
            <div className="mt-5 flex flex-col gap-4 ">
              <Table columns={columnConfig} titleTable='Scan' baseUrlAPI='/scans'></Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}