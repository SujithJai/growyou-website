import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#021108", 6, 17);

    const camera = new THREE.PerspectiveCamera(46, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.45);
    const keyLight = new THREE.PointLight("#43F000", 40, 25);
    keyLight.position.set(4, 4, 6);
    const fillLight = new THREE.PointLight("#87ff66", 12, 18);
    fillLight.position.set(-5, -3, -4);
    scene.add(ambientLight, keyLight, fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshStandardMaterial({
        color: "#43F000",
        emissive: "#43F000",
        emissiveIntensity: 1.2,
        roughness: 0.15,
        metalness: 0.45,
        wireframe: true,
      }),
    );
    group.add(core);

    const rings = [
      { radius: 1.55, rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
      { radius: 2.35, rotation: [0.9, 0, 0] as [number, number, number] },
      { radius: 3.4, rotation: [0.25, 0.3, 0.1] as [number, number, number] },
    ].map((ring, index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(ring.radius, 0.04, 16, 120),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? "#9dff6b" : "#2f8f14",
          emissive: "#43F000",
          emissiveIntensity: index === 0 ? 0.65 : 0.22,
        }),
      );
      mesh.rotation.set(...ring.rotation);
      group.add(mesh);
      return mesh;
    });

    const cardGeometry = new THREE.BoxGeometry(0.55, 0.32, 0.08);
    const cardMaterial = new THREE.MeshStandardMaterial({
      color: "#0a2b17",
      emissive: "#43F000",
      emissiveIntensity: 0.18,
      roughness: 0.24,
      metalness: 0.3,
    });

    const orbitCards = [
      [-2.55, 1.4, 0.2],
      [2.35, 1.05, -0.9],
      [-1.2, -1.9, 1.2],
      [2.15, -1.55, 0.7],
    ].map((position) => {
      const mesh = new THREE.Mesh(cardGeometry, cardMaterial);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.set(position[1] * 0.08, position[0] * -0.08, 0.15);
      group.add(mesh);
      return mesh;
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: "#7dff58",
        size: 0.045,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += (pointer.x * 0.32 - group.rotation.y) * 0.04;
      group.rotation.x += (-pointer.y * 0.18 - group.rotation.x) * 0.04;
      camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (pointer.y * 0.35 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      core.rotation.x += 0.01;
      core.rotation.y += 0.015;
      rings[0].rotation.z += 0.004;
      rings[1].rotation.z -= 0.003;
      rings[2].rotation.z += 0.002;
      orbitCards.forEach((mesh, index) => {
        mesh.position.y += Math.sin(performance.now() * 0.0012 + index) * 0.0018;
      });
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.00018;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      particleGeometry.dispose();
      if (particles.material instanceof THREE.Material) particles.material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(67,240,0,0.16),transparent_34%),linear-gradient(180deg,rgba(4,29,16,0.95),rgba(1,10,5,0.98))] shadow-[0_0_80px_rgba(67,240,0,0.1)] lg:h-[680px]">
      <div ref={containerRef} className="absolute inset-0" />
      {[
        { title: "Meta ads", stat: "CTR 4.9%", className: "left-4 top-6 md:left-8 md:top-10" },
        { title: "Google ads", stat: "ROAS 5.2x", className: "right-4 top-12 md:right-10 md:top-16" },
        { title: "SEO", stat: "+183 kws", className: "bottom-16 left-8 md:bottom-20 md:left-16" },
        { title: "Leads", stat: "124 / mo", className: "bottom-10 right-5 md:bottom-16 md:right-14" },
      ].map((card) => (
        <div key={card.title} className={`pointer-events-none absolute ${card.className}`}>
          <div className="w-36 rounded-2xl border border-white/10 bg-black/35 p-4 text-white shadow-[0_0_50px_rgba(67,240,0,0.12)] backdrop-blur-xl md:w-44">
            <div className="text-[11px] uppercase tracking-[0.28em] text-white/50">{card.title}</div>
            <div className="mt-2 text-xl font-semibold text-white md:text-2xl">{card.stat}</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-[#43F000]" />
            </div>
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#001007] to-transparent" />
    </div>
  );
}
