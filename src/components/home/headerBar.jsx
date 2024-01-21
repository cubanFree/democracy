import Link from "next/link";
import ProfileDesign from "./profileDesign";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BsCoin } from "react-icons/bs";
import { GiBrain } from "react-icons/gi";
import MenuDesign from "./menuDesign";

export default function HeaderBar() {

    const allLinks = [
        {
            name: 'money',
            path: '/home',
            icon: MdOutlineAttachMoney,
            size: 20,
            value: '1,030'
        },
        {
            name: 'simCoins',
            path: '/home',
            icon: BsCoin,
            size: 20,
            value: '30'
        },
        {
            name: 'experience',
            path: '/home',
            icon: GiBrain,
            size: 20,
            value: '14'
        }
    ]

    return (
        <nav className="w-full h-full border-b border-gray-700">
            <ul className="flex h-full justify-between items-center text-md sm:mx-[10%]">
                <li className="p-2">
                    <MenuDesign />
                </li>

                <div className="flex justify-center items-center">
                    {
                        allLinks.map((link, index) => (
                            <li key={index} className="py-1 px-2 hover:bg-gray-800">
                                <Link href={link.path} className="flex justify-center items-center gap-1">
                                    <link.icon size={link.size} />
                                    <strong>{link.value}</strong>
                                </Link>
                            </li>
                        ))
                    }
                    <li className="p-2">
                        <Suspense fallback={<Skeleton className="h-12 w-12 rounded-lg py-2 px-4" />}>
                            <ProfileDesign />
                        </Suspense>
                    </li>
                </div>

            </ul>
        </nav>
    )
}