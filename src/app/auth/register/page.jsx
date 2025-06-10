"use client";

import { errorHelperStyle, errorLabelStyle, helperStyle, inputFormErrorStyle, inputFormStyle, labelStyle } from "@/app/styleValidation";
import api from "@/service/apiService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [file, setFile] = useState(null);
    const [errorGet, setError] = useState({});

    const handleSubmit = async (e) => {        
        e.preventDefault();
        
        let formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", confPassword);
        if (file !== null) {
            formData.append("img_profile", file);
        }
        
        await api.post("/auth/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                toast.success("Registration successful! Please log in.");
                router.push("/auth/login");
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    toast.error("Invalid input. Please check your details and try again.");
                    setError(error.response.data.errors);
                } else {
                    toast.error("An error occurred. Please try again later.");
                }
            });
    }
    
    return (
            <div className="flex justify-center min-h-screen max-h-fit bg-gray-100 w-full">
                <div className="my-10 self-center flex flex-col w-[50%]">
                    <Link href="/" className="flex justify-center mb-6 text-2xl font-semibold text-gray-900">
                        <img src="/icon-removebg-preview.png" className="mr-3 h-12 sm:h-10" alt="Flowbite React Logo" />
                    </Link>
                    <div className="bg-white rounded-lg shadow-2xl md:mt-0 max-sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl text-center font-bold leading-tight tracking-tight md:text-2xl">
                                Sign up your account
                            </h1>
                            <p className="text-sm font-light text-gray-500">
                                Fill in the details below to create your account. If you already have an account, please <Link href="/auth/login" className="font-medium text-primary-600 hover:underline">sign in</Link>.
                            </p>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="name" className={(!errorGet.name) ? labelStyle : errorLabelStyle}>Name</label>
                                    <input type="text" name="name" id="name" className={(!errorGet.name) ? inputFormStyle : inputFormErrorStyle} placeholder="Example Name" required="" onChange={(e) => setName(e.target.value)} />
                                    {(errorGet.name) ? <div className="mt-2">{errorGet.name.map(element => (
                                        <span key={element} className={errorHelperStyle}>{element}</span>
                                    ))}</div>: ''}
                                </div>
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
                                <div>
                                    <label htmlFor="confpassword" className={(!errorGet.password) ? labelStyle : errorLabelStyle}>Confirm Password</label>
                                    <input type="password" name="confpassword" id="confpassword" placeholder="••••••••" className={(!errorGet.password) ? inputFormStyle : inputFormErrorStyle} required="" onChange={(e) => setConfPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label className={(!errorGet.img_profile) ? labelStyle : errorLabelStyle} htmlFor="file_input">Upload file</label>
                                    <input className={(!errorGet.img_profile) ? inputFormStyle : inputFormErrorStyle} aria-describedby="file_input_help" id="file_input" type="file" onChange={(e) => setFile(e.target.files[0])} />
                                    {(!errorGet.img_profile) ? <p className={helperStyle} id="file_input_help"><span className="font-medium">Optional.</span> SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                                    : <div className="mt-2">{errorGet.img_profile.map(element => (
                                        <span key={element} className={errorHelperStyle}>{element}</span>
                                    ))}</div>
                                    }
                                </div>
                                
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={handleSubmit}>Sign up</button>
                                
                            </form>
                        </div>
                    </div>
                </div>
        </div>
    )
}