// Feature bundle for LazyMotion, isolated in its own module so Next.js can
// split it into an async chunk. domMax (rather than domAnimation) is required
// because the hero uses layout animations (layout props + LayoutGroup).
export { domMax as default } from "framer-motion";
