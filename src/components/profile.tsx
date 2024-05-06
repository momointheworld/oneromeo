'use client';
import  { useSession } from "next-auth/react";
import SignOut from "./signout";
import SignIn from "./signin";

export default function Profile() {
    const session = useSession();
    let authContent: React.ReactNode
    if (session.status === "loading") {
      authContent = null
    } else if(session.data?.user) {
      authContent = (
        <div>
            <div className="flex flex-row items-center">
                <div className="mx-3 text-orange-800">Welcome, {session.data.user.name}</div>
                <SignOut />
            </div>
        </div> )
    } else {
      authContent = (
        <div>
          <SignIn />
        </div>
      )
    }
    return  authContent;
    }