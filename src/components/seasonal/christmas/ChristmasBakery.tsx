"use client";

import Image from "next/image";
import christmasPoster from "../../../../public/images/christmas-bakery.png";
import originalPoster from "../../../../public/images/christmas-bakery-original.png";
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CHRISTMAS_BAKERY_VIEW } from "@/lib/christmas";
import { BAKERY_SCALE } from "@/lib/christmas-bakery";
import type { ChristmasSceneController, SceneTarget } from "./ChristmasScene";
import styles from "./ChristmasBakery.module.css";

const TARGETS = ["tree-0", "tree-1", "tree-2", "present-0", "present-1", "present-2", "fence", "logs", "lantern", "sapling", "signpost", "oven", "starter", "bell", "bread", "snowman"] as const;
const LABELS: Record<string, string> = {
  bread: "Put the bread in the oven",
  snowman: "Put the snowman in the oven",
  "tree-0": "Move the Christmas tree",
  "tree-1": "Move the little fir tree",
  "tree-2": "Move the snowy fir tree",
  "present-0": "Move the red present",
  "present-1": "Move the green present",
  "present-2": "Move the cream present",
  fence: "Move the snowy fence",
  logs: "Move the firewood",
  lantern: "Move the lantern",
  sapling: "Move the little fir",
  signpost: "Move the bakery sign",
  oven: "Bake the bread",
  starter: "Feed the starter",
  bell: "Ring the bell",
};

const DESKTOP_QUERY = "(min-width: 64rem)";

function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getDesktopViewport() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function subscribeHouseSize(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getHouseSize() {
  return new URLSearchParams(window.location.search).get("house") === "larger" ? "larger" : "original";
}

type BakeryVariant = "corner" | "full";

export default function ChristmasBakery({ variant = "full" }: { variant?: BakeryVariant }) {
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktopViewport, () => false);
  const houseSize = useSyncExternalStore(subscribeHouseSize, getHouseSize, () => "original" as const);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!desktop && variant === "corner")) return null;

  const poster = (
    <Image
      src={houseSize === "original" ? originalPoster : christmasPoster}
      alt="A miniature Christmas bakery, with a loaf, snowy trees and a snowman."
      fill
      sizes={variant === "corner" ? "680px" : "(max-width: 767px) 100vw, 1000px"}
      className={styles.poster}
    />
  );

  if (!desktop) return <div className={`${styles.bakery} ${styles.fullBakery}`}>{poster}</div>;

  return (
    <DesktopBakery variant={variant} houseSize={houseSize} onDismiss={() => setDismissed(true)}>
      {poster}
    </DesktopBakery>
  );
}

