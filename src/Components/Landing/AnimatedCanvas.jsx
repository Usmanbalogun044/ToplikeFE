import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/*
  AnimatedCanvas: Responsive Three.js background with stylized "cartoon" depth.
  Elements: floating prism shards + soft metaball-like blobs via custom shader material.
  Optimized: low poly count, requestAnimationFrame loop, pauses when tab hidden.
*/
const AnimatedCanvas = () => {
  const mountRef = useRef(null);
  const frameRef = useRef(0);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 0, 24);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

  // Respect reduced motion / low power
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lighting (stylized rim + ambient glow)
    const ambient = new THREE.AmbientLight(0xb38cff, 0.55);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xff5ccf, 1.2);
    dir.position.set(6, 9, 12);
    scene.add(dir);
    const rim = new THREE.DirectionalLight(0x6b40ff, 0.8);
    rim.position.set(-6, -4, -8);
    scene.add(rim);

    // Cartoon gradient background sphere (inward facing)
    const bgGeo = new THREE.SphereGeometry(60, 32, 32);
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        uColor1: { value: new THREE.Color('#120422') },
        uColor2: { value: new THREE.Color('#2d0d55') },
        uTime: { value: 0 },
        uScroll: { value: 0 }
      },
      vertexShader: `varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 vPos; uniform float uTime; uniform float uScroll; uniform vec3 uColor1; uniform vec3 uColor2; 
        void main(){
          float f = (vPos.y+60.)/120.;
          f += 0.05*sin(vPos.x*0.18+uTime*0.18) + 0.03*sin(vPos.z*0.22+uTime*0.12);
          f = clamp(f,0.,1.);
          // Scroll modulated hue shift
          float glow = 0.25 + 0.75 * uScroll;
          vec3 mixCol = mix(uColor1,uColor2,f);
          mixCol += vec3(0.25,0.05,0.45) * glow * smoothstep(0.4,1.2,f);
          gl_FragColor = vec4(mixCol,1.);
        }`
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    scene.add(bgMesh);

    // Dynamic intensity (attempt to detect stronger devices)
    const deviceMem = navigator.deviceMemory || 4; // heuristic
    const highQuality = !prefersReduced && deviceMem >= 4 && window.innerWidth > 1000;
    const shardGroup = new THREE.Group();
    const blobGroup = new THREE.Group();
    const swirlGroup = new THREE.Group();
    const wandGroup = new THREE.Group();
    let wandTrail = null;
    let wandParticlesGeo = null;
    let wandParticlesMat = null;
    let particles = null;
    if (!prefersReduced) {
      scene.add(shardGroup);
      scene.add(blobGroup);
      scene.add(swirlGroup);
      scene.add(wandGroup);
      // Floating shards (increased if highQuality)
      const shardMat = new THREE.MeshStandardMaterial({
        color: 0xff8ae6,
        roughness: 0.3,
        metalness: 0.25,
        transparent: true,
        opacity: 0.85,
        emissive: new THREE.Color('#6e1aff'),
        emissiveIntensity: 0.25
      });
      const shardGeo = new THREE.ConeGeometry(0.5, 1.4, 7);
      const shardCount = highQuality ? 64 : 40;
      for (let i=0;i<shardCount;i++) {
        const m = new THREE.Mesh(shardGeo, shardMat.clone());
        m.position.set((Math.random()-0.5)*34,(Math.random()-0.5)*20,(Math.random()-0.5)*10);
        m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        const s = 0.35 + Math.random()*1.1;
        m.scale.set(s,s*1.5,s);
        m.material.color.setHSL(0.80 + Math.random()*0.08, 0.65, 0.55 + Math.random()*0.18);
        shardGroup.add(m);
      }
      // Blob field expanded
      const blobGeo = new THREE.IcosahedronGeometry(0.9, 2);
      const blobMat = new THREE.MeshStandardMaterial({
        color: 0x9d5bff,
        roughness: 0.55,
        metalness: 0.08,
        emissive: 0x3c116e,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.32
      });
      const blobCount = highQuality ? 26 : 16;
      for (let i=0;i<blobCount;i++) {
        const b = new THREE.Mesh(blobGeo, blobMat.clone());
        b.position.set((Math.random()-0.5)*28,(Math.random()-0.5)*16,(Math.random()-0.5)*14);
        const s = 0.9+Math.random()*2.2;
        b.scale.set(s,s,s);
        blobGroup.add(b);
      }
      // Swirl ribbons (simple torus segments) for extra motion
      const swirlMat = new THREE.MeshStandardMaterial({ color: 0x7f3dff, emissive: 0x7620ff, emissiveIntensity: 0.8, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.5 });
      const swirlGeo = new THREE.TorusGeometry(6, 0.035, 12, 100, Math.PI * 1.4);
      for (let i=0;i<(highQuality?4:2);i++) {
        const s = 0.6 + i*0.25;
        const tor = new THREE.Mesh(swirlGeo, swirlMat.clone());
        tor.scale.setScalar(s);
        tor.rotation.x = Math.random()*Math.PI;
        tor.rotation.y = Math.random()*Math.PI;
        tor.rotation.z = Math.random()*Math.PI;
        swirlGroup.add(tor);
      }
      // Particles (denser if highQuality)
      const pGeo = new THREE.BufferGeometry();
      const pCount = highQuality ? 1000 : 520;
      const positions = new Float32Array(pCount*3);
      for (let i=0;i<pCount;i++) {
        positions[i*3] = (Math.random()-0.5)*60;
        positions[i*3+1] = (Math.random()-0.5)*34;
        positions[i*3+2] = (Math.random()-0.5)*26;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.065, color: 0xca8bff, transparent: true, opacity: 0.55, depthWrite: false });
      particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);
    }

    // Magic Wand (simple cylinder + gem tip) always add (even low quality) for identity
    const handleGeo = new THREE.CylinderGeometry(0.12,0.16,4.2,10);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x2a0b44, roughness: 0.4, metalness: 0.6, emissive: 0x140524, emissiveIntensity: 0.4 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(-6, -2, -2);
    handle.rotation.z = Math.PI * 0.18;
    wandGroup.add(handle);
    const tipGeo = new THREE.OctahedronGeometry(0.38,1);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xff7bff, emissive: 0xc23bff, emissiveIntensity: 1.6, roughness: 0.25, metalness: 0.4 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(0,2.3,0);
    handle.add(tip);

    // Wand trail particles (Points) - small swirling sparkles
    wandParticlesGeo = new THREE.BufferGeometry();
    const wCount = 140;
    const wPos = new Float32Array(wCount*3);
    for (let i=0;i<wCount;i++) {
      wPos[i*3] = (Math.random()-0.5)*0.4;
      wPos[i*3+1] = (Math.random()-0.5)*0.4;
      wPos[i*3+2] = (Math.random()-0.5)*0.4;
    }
    wandParticlesGeo.setAttribute('position', new THREE.BufferAttribute(wPos,3));
    wandParticlesMat = new THREE.PointsMaterial({ size: 0.07, color: 0xffc9ff, transparent: true, opacity: 0.85, depthWrite: false });
    wandTrail = new THREE.Points(wandParticlesGeo, wandParticlesMat);
    tip.add(wandTrail);

    const scrollProgress = { value: 0 };
    const updateScroll = () => {
      const doc = document.documentElement;
      const h = doc.scrollHeight - window.innerHeight;
      const p = h>0 ? window.scrollY / h : 0;
      scrollProgress.value = p;
      bgMat.uniforms.uScroll.value = p;
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    let last = performance.now();
    // Interactive camera target
    const target = { rx: 0, ry: 0 };
    const onPointer = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      target.ry = x * 0.25; // yaw
      target.rx = y * 0.15; // pitch
    };
    window.addEventListener('pointermove', onPointer);
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const t = now * 0.001;

      if (!prefersReduced) {
        shardGroup.children.forEach((m, i) => {
          m.rotation.x += 0.15 * dt;
          m.rotation.y += 0.12 * dt;
          m.position.y += Math.sin(t * 0.6 + i) * 0.0025;
        });
        blobGroup.children.forEach((b, i) => {
          const pulse = 0.08 * Math.sin(t*0.9 + i*0.7);
          b.scale.setScalar(1 + pulse + i*0.002);
        });
        swirlGroup.children.forEach((tor, i) => {
          tor.rotation.y += 0.05 * dt * (i % 2 ? 1 : -1);
          tor.rotation.x += 0.03 * dt;
          tor.material.emissiveIntensity = 0.6 + 0.4*Math.sin(t*0.6 + i);
        });
        if (particles) {
          particles.rotation.y += 0.0018;
          particles.rotation.x += 0.0006;
        }
      }
      // Wand movement & trail animation (responds to scroll)
      const wp = scrollProgress.value;
      const targetY = -2 + wp * 6.5; // raise wand through journey
      const targetX = -6 + Math.sin(t*0.4 + wp*Math.PI)*0.6;
      wandGroup.position.y += (targetY - wandGroup.position.y) * 0.06;
      wandGroup.position.x += (targetX - wandGroup.position.x) * 0.06;
      wandGroup.rotation.z = Math.sin(t*0.8 + wp*2.5)*0.25 + 0.2;
      tip.rotation.y += 0.9 * dt;
      if (wandParticlesGeo) {
        const arr = wandParticlesGeo.attributes.position.array;
        for (let i=0;i<arr.length/3;i++) {
          const ix = i*3;
          arr[ix+1] += 0.015 + Math.sin(t*2 + i)*0.002;
          arr[ix] += Math.sin(t*3 + i)*0.0009;
          arr[ix+2] += Math.sin(t*2.5 + i*0.5)*0.0007;
          if (arr[ix+1] > 2.2) { // recycle
            arr[ix+1] = (Math.random()-0.5)*0.4;
            arr[ix] = (Math.random()-0.5)*0.4;
            arr[ix+2] = (Math.random()-0.5)*0.4;
          }
        }
        wandParticlesGeo.attributes.position.needsUpdate = true;
        wandParticlesMat.opacity = 0.5 + 0.5*Math.sin(t*2.2 + wp*6.28);
      }
      // Smooth camera easing toward pointer target
      camera.rotation.x += (target.rx - camera.rotation.x) * 0.05;
      camera.rotation.y += (target.ry - camera.rotation.y) * 0.05;
      bgMat.uniforms.uTime.value = t;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
      } else {
        last = performance.now();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', updateScroll);
      shardGroup.clear();
      blobGroup.clear();
      if (particles) {
        particles.geometry.dispose();
      }
      if (wandParticlesGeo) wandParticlesGeo.dispose();
      if (wandParticlesMat) wandParticlesMat.dispose();
      scene.clear();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10" aria-hidden="true" />;
};

export default AnimatedCanvas;
