"use client";
import api, { setOnLogout } from "@/service/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import userStore from "@/service/userStoreService";
import { errorHelperStyle, errorLabelStyle, inputFormErrorStyle, inputFormStyle, labelStyle } from "@/app/styleValidation";
import Cookies from "js-cookie";

export default function Login() {
    const { user, setUser, clearUser } = userStore();

    const [userData, setUserData] = useState(null);

    let router = useRouter();

    const userStoreFill = async (setUser, router) => {
        if (Cookies.get("token")) {
            let { data } = await api.get("/user/profile");
            setUser(data);
            setUserData(data);
            router.push("/dashboard");
        }
    }

    useEffect(() => {
        // setOnLogout(() => {
        //     clearUser();
        //     router.push("/auth/login");
        //     toast.error("You have been logged out. Please log in again.");
        // })
        
        if (Cookies.get('token')) {
            const fillUser = async () => {
                await userStoreFill(setUser, router);
                console.log(userData);
            }
            fillUser();
        }
    })

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorGet, setError] = useState({});

    const handleSubmit = async (e) => {
        toast.loading("Logging in...");

        e.preventDefault();

        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        await api.post("/auth/login", formData)
            .then(async (response) => {
                Cookies.set("token", response.data.token);
                Cookies.set("refresh_token", response.data.refresh_token);

                let { data } = await api.get("/user/profile");
                setUser(data);
                toast.dismiss();
                toast.success("Login successful!");
                router.push("/dashboard");
            })
            .catch((error) => {
                toast.dismiss();
                if (error.response && error.response.status === 400) {
                    toast.error("Invalid email or password. Please try again.");
                } else {
                    toast.error("An error occurred. Please try again later.");
                }
            });

    }

    return (
        <div className="flex justify-center min-h-screen max-h-fit">
            <div className="flex flex-col items-center px-6 py-24 mx-auto md:h-screen bg-gray-100 w-full">
                <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <img src="/icon-removebg-preview.png" className="mr-3 h-12 sm:h-10" alt="Flowbite React Logo" />
                </Link>
                <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight md:text-2xl">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="email" className={(!errorGet.email) ? labelStyle : errorLabelStyle}>Email</label>
                                    <input type="email" name="email" id="email" className={(!errorGet.email) ? inputFormStyle : inputFormErrorStyle} placeholder="name@company.com" required="" onChange={(e) => setEmail(e.target.value)} />
                                    {(errorGet.email) ? <div className="mt-2">{errorGet.email.map(element => (
                                        <span key={element} className={errorHelperStyle}>{element}</span>
                                    ))}</div> : ''}
                                </div>
                                <div>
                                    <label htmlFor="password" className={(!errorGet.password) ? labelStyle : errorLabelStyle}>Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className={(!errorGet.password) ? inputFormStyle : inputFormErrorStyle} required="" onChange={(e) => setPassword(e.target.value)} />
                                    {(errorGet.password) ? <div className="mt-2">{errorGet.password.map(element => (
                                        <span key={element} className={errorHelperStyle}>{element}</span>
                                    ))}</div> : ''}
                                </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 " required="" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500">Remember me</label>
                                    </div>
                                </div>
                                {/* <Link href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</Link> */}
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={handleSubmit}>Sign in</button>
                            <p className="text-sm font-light text-gray-500">
                                Don’t have an account yet? <Link href="/auth/register" className="font-medium text-primary-600 hover:underline">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}