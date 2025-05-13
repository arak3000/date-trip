import React from 'react';
import { Course, CoursePlace } from '@/types/course';

interface CourseSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  savedCourses: Course[];
}

export default function CourseSidebar({
     sidebarOpen, 
     toggleSidebar, 
     savedCourses
}: CourseSidebarProps) {
    return  (
        <>
        {/* Open Sidebar button */}
        <button
            className="fixed top-4 left-4 z-50 px-4 bg-transparent text-white rounded outline-none focus:outline-none active:outline-none ring-0 shadow-none border-none"
            onClick={toggleSidebar}
        >
            <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-400 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-400"></span>
        </button>

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full bg-white w-64 shadow-lg z-30 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <h2 className="text-lg font-bold">저장된 코스</h2>
            {savedCourses.map((course) => (
                <div key={course.id} 
                     className="mb-4 p-2 border rounded"
                >
                    <div className="font-semibold">{course.name}</div>
                    <div className="text-sm text-gray-500">{course.description}</div>
                </div>
            ))}
        </div>
    </>
    );
}