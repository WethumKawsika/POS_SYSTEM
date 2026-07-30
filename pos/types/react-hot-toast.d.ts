declare module 'react-hot-toast' {
  type Toast = any;

  interface ToastFn {
    (message: any, options?: any): Toast;
    success(message: any, options?: any): Toast;
    error(message: any, options?: any): Toast;
    dismiss(id?: string | number): void;
  }

  const toast: ToastFn;
  export default toast;

  // Common named exports used by consumers
  export const Toaster: any;
}
