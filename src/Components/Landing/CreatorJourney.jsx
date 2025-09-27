import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/*
  CreatorJourney: Side-by-side advanced cartoon-ish 3D character + weekly journey steps.
  - Custom Three.js mini scene (independent from global background) for clarity & layout.
  - Character built from primitive geometry (head, body, arms, desk, floating content icons).
  - Gentle looping animations (typing motion, head tilt, floating orbiting media nodes).
  - Accessible: Canvas marked decorative (aria-hidden). Text content fully semantic.
*/
const CharacterCanvas = () => {
  const ref = useRef(null);
  const frame = useRef();
  const pointerTarget = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#120422', 0.065);
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 80);
    camera.position.set(0, 1.2, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Lighting (more stylized toon: hemi + rim + key)
    const hemi = new THREE.HemisphereLight(0xffd8ff, 0x120322, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xff6adf, 1.15);
    key.position.set(5, 7, 9);
    key.castShadow = false;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6b40ff, 1.0);
    rim.position.set(-6, 3, -5);
    scene.add(rim);

    // Toon gradient texture
    const gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = 1; gradientCanvas.height = 6;
    const gctx = gradientCanvas.getContext('2d');
    const grad = gctx.createLinearGradient(0,0,0,6);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#e9ccff');
    grad.addColorStop(0.55, '#b27aff');
    grad.addColorStop(0.8, '#6d32ff');
    grad.addColorStop(1, '#3b0d6f');
    gctx.fillStyle = grad; gctx.fillRect(0,0,1,6);
    const gradientTex = new THREE.CanvasTexture(gradientCanvas);
    gradientTex.minFilter = THREE.NearestFilter;
    gradientTex.magFilter = THREE.NearestFilter;
    gradientTex.generateMipmaps = false;
    const toon = (color, opts={}) => new THREE.MeshToonMaterial({ color, gradientMap: gradientTex, ...opts });

    // Ground / desk plane with subtle gradient
  const deskGeo = new THREE.PlaneGeometry(16, 9, 1, 1);
  const deskMat = toon(0x240a45, {});
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.rotation.x = -Math.PI / 2.2;
    desk.position.y = -2.4;
    scene.add(desk);

    // Character group
    const character = new THREE.Group();
    scene.add(character);

    // Body (stylized capsule)
  const bodyGeo = new THREE.CapsuleGeometry(0.9, 1.8, 12, 20);
  const bodyMat = toon(0x6d32ff, { emissive: 0x2a0a55, emissiveIntensity: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = -0.4;
    character.add(body);
  // Body outline
  const bodyOutline = body.clone();
  bodyOutline.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  bodyOutline.scale.multiplyScalar(1.04);
  character.add(bodyOutline);

    // Head
    const headGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const headMat = toon(0xf8d7ff, { emissive: 0x5d2a9b, emissiveIntensity: 0.15 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.2;
    character.add(head);
    const headOutline = head.clone();
    headOutline.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    headOutline.scale.multiplyScalar(1.05);
    character.add(headOutline);

    // Simple hair (spheres)
    const hairGroup = new THREE.Group();
    const hairMat = toon(0x3b0d6f, { emissive: 0x1c0539, emissiveIntensity: 0.4 });
    for (let i=0;i<8;i++) {
      const hg = new THREE.SphereGeometry(0.22 + Math.random()*0.05, 16, 16);
      const hm = new THREE.Mesh(hg, hairMat);
      const ang = i/8 * Math.PI * 1.9 + 0.3;
      hm.position.set(Math.cos(ang)*0.42, 1.52 + (Math.random()*0.05), Math.sin(ang)*0.25 + 0.05);
      hairGroup.add(hm);
    }
    character.add(hairGroup);

    // Eyes (simple discs)
  const eyeGeo = new THREE.SphereGeometry(0.12, 14, 14);
  const eyeMat = new THREE.MeshToonMaterial({ color: 0x140424 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.22, 1.27, 0.67);
    eyeR.position.set(0.22, 1.27, 0.67);
    character.add(eyeL, eyeR);
  // Mouth (flat plane)
  const mouthGeo = new THREE.PlaneGeometry(0.32, 0.18);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x140424 });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, 0.95, 0.72);
  character.add(mouth);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.4, 16);
    const armMat = toon(0x8f55ff, { emissive: 0x3a0d6b, emissiveIntensity: 0.3 });
    const armL = new THREE.Mesh(armGeo, armMat);
    const armR = new THREE.Mesh(armGeo, armMat);
    armL.position.set(-1.05, 0.2, 0.15);
    armR.position.set(1.05, 0.2, 0.15);
    armL.rotation.z = 0.9;
    armR.rotation.z = -0.9;
    character.add(armL, armR);
    // Arm outlines
    [armL, armR].forEach(a => {
      const outline = a.clone();
      outline.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
      outline.scale.multiplyScalar(1.05);
      character.add(outline);
    });

    // Simple holographic screen / tablet
  const screenGeo = new THREE.PlaneGeometry(2.8, 1.8, 1, 1);
  const screenMat = toon(0x3b1066, { emissive: 0x9e4fff, emissiveIntensity: 1.3 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.4, 1.8);
    screen.rotation.x = -0.05;
    character.add(screen);
  const screenOutline = screen.clone();
  screenOutline.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
  screenOutline.scale.multiplyScalar(1.03);
  character.add(screenOutline);

    // Floating content icons (video, image, audio) => colored planes in orbit
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    const iconGeo = new THREE.PlaneGeometry(0.9, 0.9, 1, 1);
    const makeIcon = (color) => new THREE.Mesh(iconGeo, new THREE.MeshToonMaterial({ color, gradientMap: gradientTex, transparent: true, opacity: 0.95 }));
    const icons = [0xff5fc6, 0x7f5dff, 0xffa646].map(c => makeIcon(c));
    icons.forEach((m, i) => {
      m.position.set(Math.sin(i * 2.09) * 3.4, 0.6 + (i - 1) * 0.9, Math.cos(i * 2.09) * 2.2);
      orbitGroup.add(m);
    });

    // Particle aura
    const auraGeo = new THREE.BufferGeometry();
    const auraCount = 180;
    const pos = new Float32Array(auraCount * 3);
    for (let i = 0; i < auraCount; i++) {
      const r = 4.2 + Math.random() * 1.6;
      const ang = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 3.2;
      pos[i * 3] = Math.cos(ang) * r;
      pos[i * 3 + 1] = h;
      pos[i * 3 + 2] = Math.sin(ang) * r * 0.6;
    }
    auraGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const auraMat = new THREE.PointsMaterial({ size: 0.07, color: 0xd9b6ff, transparent: true, opacity: 0.55, depthWrite: false });
    const aura = new THREE.Points(auraGeo, auraMat);
    scene.add(aura);

    // Pointer parallax
    const onPointer = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = (e.clientY - rect.top) / rect.height * 2 - 1;
      pointerTarget.current.x = x;
      pointerTarget.current.y = y;
    };
    mount.addEventListener('pointermove', onPointer);

    // Animation loop
    let t0 = performance.now();
    const animate = () => {
      frame.current = requestAnimationFrame(animate);
      const now = performance.now();
      const t = (now - t0) * 0.001;
      // Float character
      character.position.y = Math.sin(t * 1.2) * 0.15;
      head.rotation.y = Math.sin(t * 0.6) * 0.35;
      head.rotation.x = Math.sin(t * 0.8) * 0.15;
      // Typing like motion
      const typing = Math.sin(t * 6);
      armL.rotation.x = typing * 0.3 + 0.25;
      armR.rotation.x = Math.cos(t * 6) * 0.3 + 0.25;
      mouth.scale.y = 0.8 + 0.2 * (1 + Math.sin(t * 3));
      mouth.scale.x = 1 + 0.05 * Math.sin(t * 2.2);
      // Parallax / lean
      const px = pointerTarget.current.x * 0.4;
      const py = pointerTarget.current.y * 0.25;
      character.rotation.y += (px - character.rotation.y) * 0.05;
      character.rotation.x += (-py - character.rotation.x) * 0.05;
      camera.position.x += (px*0.8 - camera.position.x) * 0.04;
      camera.position.y += (py*0.5 + 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0,0.8,0);
      orbitGroup.rotation.y += 0.0035;
      aura.rotation.y += 0.0009;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
  window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onPointer);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);
  return <div ref={ref} className="w-full h-full" aria-hidden="true" />;
};

