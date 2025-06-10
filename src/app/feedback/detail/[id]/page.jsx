"use client";
import userStore from "@/service/userStoreService";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import toast, { useToaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";
import Header from "@/app/components/Header";

export default function DetailFeedback() {
  const param = useParams();
  const router = useRouter();
  const { isOpen } = sidebarClick();
  const { user, setUser } = userStore();
  const { windowWidth } = windowWidthStore();
  const [dataDetailed, setDataDetailed] = useState();
  const [loading, setLoading] = useState(true);

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
    };

    const fillDataDetailed = async () => {
      try {
        const { data } = await api.get(`/feedback/${param.id}`);
        setDataDetailed(data.data[0]);
      } catch (error) {
        toast.error("You're not allowed to access this content!");
        router.push("/scans");
      } finally {
        setLoading(false);
      }
    };

    fillUser();
    fillDataDetailed();
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
            <div className="flex justify-between mt-2">
              <div className="">
                <h1 className="text-3xl font-bold text-gray-800">
                  Detail Feedback
                </h1>
                <p className="text-gray-600 mt-1">
                  Detail information of a feedback
                </p>
              </div>
              <Button
                className="w-fit bg-blue-700 text-white flex gap-2 mr-3 self-center cursor-pointer"
                onClick={() => router.push("/feedback")}
              >
                <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                <span>Back</span>
              </Button>
            </div>
            {loading ? (
              <div className="mt-5 flex flex-col gap-2">
                <div role="status" className="animate-pulse">
                  <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                  <span className="sr-only">Loading...</span>
                </div>
                <div role="status" className="animate-pulse">
                  <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-4 ">
                <div className="bg-white rounded-lg p-8 @max-[768px]:flex-row md:flex gap-5">
                  <img
                    src={dataDetailed.scan.image_path}
                    alt="img_scan_user"
                    className="md:w-[50%] @max-[768px]:w-full"
                  />
                  <div className="flex-col gap-3 text-[15pt] mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                      {dataDetailed.id}
                    </span>
                    <h3 className="font-bold text-[25pt] text-blue-800 mb-4">
                      Gambar oleh {dataDetailed.scan.user.name}
                    </h3>
                    <p className="flex gap-2 mb-2">
                      <span className="flex w-[170px] text-gray-600 font-light">
                        <span className="flex-grow-1">Id Scan</span>
                        <span>:</span>
                      </span>
                      <span>{dataDetailed.scan.id}</span>
                    </p>
                    <p className="flex gap-2 mb-2">
                      <span className="flex w-[170px] text-gray-600 font-light">
                        <span className="flex-grow-1">Diprediksi</span>
                        <span>:</span>
                      </span>
                      <span>{dataDetailed.scan.predicted}</span>
                    </p>
                    <p className="flex gap-2 mb-2">
                      <span className="flex w-[170px] text-gray-600 font-light">
                        <span className="flex-grow-1">Retrain?</span>
                        <span>:</span>
                      </span>
                      <span>{dataDetailed.used_for_training}</span>
                    </p>

                  </div>
                  <div className=""></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
