import React, { useContext } from "react";
import { MyContext } from "../Context/MyContext";
import { Link } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

function EditUserLinks() {
  const {userLinks,EmailUser } = useContext(MyContext);

  return (
    <AlertDialog className="bg-black">
      <AlertDialogTrigger>
        <p className="text-blue-900 hover:cursor-pointer flex items-center justify-center md:justify-start gap-2 mt-1">
          <Link width={18} />
          Business Links
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>
            {/* UserLinks */}
            <section className=" p-4  rounded-lg  text-black">
              <h1 className="text-3xl font-semibold  text-center text-gray-800 mb-4">
                Links
              </h1>
              <div className="p-2 space-y-3 overflow-y-auto scrollbar-non max-h-96">
                {userLinks
                  .filter((fl) => fl.useremail === EmailUser)
                  .map((lnk, i) => (
                    <a
                      href={lnk.link}
                      target="_blank"
                      key={i}
                      className=" flex border-black shadow-md  duration-300 hover:bg-gray-100 pl-4 items-center gap-4 border rounded-lg p-1 "
                    >
                      <p className="p-2  border border-black rounded-full">
                        <Link />
                      </p>
                      <p className="whitespace-nowrap">{lnk.namelink}</p>
                    </a>
                  ))}
              </div>
            </section>
            {/* UserLinks */}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditUserLinks;
