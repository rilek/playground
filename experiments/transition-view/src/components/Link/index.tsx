"use client";

import { HTMLAttributes, useEffect } from "react";
import NextLink, { LinkProps } from "next/link";

interface SaveTransitionParams {
  fn?: (...args: any) => any;
  nodeSelector?: string;
  viewTransitionName?: string;
}

let lastSelector;
let lastName;
let initialized = false;

const setViewTransitionName = (el: Element, viewTransitionName?: string) =>
  (((el as HTMLElement).style as any).viewTransitionName = viewTransitionName);

const sleep = async (ms: number) => {
  return new Promise((res) => setTimeout(() => res(undefined), ms));
};

const setViewTransitionNameIfExists = ({
  nodeSelector,
  viewTransitionName,
}: SaveTransitionParams) => {
  const hasDefiniedElement = nodeSelector && viewTransitionName;

  if (hasDefiniedElement) {
    const el = document.querySelector(nodeSelector);
    if (el) setViewTransitionName(el, viewTransitionName);

    lastName = viewTransitionName;
    lastSelector = nodeSelector;
  }
};

const runTransition = ({ fn, viewTransitionName }: SaveTransitionParams) => {
  const transition = (document as any).startViewTransition(async () => {
    if (fn) await fn();

    if (!viewTransitionName) {
      const destEl = document.querySelector(lastSelector);

      if (destEl) (destEl?.style as any).viewTransitionName = lastName;
    }
  });

  transition.finished.finally(() => {
    const destEl = document.querySelector(lastSelector);
    if (destEl) destEl.style.viewTransitionName = "";

    if (!viewTransitionName) {
      lastName = undefined;
      lastSelector = undefined;
    }
  });
};

const supportsTransition = () =>
  (document as any).startViewTransition !== undefined;

const safeViewTransition = (params: SaveTransitionParams) => {
  setViewTransitionNameIfExists(params);

  if (supportsTransition()) {
    runTransition(params);
  } else {
    params?.fn();
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

      //
      // Uncomment to handle native back and forward actions; Uncomennt Link onClick aswell
      //
      // window.onpopstate = function (e) {
      //   console.log("EXECUTING ONPOPSTATE");
      //   safeViewTransition({
      //     fn: async () => await sleep(10),
      //   });
      // };

      //
      // Uncomment to handle new Navigation API
      //
      // ((window as any)?.navigation as any).addEventListener(
      //   "navigate",
      //   async (e: any) => {
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
        //
        // Uncomment to use browser back action
        //
        // if (goBack) {
        //   e.preventDefault();
        //   (window as any).navigation.back();
        // } else {

        safeViewTransition({
          fn: () => sleep(100),
          nodeSelector,
          viewTransitionName,
        });
        // }
      }}
    />
  );
};
