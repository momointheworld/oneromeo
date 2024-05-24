import React from "react";
import {Card, Skeleton} from "@nextui-org/react";

const FullSkeleton = () => {
  return (
    <div>
          <div className="w-full flex items-center gap-3">
            <div className="w-full flex flex-col gap-2 ">
              <Skeleton className="h-3 w-full rounded-lg"/>
              <Skeleton className="h-3 w-full rounded-lg"/>
              <Skeleton className="h-3 w-full rounded-lg"/>
              <Skeleton className="h-3 w-full rounded-lg"/>
            </div>
          </div>
     </div>
  );
}

const CardSkeleton = () => {
  return(
    <div className="flex justify-center">
      <Card className="w-[200px] space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">  
            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      </Card>
      </div>
    );
}

export { FullSkeleton, CardSkeleton};