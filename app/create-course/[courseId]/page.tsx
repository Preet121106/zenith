import CoursePageLayout from "./CoursePageLayout";

type PageProps = {
  params: {
    courseId: string;
  };
};

export default function Page({ params }: PageProps) {
  return <CoursePageLayout params={params} />;
}
