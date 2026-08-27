/**
 * VELORI - Main jQuery Scripts & Interactivity
 */
(function ($) {
    "use strict";

    $(document).ready(function () {
        console.log("Velori Application Initialized with Local jQuery 3.7.1.");

        // 1. Sticky / Scrolled Header Animation
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 50) {
                $("#mainHeader").addClass("scrolled");
            } else {
                $("#mainHeader").removeClass("scrolled");
            }
        });

        // 2. Smooth Scrolling for Anchor Links
        $('a[href^="#"]').on('click', function (e) {
            var href = this.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            var target = $(href);
            if (target.length) {
                e.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 80
                }, 600);
            }
        });

        // 3. Like / Superlike / Dislike Micro-Interactions (for Dashboard cards)
        $(document).on('click', '.btn-card-action', function (e) {
            e.preventDefault();
            var $btn = $(this);
            var $card = $btn.closest('.profile-discover-card');
            
            $btn.addClass('active-pop');
            setTimeout(function() {
                $btn.removeClass('active-pop');
            }, 300);

            if ($btn.hasClass('btn-action-dislike')) {
                $card.addClass('swiped-left');
                setTimeout(function() {
                    $card.fadeOut(300, function() { $(this).remove(); });
                }, 200);
            } else if ($btn.hasClass('btn-action-like')) {
                $card.addClass('swiped-right');
                setTimeout(function() {
                    $card.fadeOut(300, function() { $(this).remove(); });
                }, 200);
            }
        });

        // 4. Initializing Slick Slider for Avatars / Matches if present
        if ($('.slick-likes-carousel').length) {
            $('.slick-likes-carousel').slick({
                dots: false,
                infinite: true,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true,
                prevArrow: '<button type="button" class="slick-prev"><i class="bi bi-chevron-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="bi bi-chevron-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2
                        }
                    }
                ]
            });
        }

        // 5. Mobile Menu Toggle
        $('.mobile-menu-button').on('click', function(e) {
            e.stopPropagation();
            $(this).toggleClass('active');
            $('.nav-links').toggleClass('active');
            var $icon = $(this).find('i');
            if ($('.nav-links').hasClass('active')) {
                $icon.removeClass('bi-list').addClass('bi-x-lg');
            } else {
                $icon.removeClass('bi-x-lg').addClass('bi-list');
            }
        });

        $(document).on('click', function(e) {
            if (!$(e.target).closest('.nav-shell').length) {
                $('.nav-links').removeClass('active');
                $('.mobile-menu-button').removeClass('active').find('i').removeClass('bi-x-lg').addClass('bi-list');
            }
        });

        var yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // Landing lower sections reveal when they enter the viewport, not on page reload.
        function initScrollReveals() {
            var revealItems = document.querySelectorAll(
                '.landing-page .process .section-title, ' +
                '.landing-page .step-card, ' +
                '.landing-page .process__cta, ' +
                '.landing-page .story-banner__content, ' +
                '.landing-page .footer__logo, ' +
                '.landing-page .footer__bottom'
            );

            if (!revealItems.length) {
                return;
            }

            revealItems.forEach(function (item) {
                item.classList.add('reveal-on-scroll');
            });

            if (!('IntersectionObserver' in window)) {
                revealItems.forEach(function (item) {
                    item.classList.add('is-visible');
                });
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.22,
                rootMargin: '0px 0px -8% 0px'
            });

            revealItems.forEach(function (item) {
                observer.observe(item);
            });
        }

        initScrollReveals();

        // Dashboard card action feedback.
        $(document).on('click', '.profile-card__actions button', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $btn = $(this);
            $btn.removeClass('is-burst');
            void this.offsetWidth;
            $btn.addClass('is-burst');

            if (($btn.attr('aria-label') || '').toLowerCase().indexOf('like') !== -1) {
                $btn.toggleClass('is-liked');
            }

            setTimeout(function () {
                $btn.removeClass('is-burst');
            }, 520);
        });

        // 6. Shared dashboard overlays for pages that do not carry the markup inline.
        function getCreditsModalMarkup() {
            return [
                '<div class="modal-backdrop-custom" id="upgradeCreditsModal" aria-hidden="true">',
                    '<div class="credits-modal-card" role="dialog" aria-modal="true" aria-labelledby="modalUpgradeTitle">',
                        '<header class="credits-modal-header">',
                            '<span class="crown-icon" aria-hidden="true"></span>',
                            '<h2 id="modalUpgradeTitle">Upgrade Account</h2>',
                            '<p>Keep conversations going with a <strong>Monthly Credit Bundle</strong> - when it matters</p>',
                            '<button class="credits-modal-close" type="button" aria-label="Close modal" data-close-modal><i class="bi bi-x-lg"></i></button>',
                        '</header>',
                        '<div class="credits-modal-body">',
                            '<div class="pricing-tier-list">',
                                '<article class="pricing-tier-card is-popular">',
                                    '<span class="popular-badge">Most Popular</span>',
                                    '<h4>150 Credits <small>/month</small></h4>',
                                    '<div class="tier-desc">Less than a coffee a day</div>',
                                    '<div class="tier-pricing"><span>19.99 USD monthly</span><strong>0.67 USD/day</strong></div>',
                                '</article>',
                                '<article class="pricing-tier-card">',
                                    '<h4>600 Credits <small>/month</small></h4>',
                                    '<div class="tier-desc">Preferred</div>',
                                    '<div class="tier-pricing"><span>149 USD monthly</span><strong>4.97 USD /day</strong></div>',
                                '</article>',
                                '<article class="pricing-tier-card">',
                                    '<h4>1500 Credits <small>/month</small></h4>',
                                    '<div class="tier-desc">Be fully present</div>',
                                    '<div class="tier-pricing"><span>299 USD monthly</span><strong>9.97 USD /day</strong></div>',
                                '</article>',
                                '<button class="modal-continue-btn" type="button">Continue</button>',
                            '</div>',
                            '<div class="credits-features-col">',
                                '<h3>Discover new ways to connect deeply</h3>',
                                '<div class="credits-features-list">',
                                    '<div class="credit-feature-item"><div class="credit-feature-icon"><i class="bi bi-patch-check-fill"></i></div><div class="credit-feature-text"><h5>Verified members only</h5><p>Meet people who value genuine connections just like you.</p></div></div>',
                                    '<div class="credit-feature-item"><div class="credit-feature-icon"><i class="bi bi-send-fill"></i></div><div class="credit-feature-text"><h5>Get noticed by the right matches</h5><p>Our platform delivers your message to those eager to engage now</p></div></div>',
                                    '<div class="credit-feature-item"><div class="credit-feature-icon"><i class="bi bi-chat-dots-fill"></i></div><div class="credit-feature-text"><h5>Keep all your chats organized</h5><p>Keep messages, emails, and chats organized for smooth conversations</p></div></div>',
                                    '<div class="credit-feature-item"><div class="credit-feature-icon"><i class="bi bi-arrow-repeat"></i></div><div class="credit-feature-text"><h5>Credits reset monthly</h5><p>Spend them on chats, gifts, and video calls for the full experience</p></div></div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<footer class="credits-modal-footer">Click here to see the cost of services. This is a recurring monthly subscription. You can cancel anytime in your Profile Settings.</footer>',
                    '</div>',
                '</div>'
            ].join('');
        }

        function getProfileDropdownMarkup() {
            return [
                '<div class="profile-dropdown-menu" id="profileDropdown">',
                    '<div class="profile-dropdown-user">',
                        '<img src="assets/images/avatars/avatar-alex.jpg" alt="Alex John">',
                        '<h4>Alex John</h4>',
                    '</div>',
                    '<ul class="profile-dropdown-links">',
                        '<li><a href="profile.html"><span>My profile</span> <i class="bi bi-chevron-right"></i></a></li>',
                        '<li><a href="settings.html"><span>Settings</span> <i class="bi bi-chevron-right"></i></a></li>',
                        '<li><a href="help.html"><span>Help Center</span> <i class="bi bi-chevron-right"></i></a></li>',
                        '<li><a href="terms.html"><span>Terms & Conditions</span> <i class="bi bi-chevron-right"></i></a></li>',
                    '</ul>',
                    '<div class="profile-dropdown-logout">',
                        '<a href="login.html"><span>Logout</span> <i class="bi bi-box-arrow-right"></i></a>',
                    '</div>',
                '</div>'
            ].join('');
        }

        function getNotificationPopupMarkup() {
            return [
                '<div class="notif-popup-panel" id="notifPopupPanel">',
                    '<div class="notif-popup-head">',
                        '<h3>Notifications</h3>',
                        '<button class="notif-popup-close" type="button" aria-label="Close notifications"><i class="bi bi-x-lg"></i></button>',
                    '</div>',
                    '<div class="notif-popup-tabs">',
                        '<button class="notif-tab-btn is-active" type="button" data-filter="all">All</button>',
                        '<button class="notif-tab-btn" type="button" data-filter="unread">Unread</button>',
                    '</div>',
                    '<div class="notif-popup-list">',
                        '<div class="notif-popup-item is-unread"><div class="notif-item-avatar"><img src="assets/images/profiles/profile-1.jpg" alt="Alexandra"><span class="notif-badge-icon purple"><i class="bi bi-chat-dots-fill"></i></span></div><div class="notif-item-content"><h5>Alexandra <small>2h ago</small></h5><p>Sent you a message</p><p>Hey, I really enjoyed our last chat! Would love t...</p></div><span class="notif-unread-dot"></span></div>',
                        '<div class="notif-popup-item is-unread"><div class="notif-item-avatar"><img src="assets/images/profiles/profile-2.jpg" alt="Jordan"><span class="notif-badge-icon orange"><i class="bi bi-heart-fill"></i></span></div><div class="notif-item-content"><h5>Jordan liked your photo <small>3h ago</small></h5><p>New match: Emily</p><p>Prompt: Plan a weekend getaway</p></div><span class="notif-unread-dot"></span></div>',
                        '<div class="notif-popup-item is-unread"><div class="notif-item-avatar"><img src="assets/images/profiles/profile-3.jpg" alt="Sam"><span class="notif-badge-icon green"><i class="bi bi-plus"></i></span></div><div class="notif-item-content"><h5>You have a new match! <small>30m ago</small></h5><p>Sam sent you a wink</p><div class="notif-item-actions"><button class="notif-action-btn ignore" type="button">Ignore</button><button class="notif-action-btn reply" type="button">Reply</button></div></div><span class="notif-unread-dot"></span></div>',
                        '<div class="notif-popup-item"><div class="notif-item-avatar"><img src="assets/images/profiles/profile-4.jpg" alt="Maya"><span class="notif-badge-icon"><i class="bi bi-heart-fill"></i></span></div><div class="notif-item-content"><h5>Maya <small>45m ago</small></h5><p>Liked your profile</p></div></div>',
                        '<div class="notif-popup-item"><div class="notif-item-avatar"><img src="assets/images/profiles/profile-5.jpg" alt="New message"><span class="notif-badge-icon purple"><i class="bi bi-chat-dots-fill"></i></span></div><div class="notif-item-content"><h5>New message received <small>10m ago</small></h5><p>Sent you a message</p><p>Looking forward to our date this weekend! Let me...</p></div></div>',
                    '</div>',
                '</div>'
            ].join('');
        }

        function ensureCreditsModal() {
            if (!document.getElementById('upgradeCreditsModal') && document.querySelector('.dashboard-shell')) {
                document.body.insertAdjacentHTML('beforeend', getCreditsModalMarkup());
            }
        }

        function ensureProfileDropdown() {
            var trigger = document.querySelector('.dash-actions > .dash-user');

            if (!trigger || trigger.closest('.dash-user-wrapper') || document.getElementById('profileDropdown')) {
                return;
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'dash-user-wrapper';
            trigger.parentNode.insertBefore(wrapper, trigger);
            wrapper.appendChild(trigger);
            trigger.setAttribute('data-toggle', 'profile-dropdown');
            trigger.setAttribute('aria-expanded', 'false');

            if (trigger.tagName.toLowerCase() !== 'button') {
                trigger.setAttribute('role', 'button');
                trigger.setAttribute('tabindex', '0');
                trigger.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        trigger.click();
                    }
                });
            }

            if (!trigger.querySelector('.bi-chevron-down')) {
                trigger.insertAdjacentHTML('beforeend', '<i class="bi bi-chevron-down"></i>');
            }

            wrapper.insertAdjacentHTML('beforeend', getProfileDropdownMarkup());
        }

        function ensureNotificationPopup() {
            var link = document.querySelector('.dash-actions > a.circle-action[href*="notifications.html"]');

            if (!link || link.closest('.notif-popup-wrapper') || document.getElementById('notifPopupPanel') || !link.querySelector('.bi-bell')) {
                return;
            }

            var wrapper = document.createElement('div');
            var button = document.createElement('button');
            wrapper.className = 'notif-popup-wrapper';
            button.className = link.className;
            button.type = 'button';
            button.setAttribute('data-toggle', 'notif-popup');
            button.setAttribute('aria-label', link.getAttribute('aria-label') || 'Notifications');
            button.innerHTML = link.innerHTML;

            link.parentNode.insertBefore(wrapper, link);
            wrapper.appendChild(button);
            wrapper.insertAdjacentHTML('beforeend', getNotificationPopupMarkup());
            link.remove();
        }

        function ensureDashboardOverlays() {
            ensureCreditsModal();
            ensureNotificationPopup();
            ensureProfileDropdown();
        }

        ensureDashboardOverlays();

        function updatePopupScrollLock() {
            var hasOpenOverlay = $('#upgradeCreditsModal').hasClass('is-open') ||
                $('.notif-popup-panel.is-active, .profile-dropdown-menu.is-active').length > 0;

            $('body').toggleClass('is-popup-scroll-locked', hasOpenOverlay);
        }

        function closeFloatingPopups() {
            $('.notif-popup-panel, .profile-dropdown-menu').removeClass('is-active');
            $('[data-toggle="profile-dropdown"]').attr('aria-expanded', 'false');
            updatePopupScrollLock();
        }

        // 7. Credits / Upgrade Account Modal
        function openCreditsModal() {
            var $modal = $('#upgradeCreditsModal');
            $modal.find('.credits-modal-card').scrollTop(0);
            $modal.addClass('is-open');
            updatePopupScrollLock();
        }

        function closeCreditsModal() {
            $('#upgradeCreditsModal').removeClass('is-open');
            updatePopupScrollLock();
        }

        $(document).on('click', '.upgrade-pill, .premium-box a, .dash-drawer-upgrade, [data-open-modal="credits"], a[href="#upgrade-modal"]', function(e) {
            e.preventDefault();
            openCreditsModal();
        });

        $(document).on('click', '.credits-modal-close, [data-close-modal]', function(e) {
            e.preventDefault();
            closeCreditsModal();
        });

        $(document).on('click', '#upgradeCreditsModal', function(e) {
            if ($(e.target).is('#upgradeCreditsModal')) {
                closeCreditsModal();
            }
        });

        // Pricing tier selection inside Credits modal
        $(document).on('click', '.pricing-tier-card', function() {
            $('.pricing-tier-card').removeClass('is-popular');
            $(this).addClass('is-popular');
        });

        // 8. Profile Dropdown
        $(document).on('click', '[data-toggle="profile-dropdown"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.notif-popup-panel').removeClass('is-active');
            var isActive = $('#profileDropdown').toggleClass('is-active').hasClass('is-active');
            $(this).attr('aria-expanded', isActive ? 'true' : 'false');
            updatePopupScrollLock();
        });

        // 9. Notification Popup Panel
        $(document).on('click', '[data-toggle="notif-popup"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#profileDropdown').removeClass('is-active');
            $('[data-toggle="profile-dropdown"]').attr('aria-expanded', 'false');
            $('#notifPopupPanel').toggleClass('is-active');
            updatePopupScrollLock();
        });

        $(document).on('click', '.notif-popup-close', function(e) {
            e.preventDefault();
            $('#notifPopupPanel').removeClass('is-active');
            updatePopupScrollLock();
        });

        // Notification Filter Tabs
        $(document).on('click', '.notif-tab-btn', function() {
            var $btn = $(this);
            var $scope = $btn.closest('.notif-popup-panel, .notifications-page-card');
            var filter = $btn.data('filter');

            if (!$scope.length) {
                $scope = $(document);
            }

            $scope.find('.notif-tab-btn').removeClass('is-active');
            $btn.addClass('is-active');

            if (filter === 'unread') {
                $scope.find('.notif-popup-item').hide();
                $scope.find('.notif-popup-item.is-unread').show();
            } else {
                $scope.find('.notif-popup-item').show();
            }
        });

        // Global outside click and ESC handler
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.dash-user-wrapper').length) {
                $('#profileDropdown').removeClass('is-active');
                $('[data-toggle="profile-dropdown"]').attr('aria-expanded', 'false');
            }
            if (!$(e.target).closest('.notif-popup-wrapper').length) {
                $('#notifPopupPanel').removeClass('is-active');
            }
            updatePopupScrollLock();
        });

        // Mobile Chat Back Button
        $(document).on('click', '.messages-chat-back', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('body').removeClass('is-chat-open');
        });

        // 10. Settings password visibility toggles
        $(document).on('click', '.settings-password-toggle', function (e) {
            e.preventDefault();
            var $button = $(this);
            var $input = $button.siblings('input');
            var $icon = $button.find('i');
            var isHidden = $input.attr('type') === 'password';

            $input.attr('type', isHidden ? 'text' : 'password');
            $button.attr('aria-label', isHidden ? 'Hide password' : 'Show password');
            $icon.toggleClass('bi-eye', !isHidden);
            $icon.toggleClass('bi-eye-slash', isHidden);
        });

        // 11. Someone profile photo slider
        function initSomeonePhotoSliders(scope) {
            var root = scope || document;
            var sliders = root.querySelectorAll('[data-someone-photo-track]');

            sliders.forEach(function (track) {
                var panel = track.closest('.someone-profile-photos');
                var next = panel ? panel.querySelector('[data-someone-photo-next]') : null;

                if (!next || track.dataset.photoSliderReady === 'true') {
                    return;
                }

                track.dataset.photoSliderReady = 'true';

                next.addEventListener('click', function () {
                    var firstPhoto = track.querySelector('img');
                    var gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 0;
                    var step = firstPhoto ? firstPhoto.getBoundingClientRect().width + gap : track.clientWidth;
                    var maxLeft = track.scrollWidth - track.clientWidth;

                    if (maxLeft <= 2) {
                        return;
                    }

                    if (track.scrollLeft >= maxLeft - 2) {
                        track.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: step, behavior: 'smooth' });
                    }
                });
            });
        }

        initSomeonePhotoSliders();
        window.initSomeonePhotoSliders = initSomeonePhotoSliders;

        // 12. Profile image links for static click-through previews
        document.addEventListener('click', function (event) {
            var image = event.target.closest(
                '.profile-card__photo, ' +
                '.likes-slider__track img, ' +
                '.match-avatar img, ' +
                '.mobile-match-strip img, ' +
                '.message-match-item img'
            );

            if (!image) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            window.location.href = 'someone-profile.html';
        }, true);

        // 13. Global Velori custom select dropdowns
        function closeVeloriSelects(except) {
            document.querySelectorAll('.velori-select.is-open').forEach(function (wrap) {
                if (wrap !== except) {
                    wrap.classList.remove('is-open');
                    wrap.classList.remove('is-up');
                    var button = wrap.querySelector('.velori-select__button');
                    if (button) {
                        button.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }

        function setVeloriSelectDirection(wrapper) {
            var button = wrapper.querySelector('.velori-select__button');
            var menu = wrapper.querySelector('.velori-select__menu');

            if (!button || !menu) {
                return;
            }

            wrapper.classList.remove('is-up');
            var rect = button.getBoundingClientRect();
            var menuHeight = Math.min(menu.scrollHeight || 218, 218);
            var spaceBelow = window.innerHeight - rect.bottom;
            var spaceAbove = rect.top;

            if (spaceBelow < menuHeight + 14 && spaceAbove > spaceBelow) {
                wrapper.classList.add('is-up');
            }
        }

        function initVeloriSelects(scope) {
            var root = scope || document;
            var selects = root.querySelectorAll('select.js-velori-select');

            selects.forEach(function (select) {
                if (select.dataset.veloriSelectReady === 'true' || select.closest('.velori-select')) {
                    return;
                }

                var wrapper = document.createElement('div');
                var button = document.createElement('button');
                var menu = document.createElement('div');
                var selectedOption = select.options[select.selectedIndex] || select.options[0];
                var menuId = 'velori-select-menu-' + Math.random().toString(36).slice(2);

                select.dataset.veloriSelectReady = 'true';
                wrapper.className = 'velori-select';
                button.className = 'velori-select__button';
                button.type = 'button';
                button.setAttribute('aria-haspopup', 'listbox');
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('aria-controls', menuId);
                button.textContent = selectedOption ? selectedOption.textContent : '';

                menu.className = 'velori-select__menu';
                menu.id = menuId;
                menu.setAttribute('role', 'listbox');

                Array.prototype.forEach.call(select.options, function (option) {
                    if (option.disabled) {
                        return;
                    }

                    var item = document.createElement('button');
                    item.className = 'velori-select__option';
                    item.type = 'button';
                    item.setAttribute('role', 'option');
                    item.textContent = option.textContent;

                    if (option.selected) {
                        item.classList.add('is-selected');
                        item.setAttribute('aria-selected', 'true');
                    } else {
                        item.setAttribute('aria-selected', 'false');
                    }

                    item.addEventListener('click', function () {
                        select.value = option.value;
                        button.textContent = option.textContent;
                        menu.querySelectorAll('.velori-select__option').forEach(function (choice) {
                            choice.classList.remove('is-selected');
                            choice.setAttribute('aria-selected', 'false');
                        });
                        item.classList.add('is-selected');
                        item.setAttribute('aria-selected', 'true');
                        wrapper.classList.remove('is-open');
                        wrapper.classList.remove('is-up');
                        button.setAttribute('aria-expanded', 'false');
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    });

                    menu.appendChild(item);
                });

                select.parentNode.insertBefore(wrapper, select);
                wrapper.appendChild(select);
                wrapper.appendChild(button);
                wrapper.appendChild(menu);

                button.addEventListener('click', function () {
                    var isOpen = wrapper.classList.toggle('is-open');
                    closeVeloriSelects(wrapper);
                    if (isOpen) {
                        setVeloriSelectDirection(wrapper);
                    } else {
                        wrapper.classList.remove('is-up');
                    }
                    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                });
            });
        }

        initVeloriSelects();

        window.initVeloriSelects = initVeloriSelects;

        window.addEventListener('scroll', function () {
            document.querySelectorAll('.velori-select.is-open').forEach(setVeloriSelectDirection);
        }, true);

        window.addEventListener('resize', function () {
            document.querySelectorAll('.velori-select.is-open').forEach(setVeloriSelectDirection);
        });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('.velori-select')) {
                closeVeloriSelects();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeVeloriSelects();
                closeCreditsModal();
                closeFloatingPopups();
            }
        });
        // ---------------------------------------------------------
        // Chat Interaction System
        // ---------------------------------------------------------
        var $chatForm = $('#chatForm');
        var $chatInput = $('#chatInput');
        var $chatBody = $('#chatBody');

        if ($chatForm.length && $chatBody.length) {
            function scrollChatToBottom() {
                $chatBody.scrollTop($chatBody[0].scrollHeight);
            }

            scrollChatToBottom();

            $chatForm.on('submit', function(e) {
                e.preventDefault();
                var msgText = $chatInput.val().trim();
                if (msgText === '') return;

                var outgoingHtml = '<div class="chat-row outgoing"><p>' + $('<div>').text(msgText).html() + '</p></div>';
                $chatBody.append(outgoingHtml);
                $chatInput.val('');
                scrollChatToBottom();

                setTimeout(function() {
                    var typingHtml = '<div class="chat-row incoming short typing-box"><img src="assets/images/avatars/avatar-isabella.jpg" alt="Isabella"><p class="typing-indicator"><span></span><span></span><span></span></p></div>';
                    $chatBody.append(typingHtml);
                    scrollChatToBottom();

                    setTimeout(function() {
                        $chatBody.find('.typing-box').remove();
                        var replies = [
                            "Oh that sounds amazing! Tell me more 😊",
                            "Haha you're so right!",
                            "Wow! I didn't know that.",
                            "Let me check my calendar and get back to you.",
                            "Exactly what I was thinking!"
                        ];
                        var randomReply = replies[Math.floor(Math.random() * replies.length)];
                        var incomingHtml = '<div class="chat-row incoming wide"><img src="assets/images/avatars/avatar-isabella.jpg" alt="Isabella"><p>' + randomReply + '</p></div>';
                        $chatBody.append(incomingHtml);
                        scrollChatToBottom();
                    }, 1500);

                }, 400);
            });
        }

        // ---------------------------------------------------------
        // Form Validation System
        // ---------------------------------------------------------
        function showError(input, message) {
            var $input = $(input);
            var $parent = $input.closest('.form-group, .edit-field, .password-field, .photo-upload-container, .edit-date-grid').first();
            
            if ($parent.hasClass('password-field') || $parent.hasClass('edit-date-grid')) {
                $parent = $parent.closest('.form-group, .edit-field');
            }

            $input.addClass('is-invalid');
            
            var $error = $parent.find('.error-msg');
            if ($error.length === 0) {
                $parent.append('<div class="error-msg"></div>');
                $error = $parent.find('.error-msg');
            }
            $error.text(message).slideDown(200);
        }

        function clearError(input) {
            var $input = $(input);
            var $parent = $input.closest('.form-group, .edit-field, .password-field, .photo-upload-container, .edit-date-grid').first();
            
            if ($parent.hasClass('password-field') || $parent.hasClass('edit-date-grid')) {
                $parent = $parent.closest('.form-group, .edit-field');
            }

            $input.removeClass('is-invalid');
            // Ensure no other invalid inputs remain in the same group before clearing the error message
            if ($parent.find('.is-invalid').length === 0) {
                $parent.find('.error-msg').slideUp(200, function() {
                    $(this).remove();
                });
            }
        }

        function checkRequired(inputArray) {
            var isValid = true;
            inputArray.forEach(function(input) {
                var $el = $(input);
                if ($el.length && ($el.val() === null || $el.val().trim() === '')) {
                    showError(input, 'This field is required');
                    isValid = false;
                } else if ($el.length) {
                    clearError(input);
                }
            });
            return isValid;
        }

        function checkEmail(input) {
            var $el = $(input);
            if (!$el.length) return true;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test($el.val().trim())) {
                clearError(input);
                return true;
            } else {
                showError(input, 'Email is not valid');
                return false;
            }
        }

        function checkPasswordsMatch(input1, input2) {
            var $el1 = $(input1), $el2 = $(input2);
            if ($el1.length && $el2.length && $el1.val() !== $el2.val()) {
                showError(input2, 'Passwords do not match');
                return false;
            }
            return true;
        }

        // Event Listeners for Forms
        $('#loginForm').on('submit', function(e) {
            var isReq = checkRequired(['#loginEmail', '#loginPassword']);
            var isEm = isReq ? checkEmail('#loginEmail') : false;
            if(!isReq || !isEm) e.preventDefault();
        });

        $('#registerForm').on('submit', function(e) {
            var isReq = checkRequired(['#regName', '#regEmail', '#regDay', '#regMonth', '#regYear']);
            var isEm = isReq ? checkEmail('#regEmail') : false;
            if(!isReq || !isEm) e.preventDefault();
        });

        $('#forgotForm').on('submit', function(e) {
            var isReq = checkRequired(['#forgotEmail']);
            var isEm = isReq ? checkEmail('#forgotEmail') : false;
            if(!isReq || !isEm) e.preventDefault();
        });

        $('#resetForm').on('submit', function(e) {
            var isReq = checkRequired(['#resetPassword1', '#resetPassword2']);
            var isMatch = isReq ? checkPasswordsMatch('#resetPassword1', '#resetPassword2') : false;
            if(!isReq || !isMatch) e.preventDefault();
        });

        $('#editProfileForm').on('submit', function(e) {
            var isReq = checkRequired(['#editName', '#editBio']);
            if(!isReq) e.preventDefault();
        });
        
        $('input, select, textarea').on('input change', function() {
            clearError(this);
        });

        // 20. Edit Profile Image Upload Preview
        var mainAvatarInput = document.getElementById('mainAvatarInput');
        var mainAvatarTrigger = document.getElementById('mainAvatarTrigger');
        var mainAvatarPreview = document.getElementById('mainAvatarPreview');

        if (mainAvatarInput && mainAvatarTrigger && mainAvatarPreview) {
            mainAvatarTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                mainAvatarInput.click();
            });

            mainAvatarInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        mainAvatarPreview.src = e.target.result;
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }

        var extraPhotoInput = document.getElementById('extraPhotoInput');
        var extraPhotoTrigger = document.getElementById('extraPhotoTrigger');
        var extraPhotoGrid = document.querySelector('.edit-photo-grid');

        if (extraPhotoInput && extraPhotoTrigger && extraPhotoGrid) {
            extraPhotoTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                extraPhotoInput.click();
            });

            extraPhotoInput.addEventListener('change', function(e) {
                if (this.files) {
                    Array.from(this.files).forEach(function(file) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var newPhotoHtml = `
                                <div>
                                    <article class="my-profile-photo">
                                        <img src="${e.target.result}" alt="New photo">
                                        <span>Public</span>
                                    </article>
                                    <button class="delete-photo" type="button">DELETE</button>
                                </div>
                            `;
                            // Insert before the add button container
                            $(extraPhotoTrigger).before(newPhotoHtml);
                        }
                        reader.readAsDataURL(file);
                    });
                }
            });

            // Handle delete
            $(document).on('click', '.delete-photo', function(e) {
                $(this).closest('div').fadeOut(300, function() {
                    $(this).remove();
                });
            });
        }
    });

})(jQuery);
