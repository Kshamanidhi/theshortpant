import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin);

export { gsap, ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin };
