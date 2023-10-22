Ustra.docReady(function () {
    const toggleTabs = function (tabs, contents) {
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function (e) {
                e.preventDefault();

                for (let j = 0; j < tabs.length; j++) {
                    tabs[j].classList.remove("is-active");
                    contents[j].classList.remove("is-active");
                }
                this.classList.add("is-active");
                contents[i].classList.add("is-active");
            });
        }
    };

    // Menu Tab
    const menuContainers = document.querySelectorAll(".tabs.is-menu");
    const menuContentContainers = document.querySelectorAll(".tab-contents.is-menu");
    for (let i = 0; i < menuContainers.length; i++) {
        toggleTabs(menuContainers[i].children, menuContentContainers[i].children);
    }

    // Regular Tab
    const regularContainers = document.querySelectorAll(".tabs.is-regular, .tabs.is-underline");
    const regularContentContainers = document.querySelectorAll(".tab-contents.is-regular, .tab-contents.is-underline");
    for (let i = 0; i < regularContainers.length; i++) {
        toggleTabs(regularContainers[i].children, regularContentContainers[i].children);
    }

    // Dropdown
    const dropdowns = document.querySelectorAll(".control.is-dropdown .inputbox");
    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener("click", function () {
            this.parentElement.classList.toggle("is-active");
        });
    }

    // Modal popup
    // const items = document.getElementsByClassName("button");

    // for (let i = 0; i < items.length; ++i) {
    //     items[i].addEventListener("click", function () {
    //         for (let val = 0; val < items[i].classList.length; ++val) {
    //             if (items[i].classList[val] == "is-close") {
    //                 this.closest(".modal").classList.toggle("is-active");
    //             }
    //         }
    //     });
    // }

    const swiperContainer = document.querySelectorAll(".swiper");
    const swiperNext = document.querySelectorAll(".swiper-button-next");
    const swiperPrev = document.querySelectorAll(".swiper-button-prev");
    swiperContainer.forEach((swiper, i) => {
        new Swiper(swiper, {
            spaceBetween: 40,
            navigation: {
                nextEl: swiperNext[i],
                prevEl: swiperPrev[i],
            },
        });
    });

    // MDI - Close Button
    if ($(".container.is-mdi").length) {
        const $uiMdi = $(".container.is-mdi"),
            $uiPage = $(".container.is-page"),
            // $uiMdiClose = $uiMdi.find('.button.is-close-window'),
            $uiMdiCollapse = $uiMdi.find(".button.is-download-circle");

        // $uiMdiClose.on('click', function() {
        //     const $uiNavbarHeight = $('.navbar').height();

        //     $uiMdi.addClass('is-deactive').fadeOut(250);
        //     $uiPage.css('height', 'calc(100vh - ' + $uiNavbarHeight + 'rem)');
        // });
        $uiMdiCollapse.on("click", function () {
            const $uiNavbarHeight = $(".navbar").height(),
                $uiPageHeight = $uiMdi.innerHeight() + $uiNavbarHeight;

            if ($uiMdi.hasClass("is-deactive")) {
                $uiMdi.removeClass("is-deactive is-collapse");
                $uiPage.css("height", "calc(100vh - " + $uiPageHeight + "rem)");
            } else {
                $uiMdi.addClass("is-deactive is-collapse");
                $uiPage.css("height", "calc(100vh - " + $uiNavbarHeight + "rem)");
            }
        });
    }
}, document);
