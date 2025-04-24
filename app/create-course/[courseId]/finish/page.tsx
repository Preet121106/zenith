"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/configs/db";
import { CourseList } from "@/schema/schema";
import { and, eq } from "drizzle-orm";

import CourseBasicInfo from "../_components/CourseBasicInfo";
import { BaseEnvironment } from "@/configs/BaseEnvironment";
import { IoCopyOutline } from "react-icons/io5";
import { CourseType } from "@/types/types";
import Link from "next/link";

type FinishScreenProps = {
  params: {
    courseId: string;
  };
};

const FinishScreen = ({ params }: FinishScreenProps) => {
  const { user, isLoaded } = useUser();
  const [course, setCourse] = useState<CourseType | null>(null);

  const router = useRouter();
  const { HOST_URL } = new BaseEnvironment();
  const COURSE_LINK = `${HOST_URL}/course/${course?.courseId}/start`;

  useEffect(() => {
    if (isLoaded && params.courseId && user) {
      getCourse();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.courseId, user, isLoaded]);

  const getCourse = async () => {
    try {
      const res = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, params.courseId),
            eq(
              CourseList.createdBy,
              user?.primaryEmailAddress?.emailAddress ?? ""
            )
          )
        );

      if (res.length > 0) {
        setCourse(res[0] as CourseType);
      } else {
        console.warn("No course found or unauthorized access.");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error fetching course", err);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">
      <h2 className="text-center font-bold text-2xl my-3 text-primary">
        🎉 Congrats! Your course is Ready
      </h2>

      {course && (
        <CourseBasicInfo
          courseInfo={course}
          onRefresh={() => console.log("Refreshing")}
        />
      )}

      <h2 className="mt-3">Course URL</h2>
      <h2 className="text-center font-bold text-gray-400 border p-2 rounded flex gap-5 items-center justify-center">
        <Link
          href={COURSE_LINK}
          className="cursor-pointer hover:text-primary transition-all delay-75"
        >
          {COURSE_LINK}
        </Link>
        <IoCopyOutline
          className="h-5 w-5 cursor-pointer hover:text-primary transition-all delay-75 hover:scale-110"
          onClick={async () => await navigator.clipboard.writeText(COURSE_LINK)}
        />
      </h2>
    </div>
  );
};

export default FinishScreen;
