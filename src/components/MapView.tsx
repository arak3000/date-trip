import { useState, useEffect, useRef } from "react";

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

  const [searchKeyword, setSearchKeyword] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);

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
                  alert(`"${place.place_name}"이 코스에 추가되었습니다.`);
                  infowindow.close();
                  // 코스 추가 로직을 여기에 작성
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
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white shadow px-4 py-2 rounded flex gap-2">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          //placeholder="장소를 검색하세요"
          className="border border-gray-300 rounded px-2 py-1 w-62 background-color: whitesmoke"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded px-4 py-1"
        >
          검색
        </button>
      </div>
    <div ref={mapRef} className="w-full h-full mx-auto" style={{ height: "100%" }} />
    </div>
  );
}
