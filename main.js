/**
 * SUPMTI Meknes - Main JavaScript
 * Interactivity & Animations
 */

(function($) {
    'use strict';

    // ========== DOM Ready ===========
    $(document).ready(function() {
        
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });

        // Initialize all functions
        navbarScroll();
        smoothScroll();
        counterUp();
        scrollToTop();
        formValidation();
        preloadImages();
        
    });

    // ========== Navbar Scroll Effect ===========
    function navbarScroll() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('#mainNav').addClass('scrolled');
            } else {
                $('#mainNav').removeClass('scrolled');
            }
        });

        // Close mobile menu on click
        $('.navbar-nav a').on('click', function() {
            if ($(window).width() < 992) {
                $('.navbar-collapse').collapse('hide');
            }
        });
    }

    // ========== Smooth Scrolling ===========
    function smoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            
            if (target.length) {
                e.preventDefault();
                var offset = 80; // Navbar height
                
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - offset
                }, 1000, 'swing');
            }
        });
    }

    // ========== Counter Up Animation ===========
    function counterUp() {
        var countersTriggered = false;

        function animateCounters() {
            if (countersTriggered) return;
            
            var statsSection = $('#stats');
            if (!statsSection.length) return;

            var scrollTop = $(window).scrollTop();
            var elementOffset = statsSection.offset().top;
            var windowHeight = $(window).height();

            if (scrollTop + windowHeight > elementOffset + 100) {
                countersTriggered = true;

                $('.counter').each(function() {
                    var $this = $(this);
                    var countTo = $this.attr('data-target');
                    
                    $({ countNum: 0 }).animate(
                        { countNum: countTo },
                        {
                            duration: 2500,
                            easing: 'swing',
                            step: function() {
                                $this.text(Math.floor(this.countNum));
                            },
                            complete: function() {
                                $this.text(this.countNum);
                            }
                        }
                    );
                });
            }
        }

        // Trigger on scroll
        $(window).on('scroll', animateCounters);
        // Also check on load
        animateCounters();
    }

    // ========== Scroll to Top Button ===========
    function scrollToTop() {
        var scrollTopBtn = $('#scrollTop');

        $(window).scroll(function() {
            if ($(this).scrollTop() > 500) {
                scrollTopBtn.addClass('show');
            } else {
                scrollTopBtn.removeClass('show');
            }
        });

        scrollTopBtn.on('click', function(e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 800, 'swing');
        });
    }

    // ========== Form Validation ===========
    function formValidation() {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            var form = $(this);
            var isValid = true;

            // Simple validation
            form.find('input[required], textarea[required], select[required]').each(function() {
                if ($(this).val().trim() === '') {
                    isValid = false;
                    $(this).addClass('is-invalid');
                } else {
                    $(this).removeClass('is-invalid');
                }
            });

            // Email validation
            var emailInput = form.find('input[type="email"]');
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailInput.val() && !emailRegex.test(emailInput.val())) {
                isValid = false;
                emailInput.addClass('is-invalid');
            }

            if (isValid) {
                // Show success message
                showNotification('success', 'Message envoyé avec succès! Nous vous contacterons bientôt.');
                form[0].reset();
            } else {
                showNotification('error', 'Veuillez remplir tous les champs requis correctement.');
            }
        });

        // Newsletter form
        $('.newsletter-form').on('submit', function(e) {
            e.preventDefault();
            var emailInput = $(this).find('input[type="email"]');
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailInput.val() && emailRegex.test(emailInput.val())) {
                showNotification('success', 'Merci! Vous êtes maintenant abonné à notre newsletter.');
                emailInput.val('');
            } else {
                showNotification('error', 'Veuillez entrer une adresse email valide.');
            }
        });
    }

    // ========== Notification System ===========
    function showNotification(type, message) {
        // Remove existing notifications
        $('.custom-notification').remove();

        var iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        var bgColor = type === 'success' ? '#10b981' : '#ef4444';

        var notification = $('<div>', {
            class: 'custom-notification',
            html: '<i class="fas ' + iconClass + '"></i> ' + message
        }).css({
            position: 'fixed',
            top: '100px',
            right: '30px',
            background: bgColor,
            color: '#fff',
            padding: '20px 30px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'none',
            fontSize: '15px',
            fontWeight: '500',
            maxWidth: '400px'
        });

        $('body').append(notification);
        notification.fadeIn(300);

        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 4000);
    }

    // ========== Preload Images ===========
    function preloadImages() {
        var images = [];
        
        // Collect all image URLs
        $('img[src]').each(function() {
            images.push($(this).attr('src'));
        });

        // Preload
        $(images).each(function() {
            $('<img>').attr('src', this);
        });
    }

    // ========== Active Navigation Highlight ===========
    $(window).on('scroll', function() {
        var scrollPosition = $(this).scrollTop();
        
        $('section').each(function() {
            var sectionTop = $(this).offset().top - 100;
            var sectionBottom = sectionTop + $(this).outerHeight();
            var sectionId = $(this).attr('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $('.navbar-nav a').removeClass('active');
                $('.navbar-nav a[href="#' + sectionId + '"]').addClass('active');
            }
        });
    });

    // ========== Hero Carousel Auto-height ===========
    function adjustCarouselHeight() {
        var windowHeight = $(window).height();
        $('.hero-section, .hero-section .carousel, .hero-section .carousel-inner, .hero-section .carousel-item').css({
            'height': windowHeight + 'px',
            'min-height': '700px'
        });
    }

    adjustCarouselHeight();
    $(window).on('resize', adjustCarouselHeight);

    // ========== Formation Card Hover Effect ===========
    $('.formation-card').on('mouseenter', function() {
        $(this).find('.formation-image img').css('transform', 'scale(1.1)');
    }).on('mouseleave', function() {
        $(this).find('.formation-image img').css('transform', 'scale(1)');
    });

    // ========== Testimonials Carousel Touch Support ===========
    var testimonialCarousel = $('#testimonialsCarousel');
    var hammertime = null;
    
    if (testimonialCarousel.length && typeof Hammer !== 'undefined') {
        hammertime = new Hammer(testimonialCarousel[0]);
        
        hammertime.on('swipeleft', function() {
            testimonialCarousel.carousel('next');
        });
        
        hammertime.on('swiperight', function() {
            testimonialCarousel.carousel('prev');
        });
    }

    // ========== Lazy Loading for Images ===========
    function lazyLoadImages() {
        var lazyImages = $('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var image = entry.target;
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                        imageObserver.unobserve(image);
                    }
                });
            });
            
            lazyImages.each(function() {
                imageObserver.observe(this);
            });
        } else {
            // Fallback for older browsers
            lazyImages.each(function() {
                this.src = this.dataset.src;
                this.removeAttribute('data-src');
            });
        }
    }

    lazyLoadImages();

    // ========== Stats Section Animation ===========
    $('.stat-card').on('mouseenter', function() {
        $(this).find('.stat-icon').addClass('animate__animated animate__bounce');
    }).on('mouseleave', function() {
        $(this).find('.stat-icon').removeClass('animate__animated animate__bounce');
    });

    // ========== Partners Marquee Pause on Hover ===========
    $('.partners-marquee').on('mouseenter', function() {
        $('.partners-track').css('animation-play-state', 'paused');
    }).on('mouseleave', function() {
        $('.partners-track').css('animation-play-state', 'running');
    });

    // ========== Loading Animation ===========
    $(window).on('load', function() {
        $('body').addClass('loaded');
        
        // Trigger entrance animations
        $('.navbar-brand').addClass('animate__animated animate__fadeInLeft');
        $('.navbar-nav').addClass('animate__animated animate__fadeInRight');
    });

    // ========== Mobile Menu Enhancement ===========
    $('.navbar-toggler').on('click', function() {
        $(this).toggleClass('active');
        
        if ($('.navbar-collapse').hasClass('show')) {
            $('.navbar-collapse').removeClass('animate__animated animate__fadeInDown');
        } else {
            $('.navbar-collapse').addClass('animate__animated animate__fadeInDown');
        }
    });

    // ========== Keyboard Navigation ===========
    $(document).on('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.keyCode === 27 && $('.navbar-collapse').hasClass('show')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // ========== Performance Optimization ===========
    // Debounce function for resize events
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Optimized resize handler
    $(window).on('resize', debounce(function() {
        adjustCarouselHeight();
        AOS.refresh();
    }, 250));

    // ========== Accessibility Enhancements ===========
    // Add ARIA labels dynamically
    $('.formation-card').attr('role', 'article');
    $('.stat-card').attr('role', 'contentinfo');
    $('.testimonial-card').attr('role', 'article');

    // Focus management for modals and carousels
    $('.carousel').on('slide.bs.carousel', function() {
        $(this).find('.carousel-item.active').attr('aria-hidden', 'false');
        $(this).find('.carousel-item:not(.active)').attr('aria-hidden', 'true');
    });

    // ========== Enhanced Form Interactions ===========
    $('input, textarea, select').on('focus', function() {
        $(this).parent().addClass('focused');
    }).on('blur', function() {
        $(this).parent().removeClass('focused');
        if ($(this).val()) {
            $(this).parent().addClass('filled');
        } else {
            $(this).parent().removeClass('filled');
        }
    });

    // ========== Reveal Animations on Scroll ===========
    function revealOnScroll() {
        var reveals = $('.reveal');
        
        reveals.each(function() {
            var windowHeight = $(window).height();
            var revealTop = $(this).offset().top;
            var revealPoint = 150;
            
            if ($(window).scrollTop() + windowHeight - revealPoint > revealTop) {
                $(this).addClass('active');
            }
        });
    }

    $(window).on('scroll', debounce(revealOnScroll, 100));
    revealOnScroll(); // Initial check

    // ========== Dynamic Copyright Year ===========
    var currentYear = new Date().getFullYear();
    $('.copyright').html('&copy; ' + currentYear + ' SUPMTI Meknes. Tous droits réservés.');

    // ========== Console Message ===========
    console.log('%c SUPMTI Meknes Website ', 'background: #1e3a8a; color: #fff; font-size: 20px; padding: 10px;');
    console.log('%c Developed with ❤️ ', 'color: #3b82f6; font-size: 14px;');

    // ========== Error Handling ===========
    window.addEventListener('error', function(e) {
        console.error('An error occurred:', e.error);
        // You can send errors to an analytics service here
    });

})(jQuery);

