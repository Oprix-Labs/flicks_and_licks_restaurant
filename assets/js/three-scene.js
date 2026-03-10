/* ============================================================
   FLICKS & LICKS — three-scene.js
   Three.js hero canvas: particle field + floating rings
   ============================================================ */

function initThreeScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = () => canvas.parentElement.offsetWidth;
  const H = () => canvas.parentElement.offsetHeight;

  /* ── SCENE / CAMERA / RENDERER ─────────────────────────── */
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 100);
  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W(), H());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── LIGHTS ─────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const light1 = new THREE.PointLight(0xC9A84C, 3, 12);
  light1.position.set(2, 3, 2);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xC0392B, 1.5, 8);
  light2.position.set(-3, -1.5, 1);
  scene.add(light2);

  const light3 = new THREE.PointLight(0xF5EDD6, 1, 6);
  light3.position.set(0, -3, 3);
  scene.add(light3);

  /* ── PARTICLE FIELD ─────────────────────────────────────── */
  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);

  const palette = [
    new THREE.Color(0xC9A84C), // gold
    new THREE.Color(0xF5EDD6), // cream
    new THREE.Color(0xC0392B), // ember
    new THREE.Color(0xF0EBE1), // offwhite
  ];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - .5) * 16;
    positions[i * 3 + 1] = (Math.random() - .5) * 11;
    positions[i * 3 + 2] = (Math.random() - .5) * 7;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    sizes[i] = Math.random() * .04 + .012;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const pMat = new THREE.PointsMaterial({
    size: .025, vertexColors: true,
    transparent: true, opacity: .65,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── FLOATING RINGS ─────────────────────────────────────── */
  const ringDefs = [
    { r: 1.3,  t: .016, col: 0xC9A84C, pos: [0,    .6,  -1  ], rot: [.3, 0,   0  ], sp: .35, fa: .18 },
    { r: .65,  t: .011, col: 0xF5EDD6, pos: [2.6, -.7,  -.4 ], rot: [1.2, .5, 0  ], sp: .45, fa: .14 },
    { r: .5,   t: .013, col: 0xC0392B, pos: [-2.8, 1.0, -.7 ], rot: [.8, 1.0, 0  ], sp: .55, fa: .12 },
    { r: .95,  t: .013, col: 0xC9A84C, pos: [-1.4,-1.4,  .1 ], rot: [.5, .8,  .2 ], sp: .4,  fa: .2  },
    { r: 1.55, t: .018, col: 0xF5EDD6, pos: [3.2,  1.6, -2.2], rot: [.2, .3,  0  ], sp: .28, fa: .22 },
    { r: .4,   t: .01,  col: 0xC9A84C, pos: [-3.5,-2.0,  .5 ], rot: [1.0, .2, .5 ], sp: .6,  fa: .1  },
  ];

  const rings = ringDefs.map(d => {
    const geo = new THREE.TorusGeometry(d.r, d.t, 10, 90);
    const mat = new THREE.MeshStandardMaterial({
      color: d.col, emissive: d.col, emissiveIntensity: .35,
      transparent: true, opacity: .55,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...d.pos);
    mesh.rotation.set(...d.rot);
    mesh.userData = { initY: d.pos[1], speed: d.sp, floatAmp: d.fa, rotSpd: .002 + Math.random() * .003 };
    scene.add(mesh);
    return mesh;
  });

  /* ── THIN DISK (plate silhouette) ───────────────────────── */
  const diskGeo = new THREE.CylinderGeometry(.8, .82, .04, 64, 1, true);
  const diskMat = new THREE.MeshStandardMaterial({
    color: 0xC9A84C, emissive: 0xC9A84C, emissiveIntensity: .2,
    transparent: true, opacity: .3, side: THREE.DoubleSide,
  });
  const disk = new THREE.Mesh(diskGeo, diskMat);
  disk.position.set(.3, -.2, .5);
  disk.rotation.x = Math.PI * .05;
  disk.userData = { initY: -.2, speed: .3, floatAmp: .12, rotSpd: .001 };
  scene.add(disk);

  /* ── MOUSE PARALLAX ─────────────────────────────────────── */
  let mX = 0, mY = 0, tX = 0, tY = 0;
  document.addEventListener('mousemove', e => {
    mX = (e.clientX / window.innerWidth  - .5) * .6;
    mY = (e.clientY / window.innerHeight - .5) * .35;
  });

  /* ── ANIMATION LOOP ─────────────────────────────────────── */
  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    tX += (mX - tX) * .06;
    tY += (mY - tY) * .06;

    particles.rotation.y = t * .025;
    particles.rotation.x = t * .01;

    rings.forEach((ring, i) => {
      const d = ring.userData;
      ring.position.y = d.initY + Math.sin(t * d.speed + i * 1.2) * d.floatAmp;
      ring.rotation.x += d.rotSpd;
      ring.rotation.y += d.rotSpd * .65;
    });

    disk.position.y = disk.userData.initY + Math.sin(t * disk.userData.speed) * disk.userData.floatAmp;
    disk.rotation.y += disk.userData.rotSpd;

    // Animate point light
    light1.position.x = Math.sin(t * .4) * 3;
    light1.position.y = Math.cos(t * .3) * 2 + 2;

    camera.position.x += (tX - camera.position.x) * .05;
    camera.position.y += (-tY - camera.position.y) * .05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  tick();

  /* ── RESIZE ─────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    const w = W(), h = H();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

document.addEventListener('DOMContentLoaded', initThreeScene);
