"use client";

import NextLink, { LinkProps } from "next/link";
import { HTMLAttributes, useEffect, useRef, useTransition } from "react";

let lastSelector;
let lastName;

const setViewTransitionName = (el: Element, viewTransitionName?: string) =>
  (((el as HTMLElement).style as any).viewTransitionName = viewTransitionName);

const sleep = async (ms: number) => {
  return new Promise((res) => setTimeout(() => res(undefined), ms));
};

let initialized = false;

const safeViewTransition = ({
  fn,
  nodeSelector,
  viewTransitionName,
}: {
  fn?: (...args: any) => any;
  nodeSelector?: string;
  viewTransitionName?: string;
}) => {
  if (nodeSelector && viewTransitionName) {
    const el = document.querySelector(nodeSelector);
    if (el) setViewTransitionName(el, viewTransitionName);

    lastName = viewTransitionName;
    lastSelector = `[data-id=${el.getAttribute("data-id")}]`;
  }

  if ((document as any).startViewTransition !== undefined) {
    const transition = (document as any).startViewTransition(async () => {
      console.log("BB");

      if (fn) await fn();

      console.log("AAAA", viewTransitionName);

      if (!viewTransitionName) {
        const destEl = document.querySelector(lastSelector);

        console.log(lastSelector);
        console.log(destEl);

        if (destEl) (destEl?.style as any).viewTransitionName = "banner-img";
      }
    });

    transition.finished.finally(() => {
      const destEl =
        document.querySelector(lastSelector) ||
        document.querySelector(nodeSelector);
      if (destEl) destEl.style.viewTransitionName = "";

      if (!viewTransitionName) {
        lastName = undefined;
        lastSelector = undefined;
      }
    });
  } else {
    fn();
  }
};

export default ({
  nodeSelector,
  viewTransitionName,
  goBack,
  ...props
}: LinkProps &
  HTMLAttributes<HTMLAnchorElement> & {
    nodeSelector?: string;
    viewTransitionName?: string;
    goBack?: boolean;
  }) => {
  useEffect(() => {
    if (initialized === false) {
      initialized = true;

      window.onpopstate = function (e) {
        console.log(e);

        safeViewTransition({
          fn: async () => await sleep(10),
        });
      };

      // ((window as any)?.navigation as any).addEventListener(
      //   "navigate",
      //   async (e: any) => {
      //     console.log(e);

      //     console.log(e.target.transition);

      //     await sleep(1);

      //     if ("push" === e?.navigationType) {
      //       safeViewTransition({
      //         // fn: async () => await sleep(1000),
      //         nodeSelector,
      //         // viewTransitionName,
      //       });
      //     }
      //     if ("replace" === e?.navigationType) {
      //       safeViewTransition({
      //         // fn: async () => await sleep(1000),
      //         nodeSelector,
      //         viewTransitionName,
      //       });
      //     }
      //   }
      // );
    }
  }, []);

  return (
    <NextLink
      {...props}
      onClick={(e) => {
        if (goBack) {
          e.preventDefault();

          (window as any).navigation.back();
        } else {
          safeViewTransition({
            fn: async () => await sleep(10),
            nodeSelector,
            viewTransitionName,
          });
        }
      }}
    />
  );
};
