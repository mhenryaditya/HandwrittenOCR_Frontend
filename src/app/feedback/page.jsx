"use client";
import userStore from "@/service/userStoreService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import { faArrowAltCircleLeft, faArrowLeft, faInfo, faInfoCircle, faLaptopFile, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button } from "flowbite-react";
import Header from "../components/Header";
import Table from "../components/Table";

export default function Feedback() {
  const router = useRouter();
  const { isOpen } = sidebarClick();
  const { user, setUser } = userStore();
  const { windowWidth } = windowWidthStore();

  const [columnConfig, setColumnConfig] = useState(null)
  const [numFeedbacks, setNumFeedbacks] = useState(0)

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
      return { header: 'Action', type: 'string', toDetail: '/feedback/detail' };
    } else if (role === 'user') {
      return {
        header: 'Action',
        type: 'string',
        toDetail: '/feedback/detail',
        toRemove: '/feedback',
      };
    }
    return null;
  }

  useEffect(() => {
    const fillUser = async () => {
      const fetchedUser = await userStoreFill(setUser, router);
      if (user?.role === 'admin') {
        let { data: feedbackData } = await api.get("/feedbacks/num");
        setNumFeedbacks(feepdbackData.num_feedbacks);
      }

      const baseColumns = [
        { title: 'scan.user.name', header: 'Nama', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by name' },
        { title: 'scan.image_path', header: 'Gambar', type: 'image', sortable: true, filter: true, filterPlaceholder: 'Search by gambar' },
        { title: 'scan.predicted', header: 'Diprediksi', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by prediksi' },
        { title: 'corrected', header: 'Pembetulan', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by pembetulan' },
        { title: 'used_for_training', header: 'Retrain?', type: 'number', sortable: true, filter: true, filterPlaceholder: 'Search by retrain' },
      ];

      const actionConfig = configNew(fetchedUser?.role);
      if (actionConfig) baseColumns.push(actionConfig);

      setColumnConfig(baseColumns);
    };

    fillUser();
  }, []);

  const trainModel = () => {

  }

  return (
    <>
      <div className="overflow-hidden">
        <Header />
        <div className="h-screen relative pt-20 bottom-0 overflow-y-auto z-[0]" style={windowWidth >= 600 ? { marginLeft: isOpen ? "250px" : "0px", transition: "margin-left 0.3s ease-in-out" } : {}}>
          <div className="flex flex-col mx-8 pb-20 ml-7 overflow-hidden">
            <div className="mx-16"></div>
            <div className="flex justify-between mt-2">
              <div className="">
                <h1 className="text-3xl font-bold text-gray-800">Feedback</h1>
                <p className="text-gray-600 mt-1">Feedback of some uploaded scans</p>
              </div>
              {user?.role === 'admin' ? (<Button className="w-fit bg-blue-700 text-white flex gap-2 mr-3 self-center cursor-pointer" onClick={() => router.push('/performance')}>
                <FontAwesomeIcon icon={faLaptopFile} />
                <span>Check Performance</span>
              </Button>) : null}
            </div>
            {numFeedbacks > 0 ? (<Alert color="info" className="mt-3 shadow">
              <div className="flex flex-row gap-3">
                <FontAwesomeIcon icon={faInfoCircle} className="self-center" size="2x" />
                <div className="self-center text-[12pt]">
                  <span className="font-bold">Information</span> There are {numFeedbacks} feedbacks. It's time to retrain model!
                </div>
              </div>
            </Alert>) : null}
            {/* <h1 className="text-3xl font-bold text-gray-800">Scan</h1>
            <p className="text-gray-600 mt-1">List of your scan</p> */}
            <div className="mt-5 flex flex-col gap-4 ">
              <Table columns={columnConfig} titleTable='Feedback' baseUrlAPI='/feedback'></Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}