import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import CourseSidebar from "@/components/CourseSidebar";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapView() : JSX.Element {
  // ✅ useRef를 사용하여 DOM 요소에 접근
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const placesRef = useRef<any>(null);

  // ✅ useState를 사용하여 검색
  const [searchKeyword, setSearchKeyword] = useState("");
  // ✅ useState를 사용하여 마커 상태 관리
  const [markers, setMarkers] = useState<any[]>([]);
  // ✅ 코스에 추가할 장소 타입 정의
  const [courseList, setCourseList] = useState<CoursePlace[]>([]);
  // ✅ 코스 타입 정의
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  // ✅ 사이드바 열기 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ✅ CoursePlace 타입 정의
  const [courseTitle, setCourseTitle] = useState("");

  // ✅ 코스에 장소 추가
  const addToCourse = (place: CoursePlace) => {
    setCourseList((prevList) => {
      if (!prevList.some(p => p.id === place.id)) {
        return [...prevList, place];
      }
      return prevList;
    });
    alert(`"${place.name}"이(가) 코스에 추가되었습니다.`);
  };

  // ✅ 코스 저장
  const saveCourse = (title: string) => {
    if (courseList.length < 2) {
      alert("코스에 최소 2개 이상의 장소를 추가해야 합니다.");
      return;
    }

    const newCourse: Course = {
      id: crypto.randomUUID(), // 브라우저 제공 고유 ID 생성
      title,
      createdAt: new Date().toISOString(),
      places: [...courseList],
      description: "",
    };

    setSavedCourses(prev => [...prev, newCourse]);
    setCourseList([]); // 코스 저장 후 초기화
    alert(`"${title}" 코스가 저장되었습니다.`);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=ddd0088efe15e4a0a1d5445c0b8d561b&libraries=services&autoload=false`;
    script.onload = () => {
      // @ts-ignore
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
          level: 4,
        };
        // @ts-ignore
        const map = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = map;

        // ✅ Places API 객체 생성
        // @ts-ignore
        const ps = new window.kakao.maps.services.Places();
        placesRef.current = ps;
      });
    };
    document.head.appendChild(script);
  }, []);
  
  const handleSearch = () => {
    const map = mapInstanceRef.current;
    const ps = placesRef.current;
    if (!map || !ps || !searchKeyword) return;

    const bounds = map.getBounds();
    ps.keywordSearch(searchKeyword, (data: any[], status: string) => {
      if (status !== window.kakao.maps.services.Status.OK) return;

      markers.forEach((marker) => marker.setMap(null));

      const newMarkers = data.map((place) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        const marker = new window.kakao.maps.Marker({
          map,
          position
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px; line-height:1.4;">
                      <strong>${place.place_name}</strong><br/>
                      ${place.road_address_name || place.address_name}<br/>
                      ${place.phone || ''}<br/>
                      <a href="https://place.map.kakao.com/${place.id}" target="_blank" style="color:#0068c3; font-weight:bold;">
                        상세보기
                      </a><br/>
                      <button id="add-${place.id}" style="margin-top:5px; background:#FF5E5E; color:white; border:none; padding:4px 8px; border-radius:4px;">
                        코스에 추가
                      </button>
                    </div>
                  `,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
            setTimeout(() => {
              const addButton = document.getElementById(`add-${place.id}`);
              if (addButton) {
                addButton.onclick = () => {
                  const coursePlace = {
                    id: place.id,
                    name: place.place_name,
                    address: place.road_address_name || place.address_name,
                    lat: parseFloat(place.y),
                    lng: parseFloat(place.x),
                    desc: place.phone || '',
                    url: `https://place.map.kakao.com/${place.id}`,
                  };
                  addToCourse(coursePlace);
                  infowindow.close();
                };
              }
            }, 0);
          }
        });
        return marker;
      });
      setMarkers(newMarkers);
    },
    { bounds }
    );
  };
  return (
    <div className="relative w-full h-full mx-auto" style={{ height: "100%" }}>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow px-4 py-2 rounded flex gap-2 w-full max-w-[90%] h-12 flex items-center">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          //placeholder="장소를 검색하세요"
          className="border rounded px-2 py-1 w-62 h-9 w-full bg-gray-100"
        />
        <button
          onClick={handleSearch}
          className="h-9 w-9 rounded border-none bg-transparent flex items-center justify-center focus:outline-none active:outline-none focus:ring-0 active:ring-0 hover:outline-none active:scale-100 shadow-none outline-none ring-0"
        >
          <Search className="w-6 h-6 text-blue-600 shrink-0" />
        </button>
      </div>
    <div ref={mapRef} className="w-full h-full mx-auto" style={{ height: "100%" }} />
    <div className="absolute bottom-0 left-0 w-full max-h-60 overflow-y-auto bg-white z-20 p-4 shadow-inner">
      <h2 className="font-bold mb-2">등록된 코스</h2>
      {courseList.map((place, index) => (
        <div key={place.id} className="flex items-center justify-between mb-2 p-2 border-b">
          {index + 1}. {place.name} - {place.address}
        </div>
      ))}
    </div>
    {courseList.length >= 2 && (
      <div className="absolute bottom-64 left-1/2 transform -translate-x-1/2 w-full max-w-xs z-30">
      <input
        type="text"
        placeholder="코스 이름을 입력하세요"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded bg-white shadow"
      />
      <button
        onClick={() => saveCourse(courseTitle)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        코스 저장
      </button>
    </div>
    )}
    <CourseSidebar
      sidebarOpen={sidebarOpen}
      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      savedCourses={savedCourses}
    />
    </div>
  );
}