function DesktopBakery({ variant, houseSize, onDismiss, children }: {
  variant: BakeryVariant;
  houseSize: ReturnType<typeof getHouseSize>;
  onDismiss: () => void;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ChristmasSceneController | null>(null);
  const targetsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const resetRef = useRef<HTMLButtonElement>(null);
  const inViewRef = useRef(true);
  const nearTopRef = useRef(variant === "full");

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let fallbackId: ReturnType<typeof setTimeout> | undefined;
    let scrollFrame = 0;
    let loadRequested = false;
    let pageLoaded = document.readyState === "complete";
    const cleanups: (() => void)[] = [];
    const cleanupScene = () => cleanups.splice(0).reverse().forEach((cleanup) => cleanup());

    function updateTargets(targets: SceneTarget[]) {
      if (cancelled) return;
      const visible = new Set(targets.map((target) => target.id));
      for (const id of TARGETS) {
        const button = targetsRef.current[id];
        if (!button) continue;
        button.hidden = !visible.has(id);
        if (button.hidden && document.activeElement === button) resetRef.current?.focus({ preventScroll: true });
      }
      for (const target of targets) {
        const button = targetsRef.current[target.id];
        if (!button) continue;
        button.style.left = `${target.x}px`;
        button.style.top = `${target.y}px`;
        button.style.width = `${target.width}px`;
        button.style.height = `${target.height}px`;
        button.setAttribute("aria-label", target.label);
      }
      targets.filter((target) => target.id.startsWith("tree-")).sort((a, b) => (a.y + a.height) - (b.y + b.height)).forEach((target, index) => {
        const button = targetsRef.current[target.id];
        if (button) button.style.zIndex = String(index + 1);
      });
    }

    async function loadScene() {
      idleId = undefined;
      fallbackId = undefined;
      if (cancelled || !nearTopRef.current || !getDesktopViewport()) {
        loadRequested = false;
        return;
      }
      try {
        setReady(false);
        const { createChristmasScene } = await import("./ChristmasScene");
        if (cancelled) return;
        if (!nearTopRef.current || !getDesktopViewport() || !canvasRef.current || !rootRef.current) {
          loadRequested = false;
          return;
        }
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const requestedView = new URLSearchParams(window.location.search).get("view");
        const controller = createChristmasScene(canvasRef.current, {
          houseScale: houseSize === "larger" ? 1.1 : BAKERY_SCALE,
          viewSide: requestedView === "left" || requestedView === "right" ? requestedView : CHRISTMAS_BAKERY_VIEW,
          reducedMotion: motion.matches,
          onStatus(message) { if (!cancelled) setStatus(message); },
          onError(message) {
            if (cancelled) return;
            setError(message);
            setReady(false);
            updateTargets([]);
          },
          onTargetsChange: updateTargets,
        });
        sceneRef.current = controller;
        cleanups.push(() => {
          controller.dispose();
          if (sceneRef.current === controller) sceneRef.current = null;
        });

        const syncPause = () => controller.setPaused(document.hidden || !inViewRef.current || !nearTopRef.current);
        const syncMotion = () => controller.setReducedMotion(motion.matches);
        const visibility = new IntersectionObserver(([entry]) => {
          if (cancelled) return;
          inViewRef.current = entry.isIntersecting;
          syncPause();
        });
        cleanups.push(() => visibility.disconnect());
        visibility.observe(rootRef.current);
        document.addEventListener("visibilitychange", syncPause);
        cleanups.push(() => document.removeEventListener("visibilitychange", syncPause));
        motion.addEventListener("change", syncMotion);
        cleanups.push(() => motion.removeEventListener("change", syncMotion));

        syncPause();
        setReady(true);
      } catch {
        cleanupScene();
        if (cancelled) return;
        updateTargets([]);
        setError("The miniature is resting on this device.");
        setReady(false);
      }
    }

    function scheduleScene() {
      if (cancelled || loadRequested || sceneRef.current || !nearTopRef.current || !pageLoaded) return;
      loadRequested = true;
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => void loadScene(), { timeout: 1800 });
      else fallbackId = setTimeout(() => void loadScene(), 350);
    }

    function syncScroll() {
      if (cancelled || !rootRef.current) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - 24) / 156));
      const state = progress === 0 ? "visible" : progress === 1 ? "hidden" : "fading";
      rootRef.current.style.setProperty("--corner-opacity", String(1 - progress));
      rootRef.current.dataset.scrollState = state;
      rootRef.current.inert = state !== "visible";
      nearTopRef.current = state === "visible";
      sceneRef.current?.setPaused(document.hidden || !inViewRef.current || !nearTopRef.current);
      if (nearTopRef.current) scheduleScene();
      else if (idleId !== undefined || fallbackId !== undefined) {
        if (idleId !== undefined) window.cancelIdleCallback(idleId);
        if (fallbackId !== undefined) clearTimeout(fallbackId);
        idleId = undefined;
        fallbackId = undefined;
        loadRequested = false;
      }
    }

    function onScroll() {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        syncScroll();
      });
    }

    function onLoad() {
      pageLoaded = true;
      scheduleScene();
    }

    if (variant === "corner") {
      syncScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      nearTopRef.current = true;
      scheduleScene();
    }
    if (!pageLoaded) window.addEventListener("load", onLoad, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollFrame);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (fallbackId !== undefined) clearTimeout(fallbackId);
      cleanupScene();
    };
  }, [retry, variant, houseSize]);

  function reset() {
    if (error) {
      setError("");
      setReady(false);
      setRetry((value) => value + 1);
    } else sceneRef.current?.reset();
  }

  function activate(id: string) {
    const scene = sceneRef.current;
    if (!scene) return;
    if (id === "bread" || id === "oven") scene.bakeBread();
    else if (id === "snowman") scene.meltSnowman();
    else if (id.startsWith("tree-")) scene.moveTree(Number(id.at(-1)));
    else if (id === "bell") scene.ringBell();
    else if (id === "starter") scene.feedStarter();
    else scene.moveProp(id);
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.bakery} ${variant === "corner" ? styles.corner : styles.fullBakery}`}
      data-christmas-bakery
      data-house-size={houseSize}
      data-ready={ready}
      data-scroll-state={variant === "corner" ? "hidden" : "visible"}
    >
      {children}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.targets} aria-label="Christmas miniature">
        {TARGETS.map((id) => (
          <button
            key={id}
            ref={(element) => { targetsRef.current[id] = element; }}
            type="button"
            data-prop={id}
            hidden
            aria-label={LABELS[id]}
            className={`${styles.prop} ${id === "bread" || id === "snowman" ? styles.frontProp : ""}`}
            onPointerDown={(event) => sceneRef.current?.startDrag(id, event.nativeEvent)}
            onClick={(event) => { if (event.detail === 0) activate(id); }}
          />
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" ref={resetRef} onClick={reset} aria-label="Reset the miniature" disabled={!ready && !error}>↺</button>
        {variant === "corner" && (
          <button type="button" onClick={onDismiss} aria-label="Hide the miniature">×</button>
        )}
      </div>
      <span className={styles.screenReader} aria-live="polite">{error || status}</span>
    </div>
  );
}
