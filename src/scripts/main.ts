// GSAP and ScrollTrigger are loaded via CDN defer before this module runs.
declare const gsap: any;
declare const ScrollTrigger: any;

gsap.registerPlugin(ScrollTrigger);

/* ── 3D ELEMENT — lazy-loaded so Three.js (~600 KiB) never blocks main thread ── */
let mesh: any, inner: any;

function loadThree(): Promise<any> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => resolve((window as any).THREE);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function init3d() {
  const canvas = document.getElementById('hero3d') as HTMLCanvasElement;
  if (!canvas) return;

  const THREE = await loadThree();

  const scene = new THREE.Scene();
  const w = canvas.clientWidth || 600;
  const h = canvas.clientHeight || 600;
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);

  mesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.3, 1)),
    new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.3 })
  );
  scene.add(mesh);

  inner = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.1, 0)),
    new THREE.LineBasicMaterial({ color: 0x6b21a8, transparent: true, opacity: 0.5 })
  );
  scene.add(inner);

  let tx = 0, ty = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  (function tick() {
    mesh.rotation.y += 0.0016;
    mesh.rotation.x += 0.0007;
    inner.rotation.y -= 0.0024;
    inner.rotation.x -= 0.001;
    mx += (tx - mx) * 0.04;
    my += (ty - my) * 0.04;
    mesh.position.x = mx;
    mesh.position.y = -my;
    inner.position.x = mx * 1.4;
    inner.position.y = -my * 1.4;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  })();

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
}

// Fire and forget — Three.js loads in the background while GSAP animations run.
init3d();

/* Extra rotation tied to scroll */
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'max',
  scrub: true,
  onUpdate: (self: any) => {
    if (mesh) mesh.rotation.z = self.progress * 2.2;
    if (inner) inner.rotation.z = -self.progress * 3;
  },
});

/* ── HERO INTRO (immediate — no preloader) ── */
// Set initial states here rather than in CSS so content is visible before JS loads (better FCP).
gsap.set('.hero h1 .line > span', { y: '115%' });
gsap.set('.hero-sub', { opacity: 0 });
gsap.set('.hero-ctas', { opacity: 0 });

gsap.timeline({ delay: 0.1 })
  .to('.hero h1 .line > span', { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.1 })
  .to('.hero-eyebrow', { opacity: 1, duration: 0.7 }, '-=.8')
  .to('#hero3d', { opacity: 1, duration: 1.6, ease: 'power2.out' }, '-=.9')
  .to('.hero h1 .strike i', { width: '104%', duration: 0.6, ease: 'power3.inOut' }, '-=.35')
  .to('.hero-sub', { opacity: 1, duration: 0.8 }, '-=.4')
  .to('.hero-ctas', { opacity: 1, duration: 0.8 }, '-=.55');

/* ── NAV ── */
ScrollTrigger.create({
  start: 'top -60',
  onUpdate: (self: any) => {
    document.getElementById('nav')?.classList.toggle('scrolled', self.scroll() > 60);
  },
});

/* ── MARQUEE ── */
// Items are pre-tripled in the Astro template so no DOM mutation happens after first paint.
const track = document.getElementById('marqueeTrack');
if (track) {
  let mqx = 0;
  gsap.ticker.add(() => {
    mqx -= 0.7;
    if (Math.abs(mqx) >= track.scrollWidth / 3) mqx = 0;
    gsap.set(track, { x: mqx });
  });
}

/* ── MANIFESTO WORD SCRUB ── */
const mt = document.getElementById('manifestoText');
if (mt) {
  // Use DOM traversal — Astro adds data-astro-cid-* to scoped elements,
  // which breaks innerHTML regex. Read from the DOM directly instead.
  let newHTML = '';
  for (const node of Array.from(mt.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      newHTML += (node.textContent || '')
        .split(/(\s+)/)
        .map((p: string) => p.trim() ? `<span class="w">${p}</span>` : p)
        .join('');
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const isPop = el.classList.contains('pop');
      newHTML += (el.textContent || '')
        .split(/(\s+)/)
        .map((p: string) => p.trim() ? `<span class="w${isPop ? ' pop' : ''}">${p}</span>` : p)
        .join('');
    }
  }
  mt.innerHTML = newHTML;

  gsap.fromTo('#manifestoText .w',
    { opacity: 0.08 },
    {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: {
        trigger: '.manifesto',
        start: 'top 15%',
        end: '+=800',
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
      },
    }
  );
}

/* ── REVEALS ── */
document.querySelectorAll('.reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' },
  });
});

/* ── HORIZONTAL USES ── */
const usesTrack = document.getElementById('usesTrack');
const usesProgress = document.getElementById('usesProgress');
if (usesTrack && usesProgress) {
  function distance() {
    return usesTrack!.scrollWidth - window.innerWidth + window.innerWidth * 0.05;
  }
  gsap.to(usesTrack, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.uses',
      start: 'top top',
      end: () => '+=' + distance(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self: any) => {
        usesProgress.style.width = self.progress * 100 + '%';
      },
    },
  });
}

/* ── UCARD CURSOR GLOW ── */
document.querySelectorAll<HTMLElement>('.ucard').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

/* ── COUNTERS ── */
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () =>
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function (this: any) {
            el.innerText = String(Math.round(this.targets()[0].innerText));
          },
        }
      ),
  });
});

/* ── BENTO: 3D TILT + CURSOR GLOW ── */
document.querySelectorAll<HTMLElement>('.tile').forEach((tile) => {
  let raf: number | null = null;
  tile.addEventListener('mousemove', (e) => {
    const r = tile.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tile.style.setProperty('--gx', px * 100 + '%');
    tile.style.setProperty('--gy', py * 100 + '%');
    if (raf) return;
    raf = requestAnimationFrame(() => {
      gsap.to(tile, {
        rotateY: (px - 0.5) * 7,
        rotateX: (py - 0.5) * -7,
        y: -4,
        scale: 1.012,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
      raf = null;
    });
  });
  tile.addEventListener('mouseleave', () => {
    gsap.to(tile, { rotateX: 0, rotateY: 0, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1,.6)' });
  });
});
