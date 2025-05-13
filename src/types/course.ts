export type CoursePlace = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    desc: string;
    url: string;
};
export type Course {
    id: string;
    name: string;
    createdAt: string;
    places: CoursePlace[];
    description: string;
}