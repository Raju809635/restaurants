"use client";

import { type MutableRefObject, type RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseHeroScrollOptions = {
  rootRef: RefObject<HTMLElement>;
  introRef: RefObject<HTMLElement>;
  stageRef: RefObject<HTMLElement>;
  progressRef: MutableRefObject<number>;
};

export function useHeroScroll({
  rootRef,
  introRef,
  stageRef,
  progressRef
}: UseHeroScrollOptions) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const intro = introRef.current;
    const stage = stageRef.current;

    if (!root || !intro || !stage) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-story-card]");
      const statItems = gsap.utils.toArray<HTMLElement>("[data-stat-item]");

      gsap.fromTo(
        intro.children,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08
        }
      );

      gsap.fromTo(
        statItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.3
        }
      );

      gsap.to(intro, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      gsap.to(stage, {
        yPercent: -8,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0.28, y: 48, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 78%",
              end: "top 44%",
              scrub: true
            }
          }
        );

        const visual = card.querySelector<HTMLElement>("[data-card-glow]");
        if (visual) {
          gsap.to(visual, {
            rotate: index % 2 === 0 ? 8 : -8,
            xPercent: index % 2 === 0 ? 8 : -8,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          root.style.setProperty("--hero-progress", self.progress.toFixed(3));
        }
      });
    }, root);

    return () => ctx.revert();
  }, [introRef, progressRef, rootRef, stageRef]);
}
