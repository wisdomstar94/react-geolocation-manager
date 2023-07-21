export declare namespace IUseGeolocationManager {
  export type ErrorType = 'permission-denied' | 'timeout' | 'position-unavailable' | 'unknown';

  export interface SuccessInfo {
    whereCalled?: string;
    position: GeolocationPosition;
  }

  export interface GetCurrentPositionOptions {
    onSuccess?: PositionCallback;
    onError?: PositionErrorCallback;
    whereCalled?: string;
  }

  export interface Props {
    onSuccessPosition?: (position: GeolocationPosition, whereCalled?: string) => void;
    onErrorPosition?: (error: GeolocationPositionError, whereCalled?: string) => void;
    onTakingPosition?: () => void;
  }
}