// ========== Vanilla JS Functions (No jQuery) ===========

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js').then(function(registration) {
        //     console.log('ServiceWorker registration successful');
        // }, function(err) {
        //     console.log('ServiceWorker registration failed: ', err);
        // });
    });
}

// Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', 'none');
    document.documentElement.style.setProperty('--transition-normal', 'none');
}

// Page Visibility API - Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('.partners-track').forEach(function(el) {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.partners-track').forEach(function(el) {
            el.style.animationPlayState = 'running';
        });
    }
});

// Network Information API - Adapt content based on connection
if ('connection' in navigator) {
    var connection = navigator.connection;
    
    if (connection.effectiveType === '4g') {
        // High-quality experience
        console.log('High-speed connection detected');
    } else {
        // Optimize for slower connections
        console.log('Optimizing for slower connection');
        // You could disable auto-play videos, reduce image quality, etc.
    }
}

// ========== Custom Events ===========
// Trigger custom event when all sections are loaded
document.addEventListener('DOMContentLoaded', function() {
    var event = new CustomEvent('allSectionsLoaded', {
        detail: { message: 'All page sections have been loaded' }
    });
    document.dispatchEvent(event);
});

// Listen for custom event
document.addEventListener('allSectionsLoaded', function(e) {
    console.log(e.detail.message);
});
