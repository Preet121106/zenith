// app/course/[courseId]/page.tsx
"use client";

import { use } from "react";
import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
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

type ParamsType = { courseId: string };

export default function CoursePage({ params }: { params: Promise<ParamsType> }) {
  // 1) unwrap the promise
  const { courseId } = use(params);

  // 2) Clerk user
  const { user, isLoaded } = useUser();

  // 3) local state
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // 4) fetch the course once we have user + courseId
  const getCourse = useCallback(
    async (cid: string) => {
      if (!user) return;
      try {
        const res = await db
          .select()
          .from(CourseList)
          .where(
            and(
              eq(CourseList.courseId, cid),
              eq(
                CourseList.createdBy,
                user.primaryEmailAddress?.emailAddress ?? ""
              )
            )
          );
        if (res.length === 0) {
          // no such course or not theirs
          router.push("/dashboard");
          return;
        }
        setCourse(res[0] as CourseType);
      } catch (err) {
        console.error("Error fetching course", err);
      }
    },
    [user, router]
  );

  useEffect(() => {
    if (isLoaded && user && courseId) {
      getCourse(courseId);
    }
  }, [isLoaded, user, courseId, getCourse]);

  // 5) handle generate + publish
  const handleGenerate = useCallback(async () => {
    if (!course) return;
    try {
      await generateCourseContent(course, setLoading);
      await db
        .update(CourseList)
        .set({ isPublished: true })
        .where(eq(CourseList.courseId, courseId));
      router.replace(`/create-course/${courseId}/finish`);
    } catch (err) {
      console.error("Error generating course", err);
    }
  }, [course, courseId, router]);

  // 6) loading fallback
  if (!course) {
    return (
      <div className="mt-10 px-7 md:px-20 lg:px-44">
        <LoadingDialog loading={true} />
        <p className="text-center">Loading course...</p>
      </div>
    );
  }

  // 7) actual UI
  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>
      <LoadingDialog loading={loading} />
      <CourseBasicInfo
        courseInfo={course}
        onRefresh={() => getCourse(courseId)}
      />
      <CourseDetail courseDetail={course} />
      <ChapterList
        course={course}
        onRefresh={() => getCourse(courseId)}
      />
      <Button
        className="my-10"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Course Content"}
      </Button>
    </div>
  );
}
