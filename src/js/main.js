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

// Contact form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const successNotification = document.getElementById('success-notification');
  const errorNotification = document.getElementById('error-notification');
  if (contactForm) {
    // Initialize EmailJS
    (function() {
      // Replace with your actual EmailJS public key
      emailjs.init("Dso9yGGMPpoPmytyW");
    })();

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state on button
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = 'Sending...';
      submitButton.disabled = true;
      
      const firstName = document.getElementById('firstname').value;
      const lastName = document.getElementById('lastname').value;
      const email = document.getElementById('email-id').value;
      const phone = document.getElementById('phone-number').value;
      const message = document.getElementById('message').value;
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: `${firstName} ${lastName}`,
        from_email: email,
        phone_number: phone,
        message: message,
        to_email: 'realestate@mjdcrealty.com', // This will be used in the template
        reply_to: email
      };
      
      // Send email using EmailJS
      // Replace the service ID and template ID with your actual IDs from EmailJS dashboard
      emailjs.send('service_gvu2iff', 'template_glums8g', templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          showSuccessNotification();
          contactForm.reset();
        })
        .catch(function(error) {
          console.log('FAILED...', error);
          showErrorNotification();
        })
        .finally(function() {
          // Restore button state
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        });
    });
  }
    function showSuccessNotification() {
    if (successNotification) {
      successNotification.classList.add('show');
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        successNotification.classList.remove('show');
      }, 5000);
    }
  }
  
  function showErrorNotification() {
    if (errorNotification) {
      errorNotification.classList.add('show');
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        errorNotification.classList.remove('show');
      }, 5000);
    }
  }
});