"use client"
import { useGeolocationManager } from "@/hooks/use-geolocation-manager/use-geolocation-manager.hook";

export default function Page() {
  const geolocationManager = useGeolocationManager({
    onSuccessPosition(position, whereCalled) {
      console.log('position', position);
      console.log('whereCalled', whereCalled);
    },
    onErrorPosition(error, whereCalled) {
      console.log('error', error);
      console.log('whereCalled', whereCalled);  
    },
  });

  return (
    <>
      <div>
        <div>
          { geolocationManager.isSupport === undefined ? '이 브라우저가 geolocation 을 지원하는지 확인중입니다.' : '' }
          { geolocationManager.isSupport === true ? '이 브라우저는 geolocation 을 지원합니다.' : '' }
          { geolocationManager.isSupport === false ? '이 브라우저는 geolocation 을 지원하지 않습니다.' : '' }
        </div>
      </div>
      <div>
        <button 
          onClick={() => {
            geolocationManager.getCurrentPosition({ whereCalled: new Date().getTime().toString() });
          }}>
          현재 위치 정보 가져오기
        </button>
        <div>
          현재 위치 정보 : 
          {
            geolocationManager.isTaking ? 
            <>
              위치정보 가져오는중...
            </> : 
            <>
              { `${geolocationManager.successPosition?.coords.latitude}, ${geolocationManager.successPosition?.coords.longitude}` }
            </>
          }
        </div>
      </div>
      <div>
        { 
          geolocationManager.errorType !== undefined ? 
          <div>
            { geolocationManager.errorPosition?.message }
          </div>
          : null
        }
      </div>
    </>
  );
}
