"use client";

import { CoursePlayer } from "@/components/CoursePlayer";
import { BIENESTAR_COURSE } from "@/lib/courses/bienestarCourse";
import { DISCLAIMER_CO } from "@/lib/outplacement/bienestarCo";

export default function BienestarPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-xs muted px-1">{DISCLAIMER_CO}</p>
      <CoursePlayer course={BIENESTAR_COURSE} />
    </div>
  );
}
