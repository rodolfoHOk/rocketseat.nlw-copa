import * as ToastPrimitive from '@radix-ui/react-toast';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { CheckCircle, Info, Warning, WarningOctagon, X } from 'phosphor-react';

interface ToastProps extends ToastPrimitive.ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  title: string;
  description: string;
}

const Toast = forwardRef((props: ToastProps, forwardedRef) => {
  const { variant, duration = 3000, title, description, ...toastProps } = props;
  const [count, setCount] = useState(0);

  useImperativeHandle(forwardedRef, () => ({
    publish: () => setCount((count) => count + 1),
  }));

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ToastPrimitive.Root
          key={index}
          {...toastProps}
          duration={duration}
          className={`relative p-4 flex items-center gap-4 bg-gray-800 border-b-4
            rounded shadow-md shadow-black/40 animate-toastInRight
            ${
              variant === 'success'
                ? 'border-green-600'
                : variant === 'error'
                ? 'border-red-600'
                : variant === 'warning'
                ? 'border-amber-500'
                : 'border-blue-600'
            }
          `}
        >
          {variant === 'success' ? (
            <CheckCircle size={32} weight="fill" className="text-green-600" />
          ) : variant === 'error' ? (
            <WarningOctagon size={32} weight="fill" className="text-red-600" />
          ) : variant === 'warning' ? (
            <Warning size={32} weight="fill" className="text-amber-500" />
          ) : (
            <Info size={32} weight="fill" className="text-blue-600" />
          )}

          <div className="flex flex-col gap-1">
            <ToastPrimitive.Title className="font-semibold text-base text-gray-100">
              {title}
            </ToastPrimitive.Title>

            <ToastPrimitive.Description className="font-normal text-base text-gray-100">
              {description}
            </ToastPrimitive.Description>
          </div>
          <ToastPrimitive.Close
            className="absolute top-0 right-0 p-2 rounded text-gray-500 hover:bg-white/10  hover:text-gray-300 transition-colors duration-200"
            aria-label="Fechar"
          >
            <X size={24} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </>
  );
});
Toast.displayName = 'Toast';
export { Toast };

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = () => (
  <ToastPrimitive.Viewport className="fixed top-6 right-3 w-96 max-w-full z-50 flex flex-col p-6 gap-2 list-none outline-0" />
);
