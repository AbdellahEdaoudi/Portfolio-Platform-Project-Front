"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Link,
  Mail,
  MailCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
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
import { MyContext } from "../Context/MyContext";
import UserLinks from "./UserLinks";
import Loadingpage from "../Components/Loading/LoadingPage";
import FriendRequest from "./FriendRequest";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInComponents from "../Components/SignIn/SignInComponents";
import QrcodeProfile from "./QrcodeProfile";
import { languagess } from "../data/language";
import LoadingPagetranslate from "../Components/Loading/LoadingPagetranslate";
import { useSession } from "next-auth/react";

function GetUserByUsername({ params }) {
  const { data, status } = useSession();
  const path = usePathname();
  const router = useRouter();
  const [userDetailsG, setUserDetailsG] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const {CLIENT_URL,SERVER_URL_V,userLinks,EmailUser}=useContext(MyContext);
  const [translatedDetails, setTranslatedDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [language, setLanguage] = useState('');
  
  const CopyLinkProfil = () => {
    const urlToCopy = `${CLIENT_URL}/${path}`;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true);
      toast("Copied successfully");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Translate content
  const translateContent = async (content, lang) => {
    try {
      const response = await axios.post(`${SERVER_URL_V}/translate`, {
        textObject: content,
        to: lang
      });
      setTranslatedDetails(response.data.translations);
    } catch (error) {
      console.error('Error translating content:', error);
    }
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_URL_V}/user/${params.username}`);
        setUserDetailsG(response.data);
        await translateContent({
          Profile : "Profile",
          Services : "Services",
          Education : "Education",
          Experience : "Experience",
          Skills : "Skills",
          Languages : "Languages",
          bio: response.data.bio,
          bio: response.data.bio,
          services: response.data.services,
          education: response.data.education,
          skills: response.data.skills,
          languages: response.data.languages,
          experience: response.data.experience,
          country: response.data.country,
          category: response.data.category
        }, language);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false); // Set loading false after fetching
      }
    };
    fetchUserDetails();
  }, [SERVER_URL_V, language]);

  if (error) {
    return (
      <div className="flex items-start pt-28 justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">
            Account not found
          </h1>
          <p className="text-gray-600 text-lg">
            Sorry, we couldn't find the account you were looking for.
          </p>
        </div>
      </div>
    );
  }

  if (!userDetailsG ) {
    return (
      <div>
        <Loadingpage />
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <LoadingPagetranslate language={language} bgcolorp={userDetailsG.bgcolorp} />
      </div>
    );
  }
  const datasocial = [
    {
      id: 1,
      icon: "/Icons/wts.svg",
      alt: "WhatsApp",
      link: userDetailsG.whatsapp,
    },
    {
      id: 8,
      icon: "/Icons/link.svg",
      alt: "LinkedIn",
      link: userDetailsG.Linkedin,
    },
    {
      id: 9,
      icon: "/Icons/github.svg",
      alt: "GitHub",
      link: userDetailsG.github,
    },
    {
      id: 11,
      icon: "/Icons/tele.svg",
      alt: "Telegram",
      link: userDetailsG.Telegram,
    },
    {
      id: 2,
      icon: "/Icons/messenger.svg",
      alt: "Messenger",
      link: userDetailsG.messenger,
    },
    {
      id: 6,
      icon: "/Icons/ins.svg",
      alt: "Instagram",
      link: userDetailsG.instagram,
    },
    {
      id: 7,
      icon: "/Icons/twit.svg",
      alt: "Twitter",
      link: userDetailsG.Twitter,
    },
    {
      id: 10,
      icon: "/Icons/yt.svg",
      alt: "YouTube",
      link: userDetailsG.Youtube,
    },
    {
      id: 3,
      icon: "/Icons/reddit.svg",
      alt: "Reddit",
      link: userDetailsG.reddit,
    },
    {
      id: 4,
      icon: "/Icons/twitch.svg",
      alt: "Twitch",
      link: userDetailsG.twitch,
    },
    { id: 5, icon: "/Icons/fb.svg", alt: "Facebook", link: userDetailsG.fb },
    {
      id: 12,
      icon: "/Icons/snap.svg",
      alt: "Snapchat",
      link: userDetailsG.snapchat,
    },
  ];
  const datamodul = [
    {
      name: translatedDetails 
        ? `🔷 ${translatedDetails.Profile}` 
        : "🔷 Profile",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Profile} 🔷` : `🔷 ${translatedDetails.Profile}`}` 
        : "🔷 Profile",
      data: translatedDetails && translatedDetails.bio ? translatedDetails.bio : userDetailsG.bio
    },
    {
      name: translatedDetails 
        ? `💼 ${translatedDetails.Services}` 
        : "💼 Services",
       namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Services} 💼` : `💼 ${translatedDetails.Services}`}` 
        : "💼 Services",
      data: translatedDetails && translatedDetails.services ? translatedDetails.services : userDetailsG.services
    },
    {
      name: translatedDetails 
        ? `🎓 ${translatedDetails.Education}` 
        : "🎓 Education",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Education} 🎓` : `🎓 ${translatedDetails.Education}`}` 
        : "🎓 Education",
      data: translatedDetails && translatedDetails.education ? translatedDetails.education : userDetailsG.education
    },
    {
      name: translatedDetails 
        ? `⭐ ${translatedDetails.Experience}` 
        : "⭐ Experience",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Experience} ⭐` : `⭐ ${translatedDetails.Experience}`}` 
        : "⭐ Experience",
      data: translatedDetails && translatedDetails.experience ? translatedDetails.experience : userDetailsG.experience
    },
    {
      name: translatedDetails 
        ? `💡 ${translatedDetails.Skills}` 
        : "💡 Skills",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Skills} 💡` : `💡 ${translatedDetails.Skills}`}` 
        : "💡 Skills",
      data: translatedDetails && translatedDetails.skills ? translatedDetails.skills : userDetailsG.skills
    },
    {
      name: translatedDetails 
        ? `🌍 ${translatedDetails.Languages}` 
        : "🌍 Languages",
        namedata: translatedDetails 
        ? `${language === "ar" ? `${translatedDetails.Languages} 🌍` : `🌍 ${translatedDetails.Languages}`}` 
        : "🌍 Languages",
      data: translatedDetails && translatedDetails.languages ? translatedDetails.languages : userDetailsG.languages
    }
  ];
  
  
  
  const ListDisk = ( data ) => {
    return (
      <ul className={`list-disc ml-1 ${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'}`}>
        {data.split("\n").map((item, i) => (
          <li key={i} className="text-base leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  };
  const emailuser = userDetailsG.email;

  const CV = [
    {
      title: `${translatedDetails ? `🔷 ${translatedDetails.Profile}` : "🔷 Profile"}`,
      content: translatedDetails && translatedDetails.bio ? translatedDetails.bio : userDetailsG.bio,
      key: translatedDetails ? translatedDetails.bioKey || 'bio' : 'bio'
    },
    {
      title: `${translatedDetails ? `💼 ${translatedDetails.Services}` : "💼 Services"}`,
      content: translatedDetails && translatedDetails.services ? translatedDetails.services : userDetailsG.services,
      key: translatedDetails ? translatedDetails.servicesKey || 'services' : 'services'
    },
    {
      title: `${translatedDetails ? `🎓 ${translatedDetails.Education}` : "🎓 Education"}`,
      content: translatedDetails && translatedDetails.education ? translatedDetails.education : userDetailsG.education,
      key: translatedDetails ? translatedDetails.educationKey || 'education' : 'education'
    },
    {
      title: `${translatedDetails ? `⭐ ${translatedDetails.Experience}` : "⭐ Experience"}`,
      content: translatedDetails && translatedDetails.experience ? translatedDetails.experience : userDetailsG.experience,
      key: translatedDetails ? translatedDetails.experienceKey || 'experience' : 'experience'
    },
    {
      title: `${translatedDetails ? `💡 ${translatedDetails.Skills}` : "💡 Skills"}`,
      content: translatedDetails && translatedDetails.skills ? translatedDetails.skills : userDetailsG.skills,
      key: translatedDetails ? translatedDetails.skillsKey || 'skills' : 'skills'
    },
    {
      title: `${translatedDetails ? `🌍 ${translatedDetails.Languages}` : "🌍 Languages"}`,
      content: translatedDetails && translatedDetails.languages ? translatedDetails.languages : userDetailsG.languages,
      key: translatedDetails ? translatedDetails.languagesKey || 'languages' : 'languages'
    }
  ];
  
  return (
    <div
      className={`  flex items-start justify-center   pt-4 pb-96 ${userDetailsG.bgcolorp}`}
    >
      <div className="w-[800px] mx-4 relative  bg-slate-50 px-4 md:px-8 pt-4 pb-8 rounded-lg border-2 shadow-lg">
        {/* Image Profile and info user */}
        <div className={`${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'} border flex flex-col md:flex-row md:items-start items-center mb-4 p-4 bg-white rounded-lg shadow-md`}>
          <div className={`${language === "ar" ? 'ml-4' : ''}`}>
            <AlertDialog>
              <AlertDialogTrigger>
                {!userDetailsG.urlimage ? (
                  <div
                    width={140}
                    height={0}
                    src={"/prifil Loading.png"}
                    alt="Profile Image"
                    className="object-cover bg-gray-300 animate-pulse w-32 h-32  cursor-pointer"
                  />
                ) : (
                  <div className="border-4  border-green-600 shadow-lg  rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 duration-500">
                    <Image
                      width={136}
                      height={0}
                      src={userDetailsG.urlimage}
                      alt="Profile Image"
                      className="object-cover cursor-pointer"
                    />
                  </div>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogDescription className="flex justify-center">
                    <Image
                      width={400}
                      height={400}
                      src={userDetailsG.urlimage}
                      alt="Profile Image"
                      className="object-cover rounded-full cursor-pointer"
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 duration-300 hover:scale-105">
                    Cancel
                  </AlertDialogCancel>
                  {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-bold text-2xl text-gray-800">
              {userDetailsG.fullname}
            </h2>
            <p className={`${language === "ar" && "list-disc-ltr"} text-gray-600 flex md:flex-row flex-col items-center gap-2 md:justify-start justify-center   md:gap-2 mt-1`}>
              <span className={`flex gap-1 ${language === "ar" ? 'flex-row-reverse' : 'flex-row'} text-green-900`}>
                <span>@</span>
                <span>{userDetailsG.username}</span>
              </span>
              {userDetailsG.country && (
                <span className={`flex ${language === "ar" ? 'flex-row-reverse' : 'flex-row'}  flex-row gap-1 justify-center`}>
                  <MapPin width={18} style={{ color: "red" }} />
                  {`${translatedDetails ? translatedDetails.country : userDetailsG.country}`}
                </span>
              )}
            </p>
            {userDetailsG.phoneNumber && (
              <p className={`${language === "ar" && "list-disc-ltr"} text-gray-600 flex ${language === "ar" ? 'flex-row-reverse' : 'flex-row'} items-center justify-center md:justify-start gap-2 mt-1`}>
                <Phone width={18} style={{ color: "green" }} />
                {userDetailsG.phoneNumber}
              </p>
            )}

            {/* Business Links */}
            <p className={`${language === "ar" && "text-right"}`}>
              <UserLinks language={language} setLanguage={setLanguage} emailuser={emailuser} />
            </p>
            {/* Social Media */}
            <div className="flex flex-wrap gap-4 justify-center my-2 ">
              {datasocial
                .filter((social) => social.link)
                .map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex hover:scale-105 items-center justify-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md shadow-md transition duration-300"
                  >
                    <Image
                      src={social.icon}
                      alt={social.alt}
                      width={24}
                      height={24}
                    />
                    {/* <span className="ml-2 text-gray-800 font-medium">{social.alt}</span> */}
                  </a>
                ))}
            </div>
            {/* className={`${userDetails.phoneNumber ? "text-blue-700" : "md:block hidden md:text-white"}`} */}
            {/* className={`${userDetails.country ? "text-red-700" : " md:block hidden md:text-white"}`} */}
          </div>
        </div>
        {/* Setting  */}
        <nav className={`${language === "ar" ? 'list-disc-rtl md:left-24 left-7 top-10' : 'list-disc-ltr md:right-24 right-7 top-10'} grid grid-cols-1 md:grid-cols-2 absolute  md:gap-5 duration-300 gap-4`}>
          {/* CopyLinkProfil */}
          <button
            className="rounded-full hover:scale-110 flex justify-center hover:bg-gray-200 border h-10 w-10 p-2  duration-300"
            onClick={CopyLinkProfil}
            title="Copy link"
          >
            {copied ? <p className="text-[14px]">Copied!</p> : <Link />} <br />
          </button>
          {/* Modal Qr and Link */}
          <QrcodeProfile userDetailsG={userDetailsG} />
          {/* Email User */}
          <span className="flex gap-2 border p-2 rounded-full w-10 cursor-pointer hover:text-red-700 hover:scale-110 duration-200  ">
            <a
              className="hover:scale-105 duration-500 hover:text-green-700"
              href={`mailto:${userDetailsG.email}`}
            >
              <Mail width={23} />
            </a>
          </span>
          {/* messageTo */}
          {status === "authenticated" && (
            <FriendRequest
              userDetailsG={userDetailsG}
              emailuser={emailuser}
              path={path}
            />
          )}
          {status === "unauthenticated" && (
            <SignInComponents userDetailsG={userDetailsG} />
          )}
          {/* translate */}
          <div className="absolute  md:top-[113px] top-[220px] md:-right-1  w-full ">
          <select
             className='bg-white  border  cursor-pointer border-gray-300 rounded-md  mb-6 w-full'
             value={language}
             onChange={(e)=>{setLanguage(e.target.value);}}
           >
             {languagess.map((lang) => (
             <option className="text-center"  key={lang.value} value={lang.value}>
               {lang.label}
             </option>
           ))}
           </select>
          </div>
        </nav>
        {/* Category */}
        <p className="text-base font-semibold text-center text-gray-800 bg-gray-100 p-2 my-2 rounded border border-gray-300">
        {`${translatedDetails ? translatedDetails.category : userDetailsG.category}`}
        </p>
        {/* Modul */}
        <div className={` ${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'} flex flex-wrap gap-2 mb-2 justify-center`}>
          {datamodul.map((dt, i) => {
            return (
              <div key={i}>
                <AlertDialog>
                  <AlertDialogTrigger
                    className={`p-2 ${
                      !dt.data && "hidden"
                    } bg-slate-100  hover:bg-slate-200 hover:scale-105 duration-300 rounded-lg border-2`}
                  >
                    {dt.name}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={` bg-gray-200  p-2 border rounded-md`}>
                        <div className={`${language === "ar" && "text-right pr-1 "}`}>{dt.namedata}</div>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="overflow-y-auto max-h-96 bg-sky-50  p-4 duration-300 rounded-sm border text-black whitespace-break-spaces text-start">
                        {ListDisk(dt.data)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 duration-300">
                        Cancel
                      </AlertDialogCancel>
                      {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
         {/* CV */}
        <div className="mt-3">
        {CV.map(({ title, content, key }) =>
            content && (
              <div key={key} className="border p-4 text-right!? bg-white rounded-lg shadow-md mb-4 hover:scale-100 duration-500">
                <h3 className={` ${language === "ar" ? 'list-disc-rtl' : 'list-disc-ltr'} text-xl font-semibold text-indigo-600 mb-2`}>{title}</h3>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{ListDisk(content)}</p>
              </div>
            )
          )}
        </div>

        
      </div>
    </div>
  );
}

export default GetUserByUsername;
