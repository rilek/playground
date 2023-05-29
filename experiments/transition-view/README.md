# Transitions View API Experiment

> The View Transitions API provides a mechanism for easily creating animated transitions between different DOM states, while also updating the DOM contents in a single step.
> — <cite>MDN[^1]</cite>

![Peek 2023-05-29 11-41](https://github.com/rilek/playground/assets/11237759/1b0a00c3-3bb0-4242-a610-68b70bd099ae)


## Keywords
- View Transitions API, NextJS (appDir), React Server Components, Navigation API


## Notes
- All - View Transitions API[^2], React Server Components [^3] and Navigation API[^4] - are considered experimental at the moment, and spec can change. None of this code should be used in production.
- Also implementation was done only to test the API. I don't see this working in production event after APIs are stable. Current implementation is flaky and heavily relies on timing, while it should be more sync.
- Both native old History API and new Navigation API events, and Next router events are being invoked too late to run animations. At the moment on `onClick` event is required.
- Next
- Root animations are easy - custom transitions are a little bit harder, since its name has to unique on each page. Each custom transition name requiees some CSS to handle. Having list of items requires to manually set `view-transition-name: {name}` style property on item on click, to avoid manually creating CSS for each case.
- It's working fine with both server and client components, but requires to data be in place during next render. Browser creates a screenshot of old view (custom transition names are treated separately) and animate to new view. In this time page is not interactive and visuals don't update.
- Animation tab in Chrome's devtools is super useful to debug it, since it allows to slow down animation or even stop it and debug HTML and CSS.
- NextJS discussion around this feature [^5]

## Getting Started

First, run the development server:

```bash
yarn dev
```

By default app will run under URL: [http://localhost:3000](http://localhost:3000).

## Links:

[^1]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[^2]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#browser_compatibility
[^3]: https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md
[^4]: https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API#browser_compatibility
[^5]: https://github.com/vercel/next.js/discussions/46300
