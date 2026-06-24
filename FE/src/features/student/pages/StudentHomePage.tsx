import { useState } from "react";
import { MessageSquare, Plane, AlertTriangle, Send } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useStudentEnrollmentsQuery, useCoursesQuery } from "@/features/courses/hooks/useCourses";
import { Card, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface ChatMessage {
  id: string;
  sender: "student" | "ai";
  text: string;
  timestamp: string;
}

const INITIAL_MOCK_CHATS: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "101",
      sender: "student",
      text: "What are the key indications of wind shear?",
      timestamp: "2026-06-20T10:00:00Z",
    },
    {
      id: "102",
      sender: "ai",
      text: "Wind shear is indicated by sudden changes in wind speed and/or direction, causing rapid changes in airspeed and altitude. Key signs include: unexplained changes in airspeed (e.g., gain or loss of 15 knots), sudden rate of climb/descent changes, and alerts from WSR-88D weather radars or LLWAS systems.",
      timestamp: "2026-06-20T10:00:15Z",
    },
  ],
  "2": [
    {
      id: "201",
      sender: "student",
      text: "How does the angle of attack affect lift?",
      timestamp: "2026-06-21T14:30:00Z",
    },
    {
      id: "202",
      sender: "ai",
      text: "As the angle of attack (AoA) increases, lift increases proportionally up to a critical point known as the stalling angle (typically around 15-18 degrees). Beyond the critical AoA, flow separation occurs over the upper surface, resulting in a sudden drop in lift and a sharp increase in drag.",
      timestamp: "2026-06-21T14:30:20Z",
    },
  ],
  "3": [
    {
      id: "301",
      sender: "student",
      text: "What is the primary function of the PFD?",
      timestamp: "2026-06-22T09:15:00Z",
    },
    {
      id: "302",
      sender: "ai",
      text: "The Primary Flight Display (PFD) integrates critical flight data onto a single electronic display. It features flight instruments such as the attitude indicator, airspeed tape, altimeter tape, vertical speed indicator, and slip/skid coordinator to significantly reduce pilot workload.",
      timestamp: "2026-06-22T09:15:30Z",
    },
  ],
};

export default function StudentHomePage() {
  const user = useAuthStore((state) => state.user);
  const studentEmail = user?.email ?? "";

  // Query enrollments for this student
  const enrollmentsQuery = useStudentEnrollmentsQuery(studentEmail);
  const enrolledCourseIds = enrollmentsQuery.data?.map((e) => e.courseId) ?? [];

  // Query all courses
  const coursesQuery = useCoursesQuery({ limit: 1000 });
  const allCourses = coursesQuery.data?.data ?? [];

  // Filter to only show courses assigned to this student
  const studentCourses = allCourses.filter((course) =>
    enrolledCourseIds.includes(course.id)
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(
    INITIAL_MOCK_CHATS
  );

  const selectedCourse = studentCourses.find((c) => c.id === selectedCourseId);
  const chatLogs = selectedCourseId ? chatHistories[selectedCourseId] ?? [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedCourseId || selectedCourse?.status === "INACTIVE") return;

    const newMessage: ChatMessage = {
      id: String(Date.now()),
      sender: "student",
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    const aiResponse: ChatMessage = {
      id: String(Date.now() + 1),
      sender: "ai",
      text: `This is a mock AI response for ${selectedCourse?.courseName ?? "the course"}. In production, this prompt queries the vector DB to output RAG-grounded answers.`,
      timestamp: new Date().toISOString(),
    };

    setChatHistories((prev) => ({
      ...prev,
      [selectedCourseId]: [...(prev[selectedCourseId] ?? []), newMessage, aiResponse],
    }));

    setInputText("");
  };

  const isLoading = enrollmentsQuery.isLoading || coursesQuery.isLoading;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Student Portal</p>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.fullName}</h1>
        <p className="mt-2 text-muted-foreground">
          Select a course from your assigned subjects below to view Q&A history or ask our AI assistant.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
          <div className="md:col-span-2 h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      ) : studentCourses.length === 0 ? (
        <Card className="border-border/60 bg-card/85 p-8 text-center shadow-soft">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4 animate-float" />
          <CardTitle>No courses assigned</CardTitle>
          <CardDescription className="mt-2 max-w-md mx-auto text-base">
            You are not enrolled in any flight academy courses at the moment. Please contact your administrator.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {/* Left panel: Enrolled Courses list */}
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-foreground px-1">Your Courses</h2>
            <div className="space-y-2">
              {studentCourses.map((course) => {
                const isSelected = course.id === selectedCourseId;
                const isActive = course.status === "ACTIVE";

                return (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary"
                        : "border-border/60 bg-card/90 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {course.courseCode}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10"
                            : "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/10"
                        }`}
                      >
                        {course.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-foreground text-sm sm:text-base leading-snug">
                      {course.courseName}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      Instructor: {course.teacherName}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Chat Q&A details */}
          <div className="md:col-span-2 h-[550px] flex flex-col rounded-2xl border border-border/60 bg-card/80 shadow-soft backdrop-blur-sm overflow-hidden">
            {selectedCourse ? (
              <>
                {/* Header */}
                <div className="border-b border-border/60 bg-muted/20 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {selectedCourse.courseName}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedCourse.courseCode} • Instructor: {selectedCourse.teacherName}
                    </p>
                  </div>
                </div>

                {/* Warning Banner if INACTIVE */}
                {selectedCourse.status === "INACTIVE" && (
                  <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 flex items-start gap-2.5 text-amber-900 text-xs sm:text-sm">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Course Inactive:</span> New question submissions are disabled. However, you can review all previous Q&A session history logs below.
                    </div>
                  </div>
                )}

                {/* Chat Message Logs */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
                  {chatLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">
                        No Q&A history found. Start by typing a question below!
                      </p>
                    </div>
                  ) : (
                    chatLogs.map((msg) => {
                      const isAi = msg.sender === "ai";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                              isAi
                                ? "bg-white border border-border/60 text-foreground"
                                : "bg-primary text-white"
                            }`}
                          >
                            <p className="font-semibold text-[11px] mb-1 opacity-70 tracking-wide uppercase">
                              {isAi ? "AI Assistant" : "You"}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span className="mt-1 block text-[10px] text-right opacity-60">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <form
                  onSubmit={handleSend}
                  className="border-t border-border/60 p-4 bg-card flex gap-2 items-center"
                >
                  <Input
                    placeholder={
                      selectedCourse.status === "ACTIVE"
                        ? "Ask a question about this course material..."
                        : "New Q&A is disabled for deactivated courses"
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={selectedCourse.status === "INACTIVE"}
                    className="flex-1 bg-muted/40"
                  />
                  <Button
                    type="submit"
                    disabled={selectedCourse.status === "INACTIVE" || !inputText.trim()}
                    className="shrink-0 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Plane className="h-12 w-12 text-primary/30 mb-4 animate-float" />
                <h3 className="font-semibold text-lg text-foreground">Select a Course</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Choose a subject from the sidebar to view your learning history or start questioning the AI pilot companion.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
