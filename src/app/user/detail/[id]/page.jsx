"use client";
import userStore from "@/service/userStoreService";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import sidebarClick from "@/service/sidebarStoreService";
import windowWidthStore from "@/service/windowWidthService";
import Cookies from "js-cookie";
import api from "@/service/apiService";
import Table from "../../../components/Table";
import toast, { useToaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faCancel,
  faCheckCircle,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "flowbite-react";
import {
  errorHelperStyle,
  errorLabelStyle,
  helperStyle,
  inputFormErrorStyle,
  inputFormStyle,
  labelStyle,
} from "@/app/styleValidation";

export default function DetailUser() {
  const param = useParams();
  const router = useRouter();
  const { isOpen } = sidebarClick();
  const { user, setUser } = userStore();
  const { windowWidth } = windowWidthStore();
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorGet, setError] = useState({});
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [email, setEmail] = useState("");
  const [imgProfile, setImgProfile] = useState("");
  const [file, setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const userStoreFill = async (setUser, router) => {
    if (Cookies.get("token")) {
      let { data } = await api.get("/user/profile");
      setUser(data);
      return data;
    }
    return null;
  };

  useEffect(() => {
    if (isEdit) {
      // Disable if all edit fields are empty
      const isEditFieldsFilled = name.trim() !== "" || email.trim() !== "" || file !== null;
      setIsDisabled(!isEditFieldsFilled);
    } else {
      // Disable if both password fields are empty
      const isPasswordFieldsFilled = password.trim() !== "" && newPassword.trim() !== "";
      setIsDisabled(!isPasswordFieldsFilled);
    }
  }, [password, newPassword, name, email, file, isEdit]);

  useEffect(() => {
    const fillUser = async () => {
      const fetchedUser = await userStoreFill(setUser, router);
    };

    const fillDataDetailed = async () => {
      try {
        const { data } = await api.get(`/user/profile/detail?id=${param.id}`);
        let getData = data.data[0];
        setName(getData.name);
        setEmail(getData.email);
        setRole(getData.role);
        setCreatedAt(getData.created_at);
        setImgProfile(getData.img_profile);
      } catch (error) {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fillUser();
    fillDataDetailed();
  }, [loading]);

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    let formData = new FormData();

    if (isEdit) {
      if (name !== "") {
        formData.append("name", name);
      }
      if (email !== "") {
        formData.append("email", email);
      }
      if (file !== null) {
        formData.append("img_profile", file);
      }
    } else {
      formData.append("password", password);
      formData.append("confirmation_password", newPassword);
    }

    await api
      .post(`/user/profile/detail/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          _method: 'PUT'
        }
      })
      .then((response) => {
        toast.success(
          !isEdit
            ? "Password has been changed successfully!"
            : "Data has been saved successfully!"
        );
      })
      .catch((error) => {
        toast.dismiss();
        if (error.response && error.response.status === 400) {
          toast.error("Invalid input. Please try again.");
          setError(error.response.data.errors);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
    setLoading(false)
  };

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
                  Detail User
                </h1>
                <p className="text-gray-600 mt-1">
                  Detail information of an user
                </p>
              </div>
              {user?.role === "admin" ? (
                <Button
                  className="w-fit bg-blue-700 text-white flex gap-2 mr-3 self-center cursor-pointer"
                  onClick={() => router.push("/user/admin")}
                >
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                  <span>Back</span>
                </Button>
              ) : null}
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
                <div className="bg-white rounded-lg p-8 @max-[768px]:flex-row md:flex gap-10">
                  <div className="md:w-[30%] @max-[768px]:w-full">
                    {imgProfile ? (
                      <img
                        src={imgProfile}
                        alt="img_user"
                        className="w-full rounded-lg"
                      />
                    ) : (
                      <div className="flex w-full h-full justify-center bg-gray-100  rounded-lg">
                        <p className="font-light text-gray-500 self-center">
                          No Image
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex-col gap-3 flex-grow-1 text-[12pt]">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                      {role}
                    </span>
                    <h3 className="font-bold text-[25pt] text-blue-800 mb-4">
                      {name}
                    </h3>
                    <p className="flex gap-2 mb-2">
                      <span className="flex w-[170px] text-gray-600 font-light">
                        <span className="flex-grow-1">Email</span>
                        <span>:</span>
                      </span>
                      <span>{email}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="flex w-[170px] text-gray-600 font-light">
                        <span className="flex-grow-1">Dibuat pada</span>
                        <span>:</span>
                      </span>
                      <span>{createdAt.split("T")[0]}</span>
                    </p>
                  </div>
                  <Button
                    className="w-fit bg-yellow-400 hover:bg-amber-600 text-white flex gap-2 mr-3 cursor-pointer"
                    onClick={() => setIsEdit(true)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                    <span>Edit Profile</span>
                  </Button>
                </div>
                <div className="bg-white rounded-lg p-5 px-8 @max-[768px]:flex-row md:flex gap-10 mt-3">
                  <p className="font-light text-gray-500">
                    {!isEdit ? "Forgot Password" : "Edit Data Profile"}
                  </p>
                  <form className="w-full flex flex-col gap-4" action="#">
                    {!isEdit ? (
                      <>
                        <div>
                          <label
                            htmlFor="Password"
                            className={
                              !errorGet.Password ? labelStyle : errorLabelStyle
                            }
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={password}
                            id="password"
                            className={
                              !errorGet.password
                                ? inputFormStyle
                                : inputFormErrorStyle
                            }
                            placeholder="••••••••"
                            required=""
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {errorGet.password ? (
                            <div className="mt-2">
                              {errorGet.password.map((element) => (
                                <span
                                  key={element}
                                  className={errorHelperStyle}
                                >
                                  {element}
                                </span>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="confpassword"
                            className={
                              !errorGet.password ? labelStyle : errorLabelStyle
                            }
                          >
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confpassword"
                            value={newPassword}
                            id="confpassword"
                            placeholder="••••••••"
                            className={
                              !errorGet.password
                                ? inputFormStyle
                                : inputFormErrorStyle
                            }
                            required=""
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          {errorGet.password ? (
                            <div className="mt-2">
                              {errorGet.password.map((element) => (
                                <span
                                  key={element}
                                  className={errorHelperStyle}
                                >
                                  {element}
                                </span>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label
                            htmlFor="name"
                            className={
                              !errorGet.name ? labelStyle : errorLabelStyle
                            }
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={name}
                            id="name"
                            className={
                              !errorGet.name
                                ? inputFormStyle
                                : inputFormErrorStyle
                            }
                            placeholder="Input name"
                            required=""
                            onChange={(e) => setName(e.target.value)}
                          />
                          {errorGet.name ? (
                            <div className="mt-2">
                              {errorGet.name.map((element) => (
                                <span
                                  key={element}
                                  className={errorHelperStyle}
                                >
                                  {element}
                                </span>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className={
                              !errorGet.email ? labelStyle : errorLabelStyle
                            }
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={email}
                            id="email"
                            placeholder="Input email"
                            className={
                              !errorGet.email
                                ? inputFormStyle
                                : inputFormErrorStyle
                            }
                            required=""
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {errorGet.email ? (
                            <div className="mt-2">
                              {errorGet.email.map((element) => (
                                <span
                                  key={element}
                                  className={errorHelperStyle}
                                >
                                  {element}
                                </span>
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          <label
                            className={
                              !errorGet.img_profile
                                ? labelStyle
                                : errorLabelStyle
                            }
                            htmlFor="file_input"
                          >
                            Upload file
                          </label>
                          <input
                            className={
                              !errorGet.img_profile
                                ? inputFormStyle
                                : inputFormErrorStyle
                            }
                            aria-describedby="file_input_help"
                            id="file_input"
                            type="file"
                            name="img_profile"
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                          {!errorGet.img_profile ? (
                            <p className={helperStyle} id="file_input_help">
                              <span className="font-medium">Optional.</span>{" "}
                              SVG, PNG, JPG or GIF (MAX. 800x400px).
                            </p>
                          ) : (
                            <div className="mt-2">
                              {errorGet.img_profile.map((element) => (
                                <span
                                  key={element}
                                  className={errorHelperStyle}
                                >
                                  {element}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isDisabled}
                        className={
                          "w-fit text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors " +
                          (isDisabled
                            ? "bg-primary-400 cursor-not-allowed"
                            : "bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300")
                        }
                        onClick={handleSubmit}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {!isEdit ? " Change Password" : " Save profile"}
                      </button>
                      {isEdit ? (
                        <button
                          type="submit"
                          className="w-fit text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                          onClick={() => setIsEdit(false)}
                        >
                          <FontAwesomeIcon icon={faCancel} />
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
