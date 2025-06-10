"use client"
import Header from "@/app/components/Header";
import api from "@/service/apiService";
import sidebarClick from "@/service/sidebarStoreService";
import userStore from "@/service/userStoreService";
import windowWidthStore from "@/service/windowWidthService";
import { faArrowAltCircleLeft, faCancel, faCopy, faHistory, faRuler, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FileInput, Label } from "flowbite-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PredictScan() {
    const router = useRouter();
    const { isOpen } = sidebarClick();
    const { user, setUser } = userStore();
    const { windowWidth } = windowWidthStore();
    const [preview, setPreview] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true);
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [predicted, setPredicted] = useState(false)
    const [predictedData, setPredictedData] = useState('')

    useEffect(() => {
        if (preview !== null) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }, [preview]);

    const handleImageChange = e => {
        const file = e.target.files?.[0]
        setFile(file)
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePredictImage = async () => {
        setLoading(true)
        toast.loading('Predicting image...')
        let formData = new FormData()
        formData.append('image_file', file)

        await api.post('/scans', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(result => {
            setPredictedData(result.data.data)
            setPredicted(true)
            toast.dismiss()
            toast.success('Image predicted successfully')
        }).catch(err => {
            toast.dismiss()
            toast.error("An error occurred. Please try again later.");
        })
        setLoading(false)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(predictedData?.predicted)
        toast.success('Text has been copied to the clipboard!')
    }

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
        };

        fillUser();
        setLoading(false)
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
                                <h1 className="text-3xl font-bold text-gray-800">Predict Scan</h1>
                                <p className="text-gray-600 mt-1">Predict your uploaded scan with OCR system</p>
                            </div>
                            <Button className="w-fit bg-blue-700 text-white flex gap-2 mr-3 self-center cursor-pointer" onClick={() => {
                                if (!predicted) {
                                    router.push("/scans/history")
                                } else {
                                    router.push("/scans")
                                    setPredicted(false)
                                    setPredictedData(null)
                                }
                            }}>
                                <FontAwesomeIcon icon={(!predicted ? faHistory : faArrowAltCircleLeft)} />
                                <span>{(!predicted ? 'History Scanned Image' : 'Back')}</span>
                            </Button>
                        </div>
                        {loading ? (
                            <>
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
                            </>
                        ) : (<div className="bg-white rounded-lg p-8 my-5">
                            {!predicted ? (
                                <>
                                    <div className="flex w-full items-center justify-center">
                                        <Label
                                            htmlFor="dropzone-file"
                                            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                                        >
                                            {preview ? (
                                                <img src={preview} alt="preview" className="h-full w-full object-contain bg-white" />
                                            ) : (<div className="flex flex-col items-center justify-center pb-6 pt-5">
                                                <svg
                                                    className="mb-4 h-8 w-8 text-gray-500"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, JPEG, or SVG (MAX. 2MB)</p>
                                            </div>)}
                                            <FileInput id="dropzone-file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg, image/svg+xml" />
                                        </Label>
                                    </div>
                                    <div className="flex justify-center pt-4 gap-3">
                                        <Button disabled={isDisabled}
                                            className={
                                                "w-fit text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors flex gap-2 " +
                                                (isDisabled
                                                    ? "bg-primary-400 cursor-not-allowed"
                                                    : "bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 cursor-pointer")
                                            } onClick={handlePredictImage}>
                                            <FontAwesomeIcon icon={faRuler} />
                                            <span>Predict Image</span>
                                        </Button>
                                        {preview ? (
                                            <button
                                                type="submit"
                                                className="flex gap-2 w-fit text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
                                                onClick={() => setPreview(null)}
                                            >
                                                <FontAwesomeIcon icon={faTrashRestore} className="self-center" />Clear
                                            </button>
                                        ) : null}
                                    </div>
                                </>) : (<div className="@max-[768px]:flex-row md:flex gap-5">
                                    <img
                                        src={preview}
                                        alt="img_scan_user"
                                        className="md:w-[50%] @max-[768px]:w-full"
                                    />
                                    <div className="flex-col gap-3 text-[15pt] mt-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                                            {predictedData?.user_id}
                                        </span>
                                        <p className="flex gap-2 mb-2 mt-3">
                                            <span className="flex w-[170px] text-gray-600 font-light self-center">
                                                <span className="flex-grow-1">Diprediksi</span>
                                                <span>:</span>
                                            </span>
                                            <h3 className="font-md text-[20pt] text-blue-800 mb-1 self-center text-justify">
                                                {predictedData?.predicted}
                                            </h3>
                                        </p>
                                        <Button
                                            className="mt-8 w-fit text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors flex gap-2 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 cursor-pointer"
                                            onClick={handleCopy}>
                                            <FontAwesomeIcon icon={faCopy} />
                                            <span>Copy Text</span>
                                        </Button>
                                    </div>
                                </div>)}
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    )
}