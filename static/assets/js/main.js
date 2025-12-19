/**
 * Template Name: iPortfolio - v3.3.0
 * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos,
            behavior: 'smooth'
        })
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        const isActive = select('body').classList.toggle('mobile-nav-active')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
        this.setAttribute('aria-expanded', isActive)
    })

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let body = select('body')
            if (body.classList.contains('mobile-nav-active')) {
                body.classList.remove('mobile-nav-active')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });

    /**
     * Hero type effect
     */
    const typed = select('.typed')
    if (typed) {
        let typed_strings = typed.getAttribute('data-typed-items')
        typed_strings = typed_strings.split(',')
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000
        });
    }

    /**
     * Skills animation
     */
    if (typeof Waypoint !== 'undefined') {
        let skilsContent = select('.skills-content');
        if (skilsContent) {
            new Waypoint({
                element: skilsContent,
                offset: '80%',
                handler: function(direction) {
                    let progress = select('.progress .progress-bar', true);
                    progress.forEach((el) => {
                        el.style.width = el.getAttribute('aria-valuenow') + '%'
                    });
                }
            })
        }
    }

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
        if (typeof Isotope === 'undefined') return;
        let portfolioContainer = select('.portfolio-container');
        if (portfolioContainer) {
            let portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item'
            });

            let portfolioFilters = select('#portfolio-flters li', true);

            on('click', '#portfolio-flters li', function(e) {
                e.preventDefault();
                portfolioFilters.forEach(function(el) {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                    portfolioIsotope.arrange({
                        filter: this.getAttribute('data-filter')
                    });
                    portfolioIsotope.on('arrangeComplete', function() {
                        if (typeof AOS !== 'undefined') {
                            AOS.refresh()
                        }
                    });
            }, true);
        }

    });

    /**
     * Initiate portfolio lightbox
     */
    if (typeof GLightbox !== 'undefined') {
        const portfolioLightbox = GLightbox({
            selector: '.portfolio-lightbox'
        });
    }

    /**
     * Portfolio details slider
     */
    if (typeof Swiper !== 'undefined') {
        new Swiper('.portfolio-details-slider', {
            speed: 400,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            }
        });

        /**
         * Testimonials slider
         */
        new Swiper('.testimonials-slider', {
            speed: 600,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            slidesPerView: 'auto',
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },

                1200: {
                    slidesPerView: 3,
                    spaceBetween: 20
                }
            }
        });
    }

    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            })
        }
    });

    /**
     * Dark Mode Toggle with Auto (OS preference) support
     */
    const initThemeToggle = () => {
        const themeToggle = select('#theme-toggle')
        const themeIcon = select('#theme-icon')
        const html = document.documentElement
        
        // Get OS preference
        const getOSPreference = () => {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        
        // Apply theme
        const applyTheme = (theme) => {
            if (theme === 'auto') {
                const osTheme = getOSPreference()
                html.setAttribute('data-theme', osTheme)
            } else {
                html.setAttribute('data-theme', theme)
            }
        }
        
        // Update icon based on current theme
        const updateIcon = (theme) => {
            if (theme === 'auto') {
                const osTheme = getOSPreference()
                if (osTheme === 'dark') {
                    themeIcon.classList.remove('bi-sun-fill')
                    themeIcon.classList.add('bi-moon-fill')
                } else {
                    themeIcon.classList.remove('bi-moon-fill')
                    themeIcon.classList.add('bi-sun-fill')
                }
            } else if (theme === 'dark') {
                themeIcon.classList.remove('bi-sun-fill')
                themeIcon.classList.add('bi-moon-fill')
            } else {
                themeIcon.classList.remove('bi-moon-fill')
                themeIcon.classList.add('bi-sun-fill')
            }
        }
        
        // Check for saved theme preference or default to 'auto' (OS preference)
        const savedTheme = localStorage.getItem('theme')
        const currentTheme = savedTheme || 'auto'
        
        applyTheme(currentTheme)
        updateIcon(currentTheme)
        
        // Listen for OS preference changes when in auto mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleOSChange = (e) => {
            const savedTheme = localStorage.getItem('theme')
            if (!savedTheme || savedTheme === 'auto') {
                applyTheme('auto')
                updateIcon('auto')
            }
        }
        mediaQuery.addEventListener('change', handleOSChange)
        
        if (themeToggle) {
            on('click', '#theme-toggle', function() {
                const savedTheme = localStorage.getItem('theme') || 'auto'
                let newTheme
                
                // Cycle through: auto -> light -> dark -> auto
                if (savedTheme === 'auto') {
                    newTheme = 'light'
                } else if (savedTheme === 'light') {
                    newTheme = 'dark'
                } else {
                    newTheme = 'auto'
                }
                
                if (newTheme === 'auto') {
                    localStorage.removeItem('theme') // Remove to default to auto
                } else {
                    localStorage.setItem('theme', newTheme)
                }
                
                applyTheme(newTheme)
                updateIcon(newTheme)
            })
        }
    }
    
    // Initialize theme toggle on page load
    window.addEventListener('load', () => {
        initThemeToggle()
    })

})()