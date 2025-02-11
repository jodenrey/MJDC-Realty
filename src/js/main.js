import { HeaderManager } from "./components/header";
import { featureProperty } from "./pages/home/featureProperty";
import { latestProperties } from "./pages/home/latestProperty";
import { featuredBlogCards } from "./pages/home/featuredBlogCards";
import { testimonialCarousel } from "./components/testimonialCarousel";
import { FAQAccodionManager } from "./components/faqAccordion";
import { featureServiceView } from "./pages/about/featureServiceView";

const headerManager = new HeaderManager();
const faqAccordion = new FAQAccodionManager();
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const textElements = gsap.utils.toArray('.section-title, .heading-primary, .heading-secondary');
textElements.forEach(text => {
  gsap.from(text, {
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
      trigger: text,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
});

  
// Animate All Sections on Scroll (Works on Every Page)
gsap.utils.toArray("section, .footer-section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 85%", 
      toggleActions: "play none none reverse",
    },
  });
});

// Animate Footer (Runs Globally)
gsap.from(".footer-container", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".footer-container",
    start: "top 90%",
    toggleActions: "play none none reverse",
  },
});