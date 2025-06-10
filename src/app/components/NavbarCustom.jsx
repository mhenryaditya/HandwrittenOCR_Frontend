import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function NavbarCustom({ data }) {
    return (
        <Navbar className="bg-[#C5DEFC] shadow-md sticky top-0 flex justify-around" >
            <Link href={'/'}>
                <NavbarBrand>
                    <img src="/icon-removebg-preview.png" className="mr-3 h-12 sm:h-10" alt="Flowbite React Logo" />
                </NavbarBrand>
            </Link>
            <div className="flex md:order-2">
                <Link href={'/auth/login'}>
                    <Button>Login</Button>
                </Link>
                {/* <NavbarToggle /> */}
            </div>
            {/* <NavbarCollapse>
                <NavbarLink href="#" active>
                Home
                </NavbarLink>
                <NavbarLink href="#">About</NavbarLink>
                <NavbarLink href="#">Services</NavbarLink>
                <NavbarLink href="#">Pricing</NavbarLink>
                <NavbarLink href="#">Contact</NavbarLink>
            </NavbarCollapse> */}
        </Navbar>
    )
}