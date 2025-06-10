"use client";
import userStore from "@/service/userStoreService";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale, faPencilRuler, faTools } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const router = useRouter();
    const { isOpen } = sidebarClick();
    const { user, setUser } = userStore();
    const { windowWidth } = windowWidthStore();

    const [loading, setLoading] = useState(true);
    const [numUsers, setNumUsers] = useState(0);
    const [numScans, setNumScans] = useState(0);
    const [numFeedbacks, setNumFeedbacks] = useState(0);

    const userStoreFill = async (setUser, router) => {
        if (Cookies.get("token")) {
            let { data } = await api.get("/user/profile");
            setUser(data);
        }
    }

    let getNumData = async () => {
        let { data } = await api.get("/users/num");
        setNumUsers(data.num_users);
        let { data: scanData } = await api.get("/scans/num");
        setNumScans(scanData.num_scans);
        let { data: feedbackData } = await api.get("/feedbacks/num");
        setNumFeedbacks(feedbackData.num_feedbacks);
        setLoading(false);
    }

    useEffect(() => {
        // setOnLogout(() => {
        //     clearUser();
        //     router.push("/auth/login");
        //     toast.error("You have been logged out. Please log in again.");
        // })

        const fillUser = async () => {
            await userStoreFill(setUser, router);
        }
        fillUser();
    }, [])

    useEffect(() => {
        getNumData();
    }, []);

    return (
        <>
            <div className="">
                <Header />
                <div className="h-full relative top-20 bottom-0" style={windowWidth >= 600 ? { marginLeft: isOpen ? "250px" : "0px", transition: "margin-left 0.3s ease-in-out" } : {}}>
                    <div className="flex flex-col mx-14 ml-7">
                        <h1 className="text-3xl font-bold text-gray-800 mt-2">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome to your dashboard!</p>
                        {loading ? <div className="mt-5 flex flex-col gap-2">
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
                            <div role="status" className="animate-pulse">
                                <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div> :
                            <div className="mt-5 flex flex-row gap-4">
                                <div className="bg-yellow-400 shadow-md rounded-lg p-6 flex-grow-1 flex gap-5">
                                    <FontAwesomeIcon icon={faMale} className="self-center text-gray-800" size="3x" />
                                    <div className="">
                                        <h2 className="text-xl font-semibold text-gray-800">User Statistics</h2>
                                        <p className="text-gray-600 mt-2">Total Users: {numUsers}</p>
                                    </div>
                                </div>
                                <div className="bg-green-400 shadow-md rounded-lg p-6 flex-grow-1 flex gap-5">
                                    <FontAwesomeIcon icon={faTools} className="self-center text-gray-800" size="3x" />
                                    <div className="">
                                        <h2 className="text-xl font-semibold text-gray-800">Scan Statistics</h2>
                                        <p className="text-gray-600 mt-2">Total Scans: {numScans}</p>
                                    </div>
                                </div>
                                <div className="bg-blue-700 shadow-md rounded-lg p-6 flex-grow-1 flex gap-5">
                                    <FontAwesomeIcon icon={faPencilRuler} className="self-center text-white" size="3x" />
                                    <div className="">
                                        <h2 className="text-xl font-semibold text-white">Feedback Statistics</h2>
                                        <p className="text-gray-300 mt-2">Total Feedbacks: {numFeedbacks}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}