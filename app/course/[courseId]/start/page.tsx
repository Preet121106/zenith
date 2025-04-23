/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { db } from "@/configs/db";
import { CourseChapters, CourseList } from "@/schema/schema";
import { ChapterContentType, ChapterType, CourseType } from "@/types/types";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";
import Image from "next/image";
import UserToolTip from "./_components/UserToolTip";
import ScrollProgress from "@/components/ui/scroll-progress";

type CourseStartProps = {
  params: { courseId: string };
};

const CourseStart = ({ params }: CourseStartProps) => {
  const [course, setCourse] = useState<CourseType | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterType | null>(null);
  const [chapterContent, setChapterContent] = useState<ChapterContentType | null>(null);

  // Fetch course data
  const getCourse = async () => {
    try {
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.courseId, params.courseId));
      setCourse(result[0] as CourseType);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch chapter content
  const getChapterContent = async (chapterId: number) => {
    try {
      const res = await db
        .select()
        .from(CourseChapters)
        .where(
          and(
            eq(CourseChapters.chapterId, chapterId),
            eq(CourseChapters.courseId, course!.courseId)
          )
        );
      setChapterContent(res[0] as ChapterContentType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.courseId) getCourse();
  }, [params]);

  if (!course) return <div className="p-10 text-center">Loading course...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed and Scrollable Chapter List */}
      <aside className="fixed hidden md:flex flex-col h-screen w-64 border-r shadow-sm bg-white z-10">
        <h2 className="font-medium text-lg bg-primary p-4 text-white">
          {course.courseOutput.topic}
        </h2>

        <div className="flex-1 overflow-y-auto p-2">
          {course.courseOutput.chapters.map((chapter, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded px-2 py-1 mb-1 transition-colors ${
                selectedChapter?.chapter_name === chapter.chapter_name
                  ? "bg-purple-50"
                  : "hover:bg-purple-100"
              }`}
              onClick={() => {
                setSelectedChapter(chapter);
                getChapterContent(index);
              }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto h-screen">
        {selectedChapter ? (
          <div className="p-5">
            <ChapterContent chapter={selectedChapter} content={chapterContent} />
            <ScrollProgress />
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <Image
              src={course.courseBanner || "/zenith-logo.png"}
              alt={course.courseName || "Zenith"}
              width={350}
              height={200}
              priority
              className="rounded-lg hover:shadow-lg hover:scale-105 transition-transform duration-500 cursor-pointer mt-20"
            />
            <p className="mt-10 text-lg">
              Let&apos;s get started with the course{" "}
              <strong>{course.courseOutput.topic}</strong>.
              Click on the chapters to begin. Enjoy learning!
            </p>
            <div className="mt-10">
              <UserToolTip
                username={course.username || "Zenith"}
                userProfileImage={course.userprofileimage || "/brain-circuit.svg"}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseStart;
