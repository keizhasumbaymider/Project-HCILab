const carousel = document.querySelector(".carousel");
const nav = document.querySelector("nav");
const open = document.querySelectorAll(".store-card");
const close = document.querySelectorAll(".close");
const modals = document.querySelectorAll(".modal-container");
const slide = document.querySelectorAll(".slide");
const slides = document.querySelector(".slides");
const slider = document.querySelector(".slider");
const newsSlides = document.querySelector(".news-slides");
const newsCards = document.querySelectorAll(".news-card");
const nextBtn = document.querySelector(".news-next");
const prevBtn = document.querySelector(".news-prev");
const newsNumber = document.querySelector(".news-number");
const popup = document.getElementById("newsletterPopup");
const closePopup = document.getElementById("closePopup");
const eventNextBtn = document.querySelector(".next");
const eventPrevBtn = document.querySelector(".prev");

let newsIndex = 0;
let index = 0;
let scrollAmount = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

function autoScroll() {
    scrollAmount += 1;

    carousel.scrollLeft = scrollAmount;

    if (scrollAmount >= carousel.scrollWidth / 2) {
        scrollAmount = 0;
    }
}

if (carousel) {
    setInterval(autoScroll, 20);
}

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

open.forEach(card => {
    card.addEventListener("click", () => {
        const modalId = card.dataset.modal;
        const modal = document.getElementById(modalId);
        modal.classList.add("show");
    });
});

close.forEach(button => {
    button.addEventListener("click", () => {
        button.closest(".modal-container").classList.remove("show");
    });
});

modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".store-card");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.4
    });
    cards.forEach((card) => {
        observer.observe(card);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".store-card");
    const categories = document.querySelectorAll(".category-item");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.8
    });
    categories.forEach((category) => {
        observer.observe(category);
    });
});

const updateSlidePosition = () => {
    const width = slider.clientWidth;
    currentTranslate = -index * width;
    prevTranslate = currentTranslate;
    slides.style.transform = `translateX(${currentTranslate}px)`;
};

function showSlide() {
    slides.style.transition = "transform 0.8s ease-in-out";
    updateSlidePosition();
}

if (eventNextBtn) {
    eventNextBtn.addEventListener("click", () => {
        index++;
        if (index >= slide.length) {
            index = 0;
        }
        showSlide();
    });
}

if (eventPrevBtn) {
    eventPrevBtn.addEventListener("click", () => {
        index--;
        if (index < 0) {
            index = slide.length - 1;
        }
        showSlide();
    });
}

const dragStart = (event) => {
    if (!slider || event.target.closest("button")) return;
    event.preventDefault();
    isDragging = true;
    startPos = event.clientX;
    prevTranslate = currentTranslate;
    slider.setPointerCapture(event.pointerId);
    slides.style.transition = "none";
};

const dragMove = (event) => {
    if (!isDragging) return;
    const movement = event.clientX - startPos;
    currentTranslate = prevTranslate + movement;
    slides.style.transform = `translateX(${currentTranslate}px)`;
};

const dragEnd = (event) => {
    if (!isDragging || !slider) return;
    isDragging = false;
    if (event && event.pointerId !== undefined) {
        slider.releasePointerCapture(event.pointerId);
    }

    const width = slider.clientWidth;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -width / 4) {
        index = (index + 1) % slide.length;
    } else if (movedBy > width / 4) {
        index = (index - 1 + slide.length) % slide.length;
    }
    showSlide();
};

if (slider) {
    slider.addEventListener("pointerdown", dragStart);
    slider.addEventListener("pointermove", dragMove);
    slider.addEventListener("pointerup", dragEnd);
    slider.addEventListener("pointerleave", dragEnd);
    slider.addEventListener("pointercancel", dragEnd);
    slider.addEventListener("dragstart", (event) => event.preventDefault());
    showSlide();
}

function updateNewsSlider() {
    newsSlides.style.transform = `translateX(-${newsIndex * 100}%)`;
    newsNumber.textContent = `${newsIndex + 1} / ${newsCards.length}`;
}

if (newsSlides && nextBtn && prevBtn && newsNumber) {
    updateNewsSlider();
    nextBtn.addEventListener("click", () => {
        newsIndex++;
        if (newsIndex >= newsCards.length) {
            newsIndex = 0;
        }
        updateNewsSlider();
    });
    prevBtn.addEventListener("click", () => {
        newsIndex--;
        if (newsIndex < 0) {
            newsIndex = newsCards.length - 1;
        }
        updateNewsSlider();
    });
}

function showPopupPeriodically() {
    setTimeout(() => {
        popup.classList.add("show");
    }, 2500);
    setInterval(() => {
        popup.classList.add("show");
    }, 150000);
}

showPopupPeriodically();

closePopup.addEventListener("click", () => {
    popup.classList.remove("show");
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("show");
    }
});

const newsLetterForms = document.querySelectorAll(".newsletter-popup form");
newsLetterForms.forEach(form => {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        popup.classList.remove("show");
    });
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("#") && href !== window.location.pathname) {
            e.preventDefault();
            document.body.classList.add("fade-out");
            setTimeout(() => {
                window.location.href = href;
            }, 700);
        }
    });
});