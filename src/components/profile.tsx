'use client';
import  { useSession } from "next-auth/react";
import SignOut from "./signout";
import SignIn from "./signin";
import Link from "next/link";
import paths from "@/components/paths";
import { Chip } from "@nextui-org/react";

export default function Profile() {
    const session = useSession();
    let authContent: React.ReactNode
    if (session.status === "loading") {
      authContent = null
    } else if(session.data?.user) {
      authContent = (
        <div>
            <div className="flex flex-row items-center">
                <SignOut />
                <div className="flex flex-row items-center">
                <Link href={paths.dashboard()}><Chip color='primary'>Go to Dashboard</Chip></Link>
            </div>
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