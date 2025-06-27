import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#88b3de] text-white py-4">
            {/* <div className="flex justify-center mt-10">
                <Image src="/icon-removebg-preview.png" alt="Logo" width={100} height={100} />
            </div> */}
            <div className="container mx-auto text-center">
                <p className="text-sm">© 2025 Handwritten OCR. All rights reserved.</p>
                <p className="text-sm">Made with ❤️ by Muhammad Henry Aditya</p>
            </div>
        </footer>
    )
}