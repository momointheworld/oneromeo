'use client';
import  { useSession } from "next-auth/react";
import SignOut from "./signout";
import SignIn from "./signin";

export default function Profile() {
    const session = useSession();
    if(session.data?.user) {
        return (
            <div className="flex flex-column">
            <div>{session.data.user.name} is signed in. <SignOut />
            </div>
            </div>
        ) 
    } 
    return (
        <div>
        <SignIn />
        </div>
    )
}