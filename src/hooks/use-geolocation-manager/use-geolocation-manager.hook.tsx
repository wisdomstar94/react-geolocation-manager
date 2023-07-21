import { useCallback, useEffect, useRef, useState } from "react";
import { IUseGeolocationManager } from "./use-geolocation-manager.interface";

export function useGeolocationManager(props?: IUseGeolocationManager.Props) {
  const {
    onSuccessPosition,
    onErrorPosition,
    onTakingPosition,
  } = props ?? {};
  const [successPosition, setSuccessPosition] = useState<GeolocationPosition>();
  const [errorPosition, setErrorPosition] = useState<GeolocationPositionError>();
  const [isTaking, setIsTaking] = useState<boolean>(false);
  const isTakingRef = useRef<boolean>(false);
  const [isSupport, setIsSupport] = useState<boolean>();
  const [errorType, setErrorType] = useState<IUseGeolocationManager.ErrorType>();
  const currentWhereCalled = useRef<string>();

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setIsTaking(false);
    isTakingRef.current = false;
    setErrorType(undefined);
    setSuccessPosition(position);
    if (typeof onSuccessPosition === 'function') {
      onSuccessPosition(position, currentWhereCalled.current);
    }
    currentWhereCalled.current = undefined;
  }, [onSuccessPosition]);

  const onError = useCallback((error: GeolocationPositionError) => {
    setIsTaking(false);
    isTakingRef.current = false;
    setErrorPosition(error);
    if (typeof onErrorPosition === 'function') {
      onErrorPosition(error, currentWhereCalled.current);
    }

    switch(error.code) {
      case error.PERMISSION_DENIED: {
        console.error('위치 정보 이용 권한이 거부되었습니다.', error.message);
        setErrorType('permission-denied');
      } break;
      case error.TIMEOUT: {
        console.error('위치 정보를 가져오는 도중 timeout 이 발생하였습니다.', error.message);
        setErrorType('timeout');
      } break;
      case error.POSITION_UNAVAILABLE: {
        console.error('위치 정보를 이용할 수 없습니다.', error.message);
        setErrorType('position-unavailable');
      } break;
      default: {
        console.error('위치 정보를 가져오는 도중 에러가 발생하였습니다.', error.message);
        setErrorType('unknown');
      } break;
    }
  }, [onErrorPosition]);

  const getCurrentPosition = useCallback((options: IUseGeolocationManager.GetCurrentPositionOptions) => {
    if (isTakingRef.current) {
      console.error(`아직 위치 정보를 불러오고 있는 중입니다.`);
      return;
    }
    currentWhereCalled.current = options.whereCalled;
    if (typeof onTakingPosition === 'function') {
      onTakingPosition();
    }
    isTakingRef.current = true;
    setIsTaking(true);

    const retryCount = 1;
    let retryedCount = 0;

    const call = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        if (typeof options.onSuccess === 'function') {
          options.onSuccess(position);
        }
        onSuccess(position);
      }, (positionError) => {
        console.error(`positionError`, positionError);
        if (retryedCount < retryCount) {
          retryedCount++;
          call();
          return;
        }
        if (typeof options.onError === 'function') {
          options.onError(positionError);
        }
        onError(positionError);
      });
    };
    call();
  }, [onError, onSuccess, onTakingPosition]);

  useEffect(() => {
    setIsSupport(!!navigator.geolocation);
  }, []);

  return {
    isSupport,
    getCurrentPosition,
    isTaking,
    errorType,
    successPosition,
    errorPosition,
  };
}