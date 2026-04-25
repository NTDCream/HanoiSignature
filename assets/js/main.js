/* ====================================================
   HANOI SIGNATURE - MAIN JAVASCRIPT
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ---- 1. AOS INIT ----
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            easing: 'ease-in-out',
            once: true,
            offset: 80
        });
    }

    // ---- 2. HEADER SCROLL EFFECT ----
    const header = document.getElementById('header');
    function updateHeader() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // ---- 3. MOBILE HAMBURGER MENU ----
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });
        // Close on link click
        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
            });
        });
    }

    // ---- 4. APARTMENT TABS (old section kept for fallback) ----
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const target = this.dataset.tab;
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            tabPanels.forEach(function (p) { p.classList.remove('active'); });
            this.classList.add('active');
            const panel = document.getElementById('tab-' + target);
            if (panel) panel.classList.add('active');
        });
    });

    // ---- 4B. MẶT BẰNG TẦNG - FLOOR PLAN IMAGE SWITCHER ----
    const matbangTabs = document.querySelectorAll('.matbang-tab');
    const matbangImg = document.getElementById('matbangImg');

    matbangTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            if (this.classList.contains('active')) return;
            const newSrc = this.dataset.img;

            // Deactivate all tabs
            matbangTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');

            // Fade out → swap src → fade in
            if (matbangImg) {
                matbangImg.classList.add('fading');
                setTimeout(function () {
                    matbangImg.src = newSrc;
                    matbangImg.onload = function () {
                        matbangImg.classList.remove('fading');
                    };
                    // Fallback if already cached
                    if (matbangImg.complete) {
                        matbangImg.classList.remove('fading');
                    }
                }, 350);
            }
        });
    });



    // ---- 5. IMAGE SLIDER (ĐÃ CHUYỂN SANG INFINITE MARQUEE CSS — GIỮ LẠI DỰ PHÒNG) ----
    /*
    const slides = document.querySelector('.apartment-slides');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlide;

    function goToSlide(idx) {
        const total = document.querySelectorAll('.apartment-slide').length;
        currentSlide = (idx + total) % total;
        if (slides) {
            slides.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAuto(); });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goToSlide(parseInt(this.dataset.idx));
            resetAuto();
        });
    });

    function startAuto() { autoSlide = setInterval(nextSlide, 4500); }
    function resetAuto() { clearInterval(autoSlide); startAuto(); }
    startAuto();
    */

    // ---- 6. VIDEO PLAYER ----
    const playBtn = document.getElementById('playBtn');
    const videoThumb = document.getElementById('videoThumb');
    const videoIframe = document.getElementById('videoIframe');
    const ytFrame = document.getElementById('ytFrame');
    const YT_VIDEO_ID = 'oMVyMWcUfHo';

    if (playBtn && videoThumb && videoIframe && ytFrame) {
        playBtn.addEventListener('click', function () {
            ytFrame.src = 'https://www.youtube.com/embed/' + YT_VIDEO_ID + '?autoplay=1&rel=0';
            videoThumb.style.display = 'none';
            videoIframe.style.display = 'block';
        });
    }

    // ---- 6B. 360 VIEWER ----
    const play360Btn = document.getElementById('play360Btn');
    const tour360Thumb = document.getElementById('tour360Thumb');
    const tour360Iframe = document.getElementById('tour360Iframe');
    const tour360Frame = document.getElementById('tour360Frame');

    if (play360Btn && tour360Thumb && tour360Iframe && tour360Frame) {
        // PHƯƠNG ÁN 2: Tạm comment mã nguồn xử lý click vì đã cho iframe tự hiện
        /*
        play360Btn.addEventListener('click', function () {
            tour360Frame.src = 'https://hanoisignature.vn/360/';
            tour360Thumb.style.display = 'none';
            tour360Iframe.style.display = 'block';
        });
        */
    }

    // ---- 7. CONTACT FORM UPGRADE (2-STEP + GOOGLE SHEETS) ----
    const contactForm = document.getElementById('contactForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const fproductSelect = document.getElementById('fproduct_select');
    const fproduct = document.getElementById('fproduct');
    const btnNextStep = document.getElementById('btnNextStep');
    const btnBackStep = document.getElementById('btnBackStep');
    const formSuccess = document.getElementById('formSuccess');

    // !!! QUAN TRỌNG: Anh NTD dán URL Web App của Google Apps Script vào đây ạ !!!
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxvQxNiliif9Xhpv8BUdLq6aDoumQ9Y1yd7yHiF2psOEX-TggS8q7QtZj_NFByobGFeg/exec';

    if (contactForm && step1 && step2) {
        // Step 1: Chọn sản phẩm (Dropdown)
        if (fproductSelect) {
            fproductSelect.addEventListener('change', function () {
                if (this.value) {
                    if (fproduct) fproduct.value = this.value;
                    if (btnNextStep) btnNextStep.disabled = false;
                }
            });
        }

        // Chuyển sang Bước 2
        if (btnNextStep) {
            btnNextStep.addEventListener('click', function () {
                step1.classList.remove('active');
                step2.classList.add('active');
                // Scroll nhẹ lên đầu form nếu cần
                const formRect = contactForm.getBoundingClientRect();
                if (formRect.top < 0) {
                    window.scrollTo({ top: window.scrollY + formRect.top - 100, behavior: 'smooth' });
                }
            });
        }

        // Quay lại Bước 1
        if (btnBackStep) {
            btnBackStep.addEventListener('click', function () {
                step2.classList.remove('active');
                step1.classList.add('active');
            });
        }

        // Xử lý gửi Form
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('fname').value.trim();
            const phone = document.getElementById('fphone').value.trim();
            const btnSubmit = document.getElementById('btnSubmit');

            if (!name) { alert('Vui lòng nhập họ và tên!'); return; }
            if (!phone || !/^[0-9]{9,11}$/.test(phone.replace(/[\s\-]/g, ''))) {
                alert('Vui lòng nhập số điện thoại hợp lệ!');
                return;
            }

            // Hiệu ứng đang gửi
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = 'ĐANG GỬI...';
            }

            const formData = new FormData(contactForm);



            // Gửi dữ liệu thật lên Google Sheet
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Google Apps Script yêu cầu no-cors hoặc xử lý OPTIONS
            })
                .then(function () {
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.style.display = 'block';
                })
                .catch(function (error) {
                    console.error('Lỗi gửi form:', error);
                    alert('Có lỗi xảy ra khi gửi thông tin. Anh vui lòng thử lại hoặc gọi Hotline 1900 077 799 ạ!');
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.innerHTML = 'GỬI THÔNG TIN';
                    }
                });
        });
    }

    // ---- 8. SCROLL TO TOP ----
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- 9. SMOOTH SCROLL FOR NAV LINKS ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerH = window.innerWidth <= 768 ? 65 : 90;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ---- 10. FLOATING SIDEBAR HIDE ON MOBILE SCROLL ----
    const floatSidebar = document.getElementById('floatingSidebar');
    let lastScrollY = window.scrollY;
    if (floatSidebar && window.innerWidth <= 768) {
        window.addEventListener('scroll', function () {
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // ---- 11. ACTIVE NAV LINK HIGHLIGHT ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a, .mobile-nav a');
    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(function (section) {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = '#' + section.id;
            }
        });
        navLinks.forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === current) {
                link.style.color = 'var(--gold)';
            }
        });
    }, { passive: true });

    // ---- 12. LIGHTBOX ----
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // Danh sách class ảnh KHÔNG được mở lightbox (logo, icon nhỏ)
    var excludedClasses = ['partner-logo', 'footer-logo', 'contact-logo', 'matbang-logo-sm', 'hero-bg-img', 'art-bg-img', 'contact-bg', 'play-icon', 'scroll-arrow'];

    if (lightboxOverlay && lightboxImg && lightboxClose) {
        // Gán sự kiện click cho mọi thẻ img trên trang
        document.querySelectorAll('img').forEach(function (img) {
            // Bỏ qua ảnh có class nằm trong danh sách loại trừ
            var isExcluded = excludedClasses.some(function (cls) {
                return img.classList.contains(cls);
            });
            // Bỏ qua ảnh quá nhỏ (icon, logo)
            if (isExcluded || img.naturalWidth < 100) return;

            img.addEventListener('click', function (e) {
                e.stopPropagation();
                lightboxImg.src = this.src;
                lightboxOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Đóng lightbox khi bấm nút X
        lightboxClose.addEventListener('click', function () {
            closeLightbox();
        });

        // Đóng lightbox khi bấm vùng tối bên ngoài ảnh
        lightboxOverlay.addEventListener('click', function (e) {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });

        // Đóng lightbox khi bấm phím Esc
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Delay xóa src để animation đóng mượt
            setTimeout(function () {
                lightboxImg.src = '';
            }, 400);
        }
    }

});
