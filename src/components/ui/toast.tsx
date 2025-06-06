"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactElement,
  RefObject,
} from "react";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
  ref?: RefObject<ComponentRef<typeof ToastPrimitives.Viewport>>;
}) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    ref?: RefObject<ComponentRef<typeof ToastPrimitives.Root>>;
  };
const Toast = ({ ref, className, variant, ...props }: ToastProps) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

export type ToastActionProps = ComponentPropsWithoutRef<
  typeof ToastPrimitives.Action
> & {
  ref?: RefObject<ComponentRef<typeof ToastPrimitives.Action>>;
};
const ToastAction = ({ ref, className, ...props }: ToastActionProps) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-1 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitives.Close> & {
  ref?: RefObject<ComponentRef<typeof ToastPrimitives.Close>>;
}) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "text-foreground/50 hover:text-foreground absolute top-1 right-1 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:opacity-100 focus:ring-1 focus:outline-hidden focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & {
  ref?: RefObject<ComponentRef<typeof ToastPrimitives.Title>>;
}) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitives.Description> & {
  ref?: RefObject<ComponentRef<typeof ToastPrimitives.Description>>;
}) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastActionElement = ReactElement<typeof ToastAction>;

export {
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
