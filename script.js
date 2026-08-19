    const topbar = document.getElementById("topbar");
    const navToggle = document.getElementById("navToggle");
    const workMenu = document.getElementById("workMenu");
    const workTrigger = document.getElementById("workTrigger");
    const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
    const workIds = ["ir", "pr", "website", "digital", "design", "event", "operations"];
    const workSectionIds = new Set(workIds);
    const workSections = workIds.map(id => document.getElementById(id)).filter(Boolean);
    const workTabs = Array.from(document.querySelectorAll("[data-work-target]"));
    const workIndex = document.getElementById("work");
    const workStage = document.getElementById("workStage");
    workSections.forEach(section => {
      if (workStage) workStage.appendChild(section);
    });

    const companyTimeline = ["모바휠", "미건라이프사이언스", "마이링크", "파멥신"];
    document.querySelectorAll(".project-grid").forEach(grid => {
      const cards = Array.from(grid.querySelectorAll(":scope > .project-card"));
      const rank = card => {
        const companyText = card.querySelector(".project-info span")?.textContent || "";
        const index = companyTimeline.findIndex(company => companyText.includes(company));
        return index < 0 ? companyTimeline.length : index;
      };
      cards.sort((a, b) => rank(a) - rank(b)).forEach(card => grid.appendChild(card));
    });

    document.querySelectorAll(".project-card").forEach(card => {
      const info = card.querySelector(".project-info");
      const gallery = card.querySelector(".series-gallery");
      if (!info) return;

      const fold = document.createElement("details");
      fold.className = gallery ? "portfolio-fold has-gallery" : "portfolio-fold text-only";

      const summary = document.createElement("summary");
      const companyGroup = document.createElement("div");
      companyGroup.className = "fold-company-group";
      const companyMeta = info.querySelector("span")?.textContent?.trim() || "PROJECT";
      const metaDivider = " · ";
      const dividerIndex = companyMeta.indexOf(metaDivider);
      const companyName = dividerIndex > -1 ? companyMeta.slice(0, dividerIndex) : companyMeta;
      const projectPeriod = dividerIndex > -1 ? companyMeta.slice(dividerIndex + metaDivider.length) : "";
      const company = document.createElement("span");
      company.className = "fold-company";
      company.textContent = companyName;
      companyGroup.appendChild(company);
      if (projectPeriod) {
        const period = document.createElement("span");
        period.className = "fold-period";
        period.textContent = projectPeriod;
        companyGroup.appendChild(period);
      }
      const kind = document.createElement("span");
      kind.className = "fold-kind";
      kind.textContent = card.querySelector(".channel-link-gallery") ? "운영 채널 펼쳐보기" : gallery ? "작업물 펼쳐보기" : "업무 내용 펼쳐보기";
      companyGroup.appendChild(kind);

      const title = document.createElement("div");
      title.className = "fold-title";
      const heading = document.createElement("h3");
      heading.textContent = info.querySelector("h3")?.textContent || "대표 작업";
      title.appendChild(heading);

      const toggle = document.createElement("span");
      toggle.className = "fold-toggle";
      toggle.setAttribute("aria-hidden", "true");
      summary.append(companyGroup, title, toggle);

      const body = document.createElement("div");
      body.className = "portfolio-fold-body";
      const copy = document.createElement("p");
      copy.className = "fold-description";
      copy.textContent = info.querySelector("p")?.textContent || "";
      body.appendChild(copy);
      if (gallery) body.appendChild(gallery);
      fold.append(summary, body);
      card.replaceWith(fold);
    });

    document.querySelectorAll(".series-images").forEach((slider, sliderIndex) => {
      const slides = Array.from(slider.querySelectorAll(":scope > .series-image"));
      if (!slides.length) return;

      const groupTitle = slider.closest(".series-group")?.querySelector(".series-head strong")?.textContent?.trim() || `작업물 ${sliderIndex + 1}`;
      let current = 0;
      slider.classList.add("slider-ready");
      slider.setAttribute("role", "region");
      slider.setAttribute("aria-roledescription", "carousel");
      slider.setAttribute("aria-label", `${groupTitle} 이미지 슬라이드`);

      const updateSlides = nextIndex => {
        current = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
          const active = index === current;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
          slide.tabIndex = active ? 0 : -1;
        });
        slider.querySelectorAll(".slider-dot").forEach((dot, index) => {
          const active = index === current;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-current", active ? "true" : "false");
        });
        const currentLabel = slider.querySelector(".slider-current");
        if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, "0");
      };

      slides.forEach((slide, index) => {
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${index + 1} / ${slides.length}`);
      });

      if (slides.length === 1) {
        slider.classList.add("slider-single");
        updateSlides(0);
        return;
      }

      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "slider-control slider-prev";
      previous.setAttribute("aria-label", "이전 이미지");
      previous.textContent = "←";

      const next = document.createElement("button");
      next.type = "button";
      next.className = "slider-control slider-next";
      next.setAttribute("aria-label", "다음 이미지");
      next.textContent = "→";

      const dots = document.createElement("div");
      dots.className = "slider-dots";
      dots.setAttribute("aria-label", "이미지 선택");
      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", `${index + 1}번째 이미지 보기`);
        dot.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          updateSlides(index);
        });
        dots.appendChild(dot);
      });

      const meta = document.createElement("div");
      meta.className = "slider-meta";
      meta.setAttribute("aria-live", "polite");
      meta.innerHTML = `<span class="slider-current">01</span><span>/</span><span>${String(slides.length).padStart(2, "0")}</span>`;

      previous.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        updateSlides(current - 1);
      });
      next.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        updateSlides(current + 1);
      });
      slider.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          updateSlides(current - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          updateSlides(current + 1);
        }
      });

      let touchStartX = null;
      slider.addEventListener("touchstart", event => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
      }, { passive: true });
      slider.addEventListener("touchend", event => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchEndX - touchStartX;
        touchStartX = null;
        if (Math.abs(distance) < 42) return;
        updateSlides(distance > 0 ? current - 1 : current + 1);
      }, { passive: true });

      slider.append(previous, next, dots, meta);
      updateSlides(0);
    });

    document.querySelectorAll(".document-card").forEach(card => {
      const fold = document.createElement("details");
      fold.className = "document-fold";
      const summary = document.createElement("summary");
      const label = document.createElement("span");
      label.textContent = card.querySelector("span")?.textContent || "DOCUMENT";
      const heading = document.createElement("h3");
      heading.textContent = card.querySelector("h3")?.textContent || "문서관리";
      summary.append(label, heading);
      const body = document.createElement("div");
      body.className = "document-fold-body";
      const copy = document.createElement("p");
      copy.textContent = card.querySelector("p")?.textContent || "";
      body.appendChild(copy);
      fold.append(summary, body);
      card.replaceWith(fold);
    });

    document.querySelectorAll(".project-grid").forEach(grid => {
      const folds = Array.from(grid.querySelectorAll(":scope > .portfolio-fold"));
      folds.forEach(fold => fold.addEventListener("toggle", () => {
        if (fold.open) folds.forEach(item => { if (item !== fold) item.open = false; });
      }));
    });

    document.querySelectorAll(".document-grid").forEach(grid => {
      const folds = Array.from(grid.querySelectorAll(":scope > .document-fold"));
      folds.forEach(fold => fold.addEventListener("toggle", () => {
        if (fold.open) folds.forEach(item => { if (item !== fold) item.open = false; });
      }));
    });

    const sections = Array.from(document.querySelectorAll("[data-section]"));
    const accordions = Array.from(document.querySelectorAll(".work-accordion"));

    function activateWork(id, shouldScroll = false) {
      if (!workSectionIds.has(id)) return;
      workSections.forEach(section => {
        const active = section.id === id;
        section.classList.toggle("work-active", active);
        section.hidden = !active;
        const accordion = section.querySelector(".work-accordion");
        if (accordion) accordion.open = active;
        if (active) section.querySelectorAll(".reveal").forEach(item => item.classList.add("visible"));
      });
      workTabs.forEach(tab => {
        const active = tab.dataset.workTarget === id;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      navLinks.forEach(link => link.classList.toggle("active", link.dataset.nav === id));
      workTrigger.classList.add("active");
      if (shouldScroll && workIndex) {
        workIndex.scrollIntoView({ block: "start" });
        window.history.replaceState(null, "", `#${id}`);
      }
    }

    function scrollToTarget(id) {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }

    function closeMenu() {
      topbar.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "메뉴 열기");
      workMenu.classList.remove("open");
      workTrigger.setAttribute("aria-expanded", "false");
    }

    navToggle.addEventListener("click", () => {
      const open = !topbar.classList.contains("open");
      topbar.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });

    workTrigger.addEventListener("click", () => {
      const open = !workMenu.classList.contains("open");
      workMenu.classList.toggle("open", open);
      workTrigger.setAttribute("aria-expanded", String(open));
    });

    navLinks.forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      if (workSectionIds.has(link.dataset.nav)) {
        activateWork(link.dataset.nav, true);
      } else {
        scrollToTarget(link.dataset.nav);
      }
      closeMenu();
    }));

    document.querySelectorAll('a[href^="#"]:not([data-nav])').forEach(link => {
      link.addEventListener("click", event => {
        const id = link.getAttribute("href")?.slice(1);
        if (!id || !document.getElementById(id)) return;
        event.preventDefault();
        scrollToTarget(id);
        closeMenu();
      });
    });

    workTabs.forEach(tab => tab.addEventListener("click", () => {
      activateWork(tab.dataset.workTarget);
      if (window.innerWidth <= 980) {
        tab.scrollIntoView({ block: "nearest", inline: "center" });
      }
    }));

    const initialWork = workSectionIds.has(location.hash.slice(1)) ? location.hash.slice(1) : "ir";
    activateWork(initialWork);

    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => link.classList.toggle("active", link.dataset.nav === visible.target.id));
      workTrigger.classList.toggle("active", workSectionIds.has(visible.target.id));
    }, { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.2] });
    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (!workMenu.contains(event.target)) {
        workMenu.classList.remove("open");
        workTrigger.setAttribute("aria-expanded", "false");
      }
    });
