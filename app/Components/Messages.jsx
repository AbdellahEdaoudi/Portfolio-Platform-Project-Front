import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BsEmojiSmile } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import io from "socket.io-client";
import { EllipsisVertical} from "lucide-react";
import { MyContext } from "../Context/MyContext";
import { useRouter } from "next/navigation";
import { CustomLinkify } from "./CustomLinkify";
import InputLoadMessages from "./Loading/InputLoadMessages";
import LMessages from "./Loading/LoadChatPage/LMessages";

function Messages({ selectedUser }) {
  const {toast} = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingu, setLoadingu] = useState(false);
  const [loadingd, setLoadingd] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [umessage, setUMessage] = useState("");
  const [emoji, setEmoji] = useState(true);
  const [putdelete, setputdelete] = useState(true);
  const [idMsg, setIdMsg] = useState("");
  const messagesEndRef = useRef(null);
  const lod = Array.from({ length: 20 }, (_, index) => index + 1);
  const {SERVER_URL,SERVER_URL_V,userDetails,EmailUser} = useContext(MyContext);  
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const filtUser = userDetails.find((fl)=>fl.email === EmailUser)
  const router = useRouter();

  // Get Messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(`${SERVER_URL_V}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [SERVER_URL_V]);
  // socket
  useEffect(() => {
    const socket = io(SERVER_URL);
    setSocket(socket);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    socket.on("receiveUpdatedMessage", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });
    socket.on("receiveDeletedMessage", (deletedMessageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== deletedMessageId)
      );
    });

    socket.on('receiveFriendRequest', (newRequest) => {
      setFriendRequests(prevRequests => [...prevRequests, newRequest]);
    });

    socket.on('receiveUpdatedFriendRequest', (updatedRequest) => {
      setFriendRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
    });

    socket.on('receiveDeletedFriendRequest', (deletedRequestId) => {
      setFriendRequests(prevRequests =>
        prevRequests.filter(request => request._id !== deletedRequestId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [SERVER_URL]);
  
  // GetFriendRequest
  useEffect(() => {
  const GetFriendRequest = async () => {
    try {
      const response = await axios.get(`${SERVER_URL_V}/friend`);
      setFriendRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching friend requests', error.response ? error.response.data : error.message);
    }
  };
    GetFriendRequest();
  }, [SERVER_URL_V]);


  useEffect(() => {
    if (selectedUser) {
      setputdelete(true)
    }
  }, [selectedUser]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages,selectedUser]);
  const addEmoji = (e) => {
    const sym = e.unified.split("-");
    const codeArray = sym.map((el) => "0x" + el);
    const emoji = String.fromCodePoint(...codeArray);
    if (putdelete) {
      setMessageInput(messageInput + emoji);
    } else {
      setUMessage(umessage + emoji);
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    
    try {
      const data = {
        from: EmailUser,
        fromimg: filtUser.urlimage,
        fromname:filtUser.username,
        to: selectedUser.email,
        toimg: selectedUser.urlimage,
        message: messageInput,
        readorno : false
      };
      const response = await axios.post(`${SERVER_URL}/messages`, data);
      socket.emit("sendMessage", response.data);
      toast({ description: "Your message has been sent." });
      setMessageInput("");
      setEmoji(true);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteMsg = async () => {
    setLoadingd(true);
    try {
      if (!window.confirm("Are you sure you want to delete this message?")) {
        return;
      }
      await axios.delete(`${SERVER_URL}/messages/${idMsg}`);
      socket.emit("deleteMessage", idMsg);
      setputdelete(true);
      setEmoji(true);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        description: "Error deleting message. Please try again later.",
        status: "error",
      });
    } finally {
      setLoadingd(false);
    }
  };
  const updateMsg = async () => {
    setLoadingu(true);
    try {
      const MsgUpdat = messages.find((msg) => msg._id === idMsg);
      const updatedMessage = {
        from: MsgUpdat.from,
        fromimg: MsgUpdat.fromimg,
        to: MsgUpdat.to,
        toimg: MsgUpdat.toimg,
        message: umessage,
        updated: "edited",
        readorno : false
      };
      const response = await axios.put(
        `${SERVER_URL}/messages/${idMsg}`,
        updatedMessage
      );
      socket.emit("updateMessage", response.data);
      setputdelete(true);
      setEmoji(true);
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        description: "Error updating message. Please try again later.",
        status: "error",
      });
    } finally {
      setLoadingu(false);
    }
  };
  
  if (!friendRequests || !EmailUser || !messages) {
    return <LMessages />;
  }
  const FilterMessages = messages.filter((fl) => {
    return (
      (fl.from === EmailUser &&
        fl.to === selectedUser?.email) ||
      (fl.from === selectedUser?.email &&
        fl.to === EmailUser)
    );
  })
  const emailuser =selectedUser?.email
  const CheckFrirnd = friendRequests.find((f) =>
    (f.from === EmailUser && f.to === emailuser) ||
    (f.from === emailuser && f.to === EmailUser)
  );
  const CopiedMessages = (e,message) => {
    e.preventDefault();
    navigator.clipboard.writeText(message).then(() => {
      toast("Message copied!"); 
    });
  };

  return (
    <div>
      {/* Message window on the right */}
      <div className={` flex flex-col justify-between md:w-auto w-screen `}>
       {/* selectedUser And  Messages */}
        <div className="flex-1 p-2 ">
          {/* selectedUser */}
          <div className="mb-2 bg-slate-200 py-1 rounded-lg px-4">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/${selectedUser.username}`}
                  className="cursor-pointer hover:scale-105 duration-300 flex gap-2 items-center"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                   <Image
                     width={96}  // 24 * 4
                     height={96} // 24 * 4
                     src={selectedUser.urlimage}
                     alt="Profile Image"
                     className="object-cover"
                   />
                   </div>
                  <p className="font-bold">{selectedUser.fullname }</p>
                </Link>
                <p className="font-bold md:block hidden">
                  {selectedUser.email}
                </p>
                <p className="font-bold md:block hidden">
                  {selectedUser.phoneNumber}
                </p>
              </div>
          </div>
          {/* Messages */}
          <div>
            {CheckFrirnd && CheckFrirnd.status === "pending" ? (
               <div>
                <div className="flex items-start pt-16 justify-center h-[350px] rounded-md bg-yellow-100">
               <div className="text-center border border-yellow-500 p-8 bg-white shadow-lg rounded-md">
                 <h1 className="text-yellow-700 font-bold text-2xl mb-4">Pending Friend Request</h1>
                 <p className="text-yellow-600 text-lg">The friend request has not been accepted yet.</p>
               </div>
             </div>
             <InputLoadMessages />
               </div>
            ): !CheckFrirnd && EmailUser !== emailuser ? (
              <div>
                <div className="flex items-start pt-16 justify-center h-[350px] rounded-md bg-red-100">
                  <div className="text-center border border-red-500 p-8 bg-white shadow-lg rounded-md">
                    <h1 className="text-red-700 font-bold text-2xl mb-4">Cannot Communicate</h1>
                    <p className="text-red-600 text-lg">You cannot communicate with someone who is not your friend.</p>
                  </div>
                </div>
                <InputLoadMessages />
              </div>
            ):
            <div>
            <div className="bg-gray-100 p-4 rounded-lg  shadow-lg h-[600px] duration-300
              md:h-[350px] scrollbar-none overflow-y-auto" ref={messagesEndRef}>
            {FilterMessages.length === 0 ? (
              <div className="flex items-center justify-center h-64   rounded-lg">
              <div className="text-center p-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No Messages
                </h2>
                <p className="text-gray-500">
                  You don't have any messages yet.
                </p>
              </div>
            </div>
            ) : (
              FilterMessages
                .map((msg, i) => {
                  const DateMsg = new Date(msg.createdAt);
                  const DateUpdMsg = new Date(msg.updatedAt);
                  const DateToday = new Date();
                  const filtUser = userDetails.find(
                    (fl) => fl.email === msg.from
                  );
                  // Date Message
                  const year = DateMsg.getFullYear();
                  const month = String(DateMsg.getMonth() + 1).padStart(2, "0"); 
                  const day = String(DateMsg.getDate()).padStart(2, "0");
                  const DateAll = `${year}/${month}/${day}`;
                  // Date Today
                  const yeart = DateToday.getFullYear();
                  const montht = String(DateToday.getMonth() + 1).padStart(2, "0"); 
                  const dayt = String(DateToday.getDate()).padStart(2, "0");
                  const TodayDate = `${yeart}/${montht}/${dayt}`;
                  // Date Yesterday
                  const yeary = DateToday.getFullYear();
                  const monthy = String(DateToday.getMonth() + 1).padStart(2, "0"); 
                  const dayy = String(DateToday.getDate() -1).padStart(2, "0");
                  const YesterdayDate  = `${yeary}/${monthy}/${dayy}`;

                  // UPDATED MESSAGE DATE
                  const yearu = DateUpdMsg.getFullYear();
                  const monthu = String(DateUpdMsg.getMonth() + 1).padStart(2, "0"); 
                  const dayu = String(DateUpdMsg.getDate()).padStart(2, "0");
                  const UpdateDate = `${yearu}/${monthu}/${dayu}`;

                  return (
                    <div key={i}>
                        <div
                          className={`${
                            (msg.from || msg.to) === EmailUser
                              ? "flex items-center flex-row-reverse gap-2"
                              : "flex items-center  gap-2"
                          }`}
                        >
                          {/* Profile */}
                          <div  
                            className="flex-shrink-0"
                            onClick={()=>router.push(`/${filtUser?.username}`)}
                          >
                            <Image alt="Logo"
                              src={msg.fromimg}
                              width={40} height={40}
                              className=" hover:scale-105 cursor-pointer  duration-300 rounded-full"
                            />
                          </div>
                          {/* Msg */}
                          <div
                           onContextMenu={(e) => CopiedMessages(e, msg.message)}
                            className={`whitespace-pre-wrap break-all overflow-y-auto max-h-44  ${
                              (msg.from || msg.to) === EmailUser
                                ? "bg-gradient-to-r from-sky-400 to-blue-500"
                                : "bg-gradient-to-r from-green-400 to-teal-500"
                            } p-2  rounded-md `}
                          >
                            <CustomLinkify message={msg.message} />
                            
                          </div>
                          {/* Icon 3 point */}
                          <div
                            onClick={() => {
                              setUMessage(msg.message);
                              setputdelete(!putdelete);
                              setIdMsg(msg._id);
                            }}
                            className={`cursor-pointer
                          ${
                            (msg.from || msg.to) === EmailUser
                              ? "block"
                              : "hidden"
                          }`}
                          >
                            <EllipsisVertical width={18} />
                          </div>
                        </div>
                        {/* msg.updated */}
                      <div
                        className={`
                          ${
                            (msg.from || msg.to) === EmailUser
                              ? "text-right text-[10px] flex justify-end mr-14"
                              : "text-left  text-[10px] flex justify-start ml-14"
                          }`}
                      >
                        {msg.updated}
                        {/* {msg.updated && `,${msg.updated && UpdateDate},${DateUpdMsg.toLocaleTimeString()}`} */}
                      </div>
                      {/* DateMsg */}
                      <div
                        className={` flex gap-2 mb-1  ${
                          (msg.from || msg.to) === EmailUser
                            ? "justify-end mr-14 "
                            : " ml-14"
                        }  text-sm`}
                      >
                        <p className=" text-gray-700">{`${DateAll === TodayDate ? "Today," : DateAll === YesterdayDate  ? "Yesterday," : DateAll }`}</p>
                        <p className=" text-gray-900">
                          {DateMsg.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
          {/* Input Messgage */}
          <div className={`bg-gray-200 p-2 mt-2 rounded-md
                ${putdelete ? "block" : "hidden"}`}>
            <div className="flex items-center gap-4 pr-2 ">
              <textarea
                type="text"
                placeholder="Enter your message here..."
                value={messageInput}
                maxLength={999}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                }}
                className="flex-1 border-2 bg-white  border-gray-300 rounded-lg p-2  focus:outline-none transition duration-300"
              />
              <Button
                onClick={() => {
                  sendMessage();
                  setEmoji(emoji);
                }}
                disabled={loading || messageInput === ""}
                className="bg-indigo-600  text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                {loading ? <i className="fa fa-spinner fa-spin"></i> : "Send"}
              </Button>
              <div
                onClick={() => {
                  setEmoji(!emoji);
                }}
                className="cursor-pointer text-2xl"
              >
                <BsEmojiSmile />
              </div>
            </div>
          </div>
          {/* Input Messgage update Or Delete */}
          <div className={`bg-gray-200 p-2 mt-2 rounded-md
                ${putdelete ? "hidden" : "block"}`}>
            <div className="flex items-center gap-4 pr-2 ">
              <textarea
                type="text"
                placeholder="Enter your message here..."
                value={umessage}
                maxLength={999}
                onChange={(e) => {
                  setUMessage(e.target.value);
                }}
                className="flex-1 border-2 bg-white  border-gray-300 rounded-lg p-2  focus:outline-none transition duration-300"
              />
              <button
                onClick={updateMsg}
                className="bg-green-600 p-2 rounded-md  text-white hover:bg-green-600 hover:scale-105 duration-500"
              >
                <>
                  {loadingu ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    "Update"
                  )}
                </>
              </button>
              <button
                onClick={deleteMsg}
                className="bg-red-600 p-2 rounded-md  text-white hover:bg-red-600 hover:scale-105 duration-500"
              >
                <>
                  {loadingd ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    "Delete"
                  )}
                </>
              </button>
              <div
                onClick={() => {
                  setEmoji(!emoji);
                }}
                className="cursor-pointer text-2xl"
              >
                <BsEmojiSmile />
              </div>
            </div>
          </div>
          </div>
            }
          </div>
        </div>
        {/* Emojes */}
        <div className={` absolute right-4 ${emoji ? "hidden" : "block"}`}>
          <Picker data={data} onEmojiSelect={addEmoji} maxFrequentRows={0} />
        </div>
      </div>
    </div>
  );
}

export default Messages;
