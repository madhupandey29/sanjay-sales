document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navOverlay = document.querySelector(".nav-overlay");
  const header = document.querySelector(".site-header");
  const scrollBtn = document.querySelector(".scroll-top");
  const navLinkEls = document.querySelectorAll(".nav-link");

  // Mobile Navigation State
  let isMenuOpen = false;

  // Close Mobile Menu Function
  const closeMobileMenu = () => {
    if (navToggle) navToggle.classList.remove("open");
    if (navLinks) navLinks.classList.remove("nav-links--open");
    if (navOverlay) navOverlay.classList.remove("active");
    document.body.classList.remove("nav-open");
    isMenuOpen = false;
  };

  // Open Mobile Menu Function
  const openMobileMenu = () => {
    if (navToggle) navToggle.classList.add("open");
    if (navLinks) navLinks.classList.add("nav-links--open");
    if (navOverlay) navOverlay.classList.add("active");
    document.body.classList.add("nav-open");
    isMenuOpen = true;
  };

  // Toggle Mobile Menu Function
  const toggleMobileMenu = () => {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  // Initialize Mobile Navigation
  if (navToggle && navLinks && navOverlay) {
    // Toggle menu on hamburger click
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
    
    // Close menu when clicking overlay
    navOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
    
    // Handle menu link clicks - FIXED VERSION
    navLinkEls.forEach(link => {
      link.addEventListener("click", (e) => {
        // If mobile menu is open, close it first
        if (window.innerWidth <= 768 && isMenuOpen) {
          const targetId = link.getAttribute("href");
          
          // Prevent default action
          e.preventDefault();
          
          // Close the mobile menu
          closeMobileMenu();
          
          // Wait for menu animation to complete, then scroll to target
          setTimeout(() => {
            if (targetId.startsWith("#")) {
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                  top: targetPosition,
                  behavior: "smooth"
                });
              }
            }
          }, 350); // Match the CSS transition time
        }
      });
    });

    // Close menu with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // Close menu when window is resized to desktop
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
      }
    };
    
    window.addEventListener("resize", handleResize);
  }

  // Header scroll effect
  const handleScroll = () => {
    // Header shadow on scroll
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("site-header--scrolled");
      } else {
        header.classList.remove("site-header--scrolled");
      }
    }

    // Scroll to top button
    if (scrollBtn) {
      if (window.scrollY > 300) {
        scrollBtn.classList.add("visible");
      } else {
        scrollBtn.classList.remove("visible");
      }
    }

    // Update active nav link
    updateActiveNavLink();
  };

  // Scroll to top button functionality
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Update active nav link based on scroll position
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    
    navLinkEls.forEach(link => {
      const sectionId = link.getAttribute("href").substring(1);
      const section = document.getElementById(sectionId);
      
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);
  
  // Initial call to set correct state
  handleScroll();

  // Smooth scroll for anchor links (desktop version)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "#!") return;
      
      // Skip if this is a mobile link (handled separately)
      if (window.innerWidth <= 768 && this.classList.contains("nav-link")) {
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const fadeElements = document.querySelectorAll(".category-card, .partner-card, .brand-badge");
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  // Set initial styles and observe fade elements
  fadeElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    fadeObserver.observe(element);
  });

  // Hover effects for cards (desktop only)
  const cards = document.querySelectorAll(".category-card, .partner-card");
  
  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        card.style.transform = "translateY(-10px)";
      }
    });
    
    card.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        card.style.transform = "translateY(0)";
      }
    });
  });

  // Parallax effect for hero background
  const heroBgGlow = document.querySelector(".hero-bg-glow");
  
  if (heroBgGlow) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroBgGlow.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
    });
  }

  // Counter animation for hero stats
  const counters = document.querySelectorAll(".hero-meta-number");
  const speed = 200;

  const startCounter = (counter) => {
    const target = parseInt(counter.textContent.replace("+", ""));
    let count = 0;
    const increment = target / speed;
    
    const updateCount = () => {
      if (count < target) {
        count += increment;
        counter.textContent = Math.ceil(count) + "+";
        setTimeout(updateCount, 1);
      } else {
        counter.textContent = target + "+";
      }
    };
    
    updateCount();
  };

  // Start counters when hero section is in view
  const heroSection = document.querySelector(".hero");
  if (heroSection && counters.length > 0) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        counters.forEach(counter => {
          startCounter(counter);
        });
        heroObserver.unobserve(heroSection);
      }
    }, { threshold: 0.5 });
    
    heroObserver.observe(heroSection);
  }

  // Add ripple effect to buttons (except mobile menu links)
  document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function(e) {
      // Don't create ripple if it's a mobile menu link
      if (this.closest('.nav-links') && window.innerWidth <= 768) return;
      
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement("span");
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Initialize tooltips
  const tooltipElements = document.querySelectorAll("[title]");
  tooltipElements.forEach(element => {
    element.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = element.getAttribute("title");
      document.body.appendChild(tooltip);
      
      const rect = element.getBoundingClientRect();
      const tooltipWidth = tooltip.offsetWidth;
      const leftPosition = Math.max(
        10,
        Math.min(
          rect.left + rect.width / 2 - tooltipWidth / 2,
          window.innerWidth - tooltipWidth - 10
        )
      );
      
      tooltip.style.left = leftPosition + "px";
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + "px";
      
      element.tooltip = tooltip;
    });
    
    element.addEventListener("mouseleave", () => {
      if (element.tooltip) {
        element.tooltip.remove();
        element.tooltip = null;
      }
    });
  });

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Scroll to top with Home key
    if (e.key === "Home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    // Scroll to bottom with End key
    if (e.key === "End") {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
    
    // Close mobile menu with Escape key
    if (e.key === "Escape" && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && isMenuOpen) {
      const isClickInsideMenu = navLinks.contains(e.target);
      const isClickOnToggle = navToggle.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMobileMenu();
      }
    }
  });

  // Add CSS for ripple effect
  const style = document.createElement("style");
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .tooltip {
      position: fixed;
      background: var(--col-surface);
      color: var(--col-heading);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      z-index: 9999;
      pointer-events: none;
      box-shadow: var(--shadow-medium);
      border: 1px solid var(--col-border);
      transform: translateY(-5px);
      opacity: 0;
      animation: tooltip-fade 0.2s forwards;
      white-space: nowrap;
      max-width: 200px;
      text-align: center;
    }
    
    @keyframes tooltip-fade {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // Log initialization
  console.log("Sanjay Sales website initialized successfully!");
});