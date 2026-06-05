import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#000a04", 8, 22);

    const camera = new THREE.PerspectiveCamera(46, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Lights ──────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
    const keyLight = new THREE.PointLight("#43F000", 60, 28);
    keyLight.position.set(3, 3, 6);
    const fillLight = new THREE.PointLight("#00ff88", 20, 20);
    fillLight.position.set(-5, -3, -4);
    const rimLight = new THREE.PointLight("#43F000", 30, 20);
    rimLight.position.set(0, 0, -6);
    scene.add(ambientLight, keyLight, fillLight, rimLight);

    const group = new THREE.Group();
    scene.add(group);

    // ── Globe: solid dark sphere ─────────────────────────────────────────────
    const globeBase = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 64, 64),
      new THREE.MeshStandardMaterial({
        color: "#021a0b",
        roughness: 0.7,
        metalness: 0.1,
      }),
    );
    group.add(globeBase);

    // ── Globe: lat/long wireframe lines ─────────────────────────────────────
    const latLonLines: THREE.Line[] = [];

    const lineMat = new THREE.LineBasicMaterial({
      color: "#1a6b2a",
      transparent: true,
      opacity: 0.55,
    });

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const r = 1.73;
      const points: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 360; lon += 3) {
        const theta = THREE.MathUtils.degToRad(lon);
        points.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          ),
        );
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, lineMat);
      group.add(line);
      latLonLines.push(line);
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
      const theta = THREE.MathUtils.degToRad(lon);
      const r = 1.73;
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        const phi = THREE.MathUtils.degToRad(90 - lat);
        points.push(
          new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta),
          ),
        );
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, lineMat);
      group.add(line);
      latLonLines.push(line);
    }

    // ── Globe: surface dot particles (world-map style) ───────────────────────
    const dotGeo = new THREE.BufferGeometry();
    const dotCount = 2200;
    const dotPos = new Float32Array(dotCount * 3);
    let di = 0;
    while (di < dotCount) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.74 + Math.random() * 0.02;
      dotPos[di * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPos[di * 3 + 1] = r * Math.cos(phi);
      dotPos[di * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      di++;
    }
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
    const surfaceDots = new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({
        color: "#43F000",
        size: 0.028,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      }),
    );
    group.add(surfaceDots);

    // ── Glowing orbital rings ────────────────────────────────────────────────
    const rings = [
      { radius: 2.1,  tube: 0.022, rot: [Math.PI / 2, 0, 0] as [number,number,number], bright: true  },
      { radius: 2.85, tube: 0.016, rot: [0.85, 0.1, 0]      as [number,number,number], bright: false },
      { radius: 3.7,  tube: 0.012, rot: [0.28, 0.32, 0.08]  as [number,number,number], bright: false },
    ].map(({ radius, tube, rot, bright }) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 16, 180),
        new THREE.MeshStandardMaterial({
          color: bright ? "#8fff58" : "#2fb814",
          emissive: "#43F000",
          emissiveIntensity: bright ? 2.2 : 0.7,
          roughness: 0.1,
          metalness: 0.2,
        }),
      );
      mesh.rotation.set(...rot);
      group.add(mesh);
      return mesh;
    });

    // ── Sparkle nodes on rings ───────────────────────────────────────────────
    const sparkleGroup = new THREE.Group();
    group.add(sparkleGroup);
    const sparkleMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const r = i % 2 === 0 ? 2.1 : 2.85;
      const sparkle = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), sparkleMat);
      sparkle.position.set(r * Math.cos(angle), 0, r * Math.sin(angle));
      sparkleGroup.add(sparkle);
    }
    sparkleGroup.rotation.x = Math.PI / 2;

    // ── Deep space ambient particles ─────────────────────────────────────────
    const bgParticleGeo = new THREE.BufferGeometry();
    const bgCount = 1100;
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      const r = 6 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bgPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i * 3 + 2] = r * Math.cos(phi);
    }
    bgParticleGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    const bgParticles = new THREE.Points(
      bgParticleGeo,
      new THREE.PointsMaterial({
        color: "#7dff58",
        size: 0.042,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    );
    scene.add(bgParticles);

    // ── Pointer & resize ─────────────────────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    container.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    // ── Animation loop ───────────────────────────────────────────────────────
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      group.rotation.y += (pointer.x * 0.3 - group.rotation.y) * 0.04;
      group.rotation.x += (-pointer.y * 0.16 - group.rotation.x) * 0.04;
      camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (pointer.y * 0.35 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Globe auto-spin
      globeBase.rotation.y += 0.0025;
      surfaceDots.rotation.y += 0.0025;
      latLonLines.forEach((l) => (l.rotation.y += 0.0025));

      rings[0].rotation.z += 0.005;
      rings[1].rotation.z -= 0.0035;
      rings[2].rotation.z += 0.002;
      sparkleGroup.rotation.z += 0.005;

      bgParticles.rotation.y += 0.0006;
      bgParticles.rotation.x += 0.00015;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mat = (obj as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      });
      bgParticleGeo.dispose();
      dotGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const cards = [
    { title: "Meta Ads",   stat: "CTR 4.9%",  delta: "+32%", className: "left-4 top-6 md:left-8 md:top-10",         barW: "78%" },
    { title: "Google Ads", stat: "ROAS 5.2x", delta: "+48%", className: "right-4 top-12 md:right-10 md:top-16",      barW: "85%" },
    { title: "SEO",        stat: "+183 KWS",  delta: "+65%", className: "bottom-16 left-8 md:bottom-20 md:left-16",  barW: "72%" },
    { title: "Leads",      stat: "124 / mo",  delta: "+38%", className: "bottom-10 right-5 md:bottom-16 md:right-14", barW: "68%" },
  ];

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-[#43F000]/15 bg-[radial-gradient(ellipse_at_center,rgba(67,240,0,0.18),transparent_38%),linear-gradient(180deg,rgba(2,20,10,0.97),rgba(0,6,2,0.99))] shadow-[0_0_100px_rgba(67,240,0,0.12),inset_0_0_60px_rgba(67,240,0,0.03)] lg:h-[680px]">
      <div ref={containerRef} className="absolute inset-0" />

      {/* GroYou logo overlay — center of globe */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center select-none" style={{ transform: "translateY(-2%)" }}>
          {/* GY monogram */}
          <div
            className="mb-1 flex items-center justify-center rounded-full font-black tracking-tight text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1,
              textShadow: "0 0 30px rgba(67,240,0,0.9), 0 0 60px rgba(67,240,0,0.5)",
              filter: "drop-shadow(0 0 18px #43F000)",
            }}
          >
            <span style={{ color: "#ffffff" }}>G</span>
            <span style={{ color: "#43F000" }}>Y</span>
            <span
              style={{
                display: "inline-block",
                marginLeft: "4px",
                width: "clamp(14px,2.5vw,22px)",
                height: "clamp(14px,2.5vw,22px)",
                background: "#43F000",
                clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 60% 50%, 100% 100%, 40% 100%, 40% 60%, 0% 20%)",
              }}
            />
          </div>
          {/* GroYou wordmark */}
          <div
            className="font-black tracking-wide"
            style={{
              fontSize: "clamp(1.1rem, 3vw, 2rem)",
              color: "#ffffff",
              textShadow: "0 0 20px rgba(67,240,0,0.7), 0 0 40px rgba(67,240,0,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            Gro<span style={{ color: "#43F000" }}>You</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {cards.map((card) => (
        <div key={card.title} className={`pointer-events-none absolute ${card.className}`}>
          <div
            className="rounded-2xl border p-3 text-white backdrop-blur-xl md:p-4"
            style={{
              width: "clamp(120px, 18vw, 176px)",
              background: "rgba(0,12,5,0.72)",
              borderColor: "rgba(67,240,0,0.22)",
              boxShadow: "0 0 40px rgba(67,240,0,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/45 md:text-[10px]">
              {card.title}
            </div>
            <div className="mt-1.5 text-base font-bold text-white md:text-xl">{card.stat}</div>
            {/* Delta with arrow */}
            <div className="mt-1 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L9 7H1L5 1Z" fill="#43F000" />
              </svg>
              <span className="text-[11px] font-semibold text-[#43F000] md:text-xs">{card.delta}</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8 md:h-1.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: card.barW,
                  background: "linear-gradient(90deg, #43F000, #7dff58)",
                  boxShadow: "0 0 8px rgba(67,240,0,0.7)",
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#000602] to-transparent" />
      {/* Top subtle vignette */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
    </div>
  );
}
