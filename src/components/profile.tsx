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
                <SignOut />
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