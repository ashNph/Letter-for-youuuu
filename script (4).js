
"use strict";


document.addEventListener("DOMContentLoaded", () => {
  const pages = Array.from(document.querySelectorAll(".page"));
  const music = document.getElementById("bgMusic");

  const envelope = document.getElementById("openEnvelope");
  const envelopeHint = document.getElementById("envelopeHint");
  const startButton = document.getElementById("startButton");

  const revealHeart = document.getElementById("revealHeart");
  const surpriseCard = document.getElementById("surpriseCard");
  const surpriseHint = document.getElementById("surpriseHint");
  const restartButton = document.getElementById("restartButton");

  const particles = document.getElementById("particles");

  let currentPage = 0;
  let envelopeOpened = false;
  let surpriseRevealed = false;
  let navigationLocked = false;
  let particleTimer = null;

  // Attempt autoplay 3 seconds after the website opens.
  // Browsers may block autoplay with sound until the visitor interacts.
  window.setTimeout(async () => {
    try {
      music.volume = 0.65;
      await music.play();
    } catch (error) {
      console.info("Autoplay was blocked by the browser.");
    }
  }, 3000);

  function showPage(index) {
    if (index < 0 || index >= pages.length) return;
    if (navigationLocked || index === currentPage) return;

    navigationLocked = true;

    const oldPage = pages[currentPage];
    const newPage = pages[index];

    oldPage.classList.remove("leaving");

    // Brief exit animation before showing the next page.
    oldPage.classList.add("leaving");

    window.setTimeout(() => {
      oldPage.classList.remove("active", "leaving");
      oldPage.setAttribute("aria-hidden", "true");

      currentPage = index;

      newPage.classList.add("active");
      newPage.setAttribute("aria-hidden", "false");

      window.scrollTo({ top: 0, behavior: "auto" });

      // Hearts burst whenever a new page opens.
      createParticles(index === 3 ? 18 : 9);

      window.setTimeout(() => {
        navigationLocked = false;
      }, 500);
    }, 180);
  }

  // Play music on an actual user interaction if autoplay was blocked.
  async function tryStartMusic() {
    if (!music.paused) return;

    try {
      await music.play();
    } catch (error) {
      console.info("Music playback is blocked by the browser.");
    }
  }

  // Envelope opening animation.
  function openEnvelope() {
    if (envelopeOpened) {
      showPage(1);
      return;
    }

    envelopeOpened = true;

    envelope.classList.add("open");
    envelope.setAttribute("aria-expanded", "true");

    envelopeHint.textContent = "Para sa'yo talaga 'to, loveee. ❤️";
    startButton.innerHTML = "Read my letter <span>♡</span>";

    // A tap on the envelope may also unlock audio playback.
    tryStartMusic();

    // Heart burst around the envelope.
    createBurst(envelope);

    // Give the envelope animation time to play.
    window.setTimeout(() => {
      showPage(1);
    }, 750);
  }

  envelope.addEventListener("click", openEnvelope);

  startButton.addEventListener("click", () => {
    if (currentPage === 0) {
      openEnvelope();
    } else {
      showPage(1);
    }
  });

  // Next page.
  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => {
      createBurst(button);
      showPage(currentPage + 1);
    });
  });

  // Previous page.
  document.querySelectorAll("[data-prev]").forEach(button => {
    button.addEventListener("click", () => {
      showPage(currentPage - 1);
    });
  });

  // Reveal the final surprise.
  function revealSurprise() {
    if (surpriseRevealed) return;

    surpriseRevealed = true;
    surpriseCard.hidden = false;

    revealHeart.classList.add("revealed");
    revealHeart.setAttribute("aria-expanded", "true");
    revealHeart.setAttribute("aria-label", "Message revealed");

    surpriseHint.textContent = "Hehehe, para sa'yo 'yan. ❤️";

    createBurst(revealHeart);
    createParticles(32);

    // Bring the newly revealed message into view.
    window.setTimeout(() => {
      surpriseCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 150);
  }

  revealHeart.addEventListener("click", revealSurprise);

  // Restart from the cover.
  restartButton.addEventListener("click", () => {
    envelopeOpened = false;
    envelope.classList.remove("open");
    envelope.setAttribute("aria-expanded", "false");

    envelopeHint.textContent = "Tap mo yung envelope, loveee. ♡";
    startButton.innerHTML = "Open your letter <span>♡</span>";

    surpriseRevealed = false;
    surpriseCard.hidden = true;
    revealHeart.classList.remove("revealed");
    revealHeart.setAttribute("aria-expanded", "false");
    revealHeart.setAttribute("aria-label", "Reveal your special message");
    surpriseHint.textContent = "Pindutin mo yung heart. ♡";

    showPage(0);
  });

  // Floating hearts and sparkles.
  function createParticle() {
    if (document.hidden || !particles) return;

    const particle = document.createElement("span");
    const symbols = ["♥", "♡", "✧", "·"];

    particle.className = "particle";
    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = Math.random() * 100 + "vw";
    particle.style.fontSize = (10 + Math.random() * 14) + "px";
    particle.style.animationDuration = (5 + Math.random() * 5) + "s";
    particle.style.opacity = String(0.4 + Math.random() * 0.5);

    particles.appendChild(particle);

    particle.addEventListener("animationend", () => {
      particle.remove();
    }, { once: true });
  }

  function createParticles(count) {
    for (let i = 0; i < count; i++) {
      window.setTimeout(createParticle, i * 100);
    }

    // Keep a gentle background of floating hearts.
    if (!particleTimer) {
      particleTimer = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          createParticle();
        }
      }, 1900);
    }
  }

  // Small burst of hearts from the clicked element.
  function createBurst(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const symbols = ["♥", "♡", "✧"];

    for (let i = 0; i < 14; i++) {
      const bit = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 14;
      const distance = 45 + Math.random() * 65;

      bit.className = "burst-particle";
      bit.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      bit.style.left = centerX + "px";
      bit.style.top = centerY + "px";
      bit.style.fontSize = (12 + Math.random() * 12) + "px";
      bit.style.setProperty("--burst-x", Math.cos(angle) * distance + "px");
      bit.style.setProperty("--burst-y", Math.sin(angle) * distance + "px");

      document.body.appendChild(bit);

      bit.addEventListener("animationend", () => {
        bit.remove();
      }, { once: true });
    }
  }

  // Initialize the cover and accessibility states.
  pages.forEach((page, index) => {
    page.setAttribute("aria-hidden", String(index !== 0));
  });

  createParticles(12);
});
