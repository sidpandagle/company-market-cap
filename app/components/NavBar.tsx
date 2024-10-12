// import { AiFillGitlab } from "react-icons/ai";
import {Button} from "@nextui-org/react";
import DropDown from "~/components/DropDown";

export default function NavBar () {
  return (
    <div>
        <div className="flex items-center justify-between mx-6 my-2">
            <div className="flex items-center gap-2">
                <div className="size-8 bg-slate-900 rounded-xl shadow-lg"></div>
                <h1 className="text-xl font-bold">Company Market Capital</h1>
            </div>
            <div className="flex gap-4 items-center">
                <DropDown />
                <Button isIconOnly variant="shadow" size="md">
                    {/* {dark ? (<img src="sun.svg" alt="Light Mode" className="w-5 h-5" />) : (<img src="moon.svg" alt="Dark Mode" className="w-5 h-5" />)} */}
                    <img src="moon.svg" alt="Dark Mode" className="size-4" />
                </Button>
            </div>
        </div>
    </div>
  )
}


