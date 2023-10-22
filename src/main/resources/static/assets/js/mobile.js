var Ustra = Ustra || {};

(function () {
    const toggleList = function (list) {
        for (let i = 0; i < list.length; i++) {
            list[i].addEventListener("click", function (e) {
                for (let j = 0; j < list.length; j++) {
                    list[j].classList.remove("is-active");
                }
                this.classList.add("is-active");
            });
        }
    };

    const toggleTabs = function (tabs, contents) {
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function (e) {
                e.preventDefault();

                for (let j = 0; j < tabs.length; j++) {
                    tabs[j].classList.remove("is-active");
                    contents[j].classList.remove("is-active");
                }
                this.classList.add("is-active");
                console.dir(contents);
                contents[i].classList.add("is-active");
            });
        }
    };

    // left-navbar
    const menuList = document.querySelectorAll(".menu > li, .side-menu-item");
    toggleList(menuList);

    // Tab
    const tabContainers = document.querySelectorAll(".tabs");
    const tabContentContainers = document.querySelectorAll(".tab-contents");
    for (let i = 0; i < tabContainers.length; i++) {
        toggleTabs(tabContainers[i].children, tabContentContainers[i].children);
    }

    // Inbound
    const inbound = document.querySelector(".button.is-mobile-menu");
    const leftNavbar = document.querySelector(".left-navbar");
    if (inbound) {
        inbound.addEventListener("click", function (event) {
            event.stopPropagation();
            leftNavbar.classList.toggle("is-active");
        });
    }

    const page = document.querySelector(".left-navbar-background");
    if (page) {
        page.addEventListener("click", function (event) {
            leftNavbar.classList.remove("is-active");
        });
    }

    // Accordion
    const setAccordion = function () {
        const accordions = document.querySelectorAll(".is-accordion");
        for (let i = 0; i < accordions.length; i++) {
            accordions[i].addEventListener("click", function (event) {
                this.classList.toggle("is-active");
            });
        }
    };

    // Approver
    const setApprover = function () {
        const approverButton = document.querySelectorAll(".buttons.is-approver");
        const approverCard = document.querySelectorAll(".card.is-approver");
        for (let i = 0; i < approverButton.length; i++) {
            approverButton[i].children[0].addEventListener("click", function () {
                approverButton[i].classList.toggle("is-up");
                approverCard[i].classList.toggle("is-active");
            });
        }
    };

    // Dropdown
    const dropdowns = document.querySelectorAll(
        ".control.is-dropdown .inputbox"
    );
    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener("click", function () {
            this.parentElement.classList.toggle("is-active");
        });
    }

    // close modal
    const closeModals = document.querySelectorAll(".click-button.close-modal");
    for (let i = 0; i < closeModals.length; ++i) {
        closeModals[i].addEventListener("click", function () {
            this.closest(".modal").classList.toggle("is-active");
        });
    }

    // close mdi
    const allMdiTabs = document.querySelector(".tabs.is-mdi");
    const allMdiTabContents = document.querySelector(".tab-contents.is-mdi");
    let closeMdis = document.querySelectorAll(".click-button.close-mdi");

    for (let i = 0, j = 0; i < closeMdis.length; ++i) {
        const removeElements = function () {
            allMdiTabs.removeChild(allMdiTabs.children[i]);
            allMdiTabContents.removeChild(allMdiTabContents.children[i]);
            closeMdis = document.querySelectorAll(".click-button.close-mdi");
            ++j;
            console.log(i, j, closeMdis);
        };

        closeMdis[i].addEventListener("click", function (event) {
            event.stopPropagation();

            try {
                removeElements();
            } catch (error) {
                i = i - j;
                removeElements();
            }
        });
    }

    // close all mdis
    // const closeAllMdis = document.querySelector(".click-button.close-all-mdis");
    // closeAllMdis.addEventListener("click", function () {
    //     while (allMdiTabs.children.length) {
    //         allMdiTabs.removeChild(allMdiTabs.lastElementChild);
    //         allMdiTabContents.removeChild(allMdiTabContents.lastElementChild);
    //     }
    // });

    // Input
    const inputReadonly = document.querySelectorAll(
        "input[type='checkbox'][readonly], input[type='radio'][readonly]"
    );
    for (let i = 0; i < inputReadonly.length; i++) {
        inputReadonly[i].addEventListener("click", function (event) {
            event.preventDefault();
            return false;
        });
    }

    // Input auto width
    const controlAutoWidth = document.querySelectorAll(
        ".cotrol.has-auto-width"
    );
    for (let i = 0; i < controlAutoWidth.length; i++) {
        this.dataset.value = this.children[0].value;
    }

    // File input
    const fileInput = document.querySelectorAll(".file-input");
    for (let i = 0; i < fileInput.length; i++) {
        fileInput[i].addEventListener("change", function (e) {
            e.preventDefault();

            const fileList = this.files;
            const controlHasButton = this.parentElement.previousElementSibling;

            controlHasButton.classList.add("has-file");
            controlHasButton.firstElementChild.value = fileList[0].name;
        });
    }

    // On off checkbox
    const onOffCheckbox = document.querySelectorAll(".checkbox.is-on-off input");
    for (let i = 0; i < onOffCheckbox.length; i++) {
        onOffCheckbox[i].addEventListener("change", function (e) {
            e.preventDefault();

            const page = this.closest(".page");
            page.classList.toggle("is-off");
            const input = document.querySelectorAll(".input, .selectbox, .button");
            for (let j = 0; j < input.length; j++) {
                input[j].toggleAttribute("disabled");
            }
        });
    }

    // Deletes a file
    const buttonDeletesFile = document.querySelectorAll(
        ".click-button.delete-file"
    );
    for (let i = 0; i < buttonDeletesFile.length; i++) {
        buttonDeletesFile[i].addEventListener("click", function (e) {
            e.preventDefault();

            const controlHasButton = this.parentElement;
            const inputFileName = this.previousElementSibling;
            const fileInput =
                controlHasButton.nextElementSibling.firstElementChild;

            inputFileName.value = "";
            fileInput.value = "";
            controlHasButton.classList.remove("has-file");
        });
    }

    // Bootstrap-datepicker
    $(".control.is-datepicker input").datepicker({
        format: "yyyy-mm-dd",
        todayHighlight: true,
        templates: {
            leftArrow: '<span class="icon is-calendar-chevron-left is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>',
            rightArrow: '<span class="icon is-calendar-chevron-right is-medium"><svg><use href="#calendar-chevron-left"></use></svg></span>'
        }
    });
    $(".field.is-daterange input").each(function () {
        $(this).datepicker("clearDates");
    });

    // tui-datePicker
    const datePickerContainers = document.querySelectorAll(
        ".tui-datepicker-container"
    );
    const datePickerTargets = document.querySelectorAll(
        ".tui-datepicker-target"
    );
    const datePickers = [];
    for (let i = 0; i < datePickerContainers.length; i++) {
        datePickers[i] = new this.DatePicker(datePickerContainers[i], {
            input: {
                element: datePickerTargets[i]
            }
        });
    }

    // tui-dateRangePicker
    const startPickerContainers = document.querySelectorAll(
        ".tui-startpicker-container"
    );
    const endPickerContainers = document.querySelectorAll(
        ".tui-endpicker-container"
    );
    const startPickerTargets = document.querySelectorAll(
        ".tui-startpicker-target"
    );
    const endPickerTargets = document.querySelectorAll(".tui-endpicker-target");
    const rangePickers = [];
    let today;
    for (let i = 0; i < startPickerContainers.length; i++) {
        today = new Date();
        rangePickers[i] = this.DatePicker.createRangePicker({
            startpicker: {
                date: today,
                input: startPickerTargets[i],
                container: startPickerContainers[i]
            },
            endpicker: {
                date: today,
                input: endPickerTargets[i],
                container: endPickerContainers[i]
            },
            selectableRanges: [
                [
                    today,
                    new Date(
                        today.getFullYear() + 1,
                        today.getMonth(),
                        today.getDate()
                    )
                ]
            ]
        });
    }

    const swiperContainer = document.querySelectorAll(".swiper");
    swiperContainer.forEach((swiper, i) => {
        new Swiper(swiper, {
            spaceBetween: 40,
            scrollbar: {
                el: ".swiper-scrollbar",
                draggable: true
            }
        });
    });

    ['load', 'resize'].forEach(event => {
        window.addEventListener(event, () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    });

    this.setAccordion = setAccordion;
    this.setApprover = setApprover;
}.call(Ustra));
