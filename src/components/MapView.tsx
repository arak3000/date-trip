import { useEffect, useRef } from "react";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);

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

        // ✅ Places API 객체 생성
        // @ts-ignore
        const ps = new window.kakao.maps.services.Places();

        // ✅ 키워드로 장소 검색 (예: 서울 근처 카페)
        ps.keywordSearch("서울 카페", (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            data.forEach((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x);

              const marker = new window.kakao.maps.Marker({
                map,
                position,
              });

              const infowindow = new window.kakao.maps.InfoWindow({
                content: `
                  <div style="padding:5px;font-size:13px; line-height:1.4;">
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
                infowindow.open(map, marker);

                // 버튼 이벤트는 약간의 delay 필요
                setTimeout(() => {
                  const btn = document.getElementById(`add-${place.id}`);
                  if (btn) {
                    btn.onclick = () => {
                      alert(`'${place.place_name}' 코스에 추가`);
                      infowindow.close();
                      // TODO: 코스 상태에 push
                    };
                  }
                }, 0);
              });
            });
          }
        });
      });
    };

    document.head.appendChild(script);
  }, []);

  return <div ref={mapRef} className="w-full h-full mx-auto" style={{ height: "100%" }} />;
}