const steps = [
  { day: 'Day 1', title: 'Ignite Ideas', desc: 'Rapid brainstorm & trend scan to spark a high-potential theme.' },
  { day: 'Day 2', title: 'Script & Blueprint', desc: 'Outline hooks, structure & CTA. Prep assets.' },
  { day: 'Day 3', title: 'Create & Capture', desc: 'Record, design, voiceover or draft core pieces.' },
  { day: 'Day 4', title: 'Edit & Polish', desc: 'Refine pacing, visuals, captions & accessibility.' },
  { day: 'Day 5', title: 'Launch & Publish', desc: 'Multi-platform rollout with optimized thumbnails.' },
  { day: 'Day 6', title: 'Engage & Amplify', desc: 'Reply, stitch, remix & community accelerate reach.' },
  { day: 'Day 7', title: 'Reflect & Reward', desc: 'Analytics, iteration & payout progress / leaderboard.' }
];

const CreatorJourney = () => {
  return (
    <section id="weekly-journey" className="relative py-28 md:py-36 px-6 md:px-12 lg:px-20">      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_40%,rgba(160,60,255,0.08),transparent_60%)]" />
      <div className="grid lg:grid-cols-2 gap-14 items-center relative">
        {/* 3D Character */}
        <div className="h-[480px] md:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b062d]/60 via-[#240a45]/60 to-[#320f63]/60 backdrop-blur-xl border border-purple-500/20 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_40px_-10px_rgba(132,42,255,0.45)]">
          <CharacterCanvas />
        </div>
        {/* Textual Journey */}
        <div>
          <motion.h2 initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-300 to-fuchsia-200 bg-clip-text text-transparent">
            Weekly Creator Journey
          </motion.h2>
          <motion.p initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.15,duration:0.7}} className="text-lg md:text-xl text-purple-200/80 max-w-xl leading-relaxed mb-10">
            A rhythm engineered for momentum. Cycle through focused micro-goals each day so consistency compounds into audience reach, reputation and payouts.
          </motion.p>
          <div className="relative pl-6 border-l border-purple-500/30 space-y-8">
            {steps.map((s,i)=> (
              <motion.div key={s.day} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="group">
                <div className="absolute -left-[13px] mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-600/40 group-hover:scale-110 transition" />
                <div className="ml-2">
                  <h3 className="font-bold text-lg md:text-xl text-purple-50 flex items-center gap-3">
                    <span className="text-sm px-2 py-1 rounded-md bg-purple-700/40 border border-purple-500/30 shadow-inner shadow-fuchsia-500/10">{s.day}</span>
                    {s.title}
                  </h3>
                  <p className="mt-1 text-purple-200/70 text-sm md:text-base max-w-md leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
            <div className="pt-4">
              <div className="h-2 w-full bg-purple-950/50 rounded-full overflow-hidden">
                <motion.div initial={{width:0}} whileInView={{width:'100%'}} viewport={{once:true}} transition={{duration:2.8,ease:'easeInOut'}} className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-400" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-purple-300/60">One week. Repeat. Evolve. Scale.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorJourney;
