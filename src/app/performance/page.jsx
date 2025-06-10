"use client";
import userStore from "@/service/userStoreService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import { faArrowAltCircleLeft, faArrowLeft, faCircleXmark, faInfo, faInfoCircle, faRepeat, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button } from "flowbite-react";
import Header from "../components/Header";
import Table from "../components/Table";
import toast from "react-hot-toast";

export default function Feedback() {
  const router = useRouter();
  const { isOpen } = sidebarClick();
  const { user, setUser } = userStore();
  const { windowWidth } = windowWidthStore();
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false)

  const [numFeedbacks, setNumFeedbacks] = useState(0)
  const [numTrain, setNumTrain] = useState(0)
  const [columnConfig, setColumnConfig] = useState([])

  const userStoreFill = async (setUser, router) => {
    if (Cookies.get('token')) {
      let { data } = await api.get('/user/profile');
      setUser(data);
      return data;
    }
    return null;
  };

  useEffect(() => {
    const fillUser = async () => {
      const fetchedUser = await userStoreFill(setUser, router);
      let { data: feedbackData } = await api.get("/feedbacks/num");
      let { data: trainData } = await api.get("/performance/num");
      setNumFeedbacks(feedbackData.num_feedbacks);
      setNumTrain(trainData.num_train);

      const baseColumns = [
        { title: 'created_at', header: 'Training Date', type: 'date', sortable: true, filter: true, filterPlaceholder: 'Search by date' },
        { title: 'accuracy', header: 'Accuracy', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by accuracy' },
        { title: 'precision', header: 'Precision', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by precision' },
        { title: 'recall', header: 'Recall', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by recall' },
        { title: 'f1_score', header: 'F1 Score', type: 'string', sortable: true, filter: true, filterPlaceholder: 'Search by f1_score' },
      ];

      setColumnConfig(baseColumns);
      setLoading(false)
    };

    fillUser();
  }, []);

  const trainModel = async () => {
    setLoading(true)
    let str = numTrain === 0 ? 'Training' : 'Retraining'
    let str2 = numTrain === 0 ? 'trained' : 'retrained'
    toast.loading(`${str} model... Please wait.`)

    await api.post('/model/train')
      .then(response => {
        // const { data } = await api.post('/performance', {
        //   accuracy: response.data.data.accuracy,
        //   precision: response.data.data.precision,
        //   recall: response.data.data.recall,
        //   f1_score: response.data.data.f1_score
        // })
        toast.dismiss();
        toast.success(`Model has been ${str2} successfully!`)
        setRefreshTable(prev => !prev)
      })
      .catch((error) => {
        toast.dismiss();
        if (error.response || error.response.status === 400 || error.response.status === 500) {
          toast.error("An error occurred. Please try again later.");
        }
      });

    setLoading(false)
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
                <h1 className="text-3xl font-bold text-gray-800">Performance</h1>
                <p className="text-gray-600 mt-1">The monitoring center of OCR's Machine Learning System</p>
              </div>
              {user?.role === 'admin' ? (<Button className="w-fit bg-blue-700 text-white flex gap-2 mr-3 self-center cursor-pointer" onClick={trainModel}>
                <FontAwesomeIcon icon={faRepeat} />
                <span>Train Model</span>
              </Button>) : null}
            </div>
            {loading ? (
              <div role="status" className="animate-pulse mt-4">
                <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (<div className="">
              {(numFeedbacks > 0 || numTrain === 0) ? (<Alert color={numTrain === 0 ? 'red' : 'info'} className="mt-3 shadow">
                <div className="flex flex-row gap-3">
                  {numTrain === 0 ? (<FontAwesomeIcon icon={faCircleXmark} className="self-center" size="2x" />) : (<FontAwesomeIcon icon={faInfoCircle} className="self-center" size="2x" />)}
                  <div className="self-center text-[12pt]">
                    <span className="font-bold">Information</span>
                    {numTrain === 0 ? (<span> There is not retrain model. Train model first!</span>) : (<span> There are {numFeedbacks} feedbacks. It's time to retrain model!</span>)}
                  </div>
                </div>
              </Alert>) : null}
              <div className="mt-5 flex flex-col gap-4 ">
                <Table columns={columnConfig} titleTable='Performance' baseUrlAPI='/performance' refreshTrigger={refreshTable}></Table>
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
}