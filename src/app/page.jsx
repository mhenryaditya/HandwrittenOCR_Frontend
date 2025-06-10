"use client";
import { Button, Card, TabItem, Tabs} from "flowbite-react";
import { FcAbout } from "react-icons/fc"
import { MdContacts, MdFeaturedPlayList } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import NavbarCustom from "./components/NavbarCustom";
import Footer from "./components/Footer";

export default function Home() {
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarCustom />
      <div className="flex-grow-1">
        <div className="flex justify-center">
          <Card className="w-full h-[300px] bg-[#4b94de] rounded-none px-12">
          <h5 className="text-4xl font-bold tracking-tight text-white">
          Digitise Handwritten Input — Fast, Accurate, and Reliable
          </h5>
          <p className="font-normal text-gray-200">
          Whether it’s notes, forms, or labels — extract handwritten characters (A–Z, a–z, 0–9) in seconds.
    Designed for real-world handwriting with built-in error reporting and continuous AI improvement.
            </p>
          <Link href={'/auth/login'} className="w-fit">
            <Button className="w-fit">
              Login
              <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Link>  
        </Card>
        </div>
        <Tabs className="mt-3 px-10" aria-label="Default tabs" variant="default" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
        <TabItem title="About" className="text-blue-950 font-bold" icon={FcAbout}>
            <div className="flex flex-col gap-4">
              <p className="text-gray-500">
                Handwriting recognition is a technology that allows computers to read and interpret handwritten text. It has a wide range of applications, including:
              </p>
              <ul className="list-disc pl-5">
                <li>Digitizing handwritten notes and documents.</li>
                <li>Automating data entry tasks.</li>
                <li>Improving accessibility for individuals with disabilities.</li>
              </ul>
            </div>
          </TabItem>
          <TabItem
            active={true}
            title="Features"
            className="text-blue-950 font-bold"
            icon={MdFeaturedPlayList}
          >
            <div className="flex flex-col gap-4">
              <p className="text-gray-500">
                Handwriting recognition is the process of converting handwritten text into machine-readable text. It is a complex task that involves several steps, including:
              </p>
              <ul className="list-disc pl-5">
                <li>Image acquisition: Capturing the handwritten text using a camera or scanner.</li>
                <li>Preprocessing: Enhancing the image quality and removing noise.</li>
                <li>Segmentation: Dividing the image into individual characters or words.</li>
                <li>Feature extraction: Identifying relevant features of the characters.</li>
                <li>Classification: Using machine learning algorithms to recognize the characters.</li>
              </ul>
            </div>
          </TabItem>
          <TabItem title="Contact" className="text-blue-950 font-bold" icon={MdContacts}>
            <div className="flex flex-col gap-4">
              <p className="text-gray-500">
                For any inquiries, please contact us at:
              </p>
              <ul className="list-disc pl-5">
                <li>Email:
                  <a href="mailto:mha210404@gmail.com" className="text-blue-500 hover:underline">
                  </a>
                </li>
                <li>Phone: +62 (852) 461-74935</li>
                </ul>
              <p className="text-gray-500">
                We are here to help you with any questions or concerns you may have.
              </p>
            </div>
          </TabItem>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
