/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { db } from "@/configs/db";
import { CourseList } from "@/schema/schema";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import { generateCourseContent } from "./_utils/generateCourseContent";
import LoadingDialog from "../_components/LoadingDialog";
import { CourseType } from "@/types/types";

type ParamsType = {
  courseId: string;
};

const CoursePageLayout = ({ params }: { params: ParamsType }) => {
  const { user } = useUser();
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (params?.courseId && user) {
      getCourse(params.courseId);  // Ensure we are using the latest courseId from params
    }
  }, [params, user]);  // Make sure to only call when `params` or `user` changes

  const getCourse = async (courseId: string) => {
    try {
      const res = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, courseId),
            eq(CourseList.createdBy, user?.primaryEmailAddress?.emailAddress ?? "")
          )
        );

      setCourse(res[0] as CourseType);  // Update course state after fetching
    } catch (error) {
      console.log("Error fetching course", error);
    }
  };

  const handleGenerateCourseContent = async () => {
    if (!course) return;

    try {
      await generateCourseContent(course, setLoading);
      await db
        .update(CourseList)
        .set({ isPublished: true })
        .where(eq(CourseList.courseId, params.courseId));
      router.replace(`/create-course/${params.courseId}/finish`);
    } catch (error) {
      console.log("Error generating course content", error);
    }
  };

  if (!course) return null;

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>
      <LoadingDialog loading={loading} />
      <CourseBasicInfo courseInfo={course} onRefresh={() => getCourse(params.courseId)} />
      <CourseDetail courseDetail={course} />
      <ChapterList course={course} onRefresh={() => getCourse(params.courseId)} />
      <Button className="my-10" onClick={handleGenerateCourseContent}>
        Generate Course Content
      </Button>
    </div>
  );
};

export default CoursePageLayout;
