/* ==========================================================
   APP.JS — Main JavaScript for Surya's 3D Portfolio
   Handles: Three.js scenes, GSAP animations, typewriter,
   modal interactions, navbar, and Chenab bridge viewer.
   ========================================================== */

// --- 1. HERO TYPEWRITER FUNCTION (Defined first so it's ready) ---
function startHeroTypewriter() {
    const lines = [
        { elementId: 'typewriter-role', text: 'Civil Engineering Student' },
        { elementId: 'typewriter-tagline', text: 'Building infrastructure with intelligence' }
    ];

    let lineIndex = 0;

    function typeLine(line, callback) {
        const el = document.getElementById(line.elementId);
        if (!el) return;
        let charIndex = 0;
        el.textContent = '';

        const interval = setInterval(() => {
            el.textContent += line.text[charIndex];
            charIndex++;
            if (charIndex >= line.text.length) {
                clearInterval(interval);
                setTimeout(callback, 600);
            }
        }, 55); 
    }

    function typeAllLines() {
        if (lineIndex < lines.length) {
            typeLine(lines[lineIndex], () => {
                lineIndex++;
                typeAllLines();
            });
        }
    }

    typeAllLines();
}

// --- 2. PRELOADER & SEQUENCING ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const textEl = document.getElementById('preloader-text');
    
    const phase1 = ">surya@portfolio:~$ run setup_infrastructure.sh";
    const phase2 = "DEPLOYMENT SUCCESSFUL.";
    
    let charIndex = 0;

    function typePhase1() {
        if (textEl && charIndex < phase1.length) {
            textEl.innerHTML += phase1.charAt(charIndex);
            charIndex++;
            setTimeout(typePhase1, Math.random() * 50 + 30);
        } else {
            setTimeout(showGranted, 600);
        }
    }

    function showGranted() {
        if (textEl) {
            textEl.innerHTML += `<span style="color: #22c55e; font-weight: bold;">${phase2}</span>`;
        }
        setTimeout(hidePreloader, 1000);
    }

    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                // Trigger Hero Text
                startHeroTypewriter(); 
            }, 800); 
        }
    }

    // Start Preloader Typing
    if (textEl) setTimeout(typePhase1, 400); 
});

// --- 3. DOM INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHeroScene();
    initChenabViewer();
    initModals();
    initGSAP();
});
// Keep your existing initNavbar, initHeroScene, initChenabViewer, etc. functions below this line...

/* -------------------------------------------------------
   1. NAVBAR — Smooth scroll, active link tracking,
      mobile toggle, and scroll-based background.
   ------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Smooth scroll on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu if open
            navLinksContainer.classList.remove('open');
        });
    });

    // Mobile hamburger toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }

    // Navbar background on scroll + active link tracking
    const sections = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
        // Darken navbar on scroll
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}


/* -------------------------------------------------------
   2. TYPEWRITER EFFECT — Types out text character by
      character with a blinking cursor.
   ------------------------------------------------------- */
function initTypewriter() {
    // PLACEHOLDER: Change the text strings below to update
    // what the typewriter displays on the hero section.
    const lines = [
        { elementId: 'typewriter-role', text: 'Civil Engineering Student' },
        { elementId: 'typewriter-tagline', text: 'Building infrastructure with intelligence' }
    ];

    let lineIndex = 0;

    function typeLine(line, callback) {
        const el = document.getElementById(line.elementId);
        if (!el) return;
        let charIndex = 0;
        el.textContent = '';

        const interval = setInterval(() => {
            el.textContent += line.text[charIndex];
            charIndex++;
            if (charIndex >= line.text.length) {
                clearInterval(interval);
                // Small pause before next line
                setTimeout(callback, 600);
            }
        }, 55); // typing speed in ms per character
    }

    function typeAllLines() {
        if (lineIndex < lines.length) {
            typeLine(lines[lineIndex], () => {
                lineIndex++;
                typeAllLines();
            });
        }
    }

    // Start typing after a short delay to let the page render
    setTimeout(typeAllLines, 800);
}


/* -------------------------------------------------------
   3. HERO THREE.JS SCENE — Full-screen canvas with
      particle starfield + Chenab bridge in stress-map mode.
      Stress Map: arch base glows deep red (loaded), fades
      to cyan at the top (unloaded).
   ------------------------------------------------------- */
function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 40, 250);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0a0f, 1);

    // ----- Particle Starfield -----
    // Creates floating particles in the background for ambiance
    const particleCount = 1200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 800;  // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 600;  // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;  // z
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 1.2,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ----- Build bridge with STRESS MAP colors -----
    // Uses the exact arch math from the user's specification.
    // Stress map: base of arch (low Y) = deep red, top of arch (high Y) = cyan.
    buildHeroBridge(scene);

    // ----- Ambient + Directional lights -----
    const ambientLight = new THREE.AmbientLight(0x334455, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x06b6d4, 0.4);
    directionalLight.position.set(50, 100, 80);
    scene.add(directionalLight);

    // ----- Animation Loop -----
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.001;

        // Slowly rotate particles for a living background
        particles.rotation.y += 0.0002;
        particles.rotation.x += 0.0001;

        // Gentle camera sway
        camera.position.x = Math.sin(time * 0.5) * 15;
        camera.position.y = 40 + Math.sin(time * 0.3) * 5;
        camera.lookAt(0, 30, 0);

        renderer.render(scene, camera);
    }
    animate();

    // ----- Handle window resize -----
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


/**
 * buildHeroBridge — Creates the Chenab arch bridge with stress-map
 * vertex coloring. Uses the EXACT math from the user's specification.
 * Colors: Red (#ef4444) at the base → Cyan (#06b6d4) at the top.
 */
function buildHeroBridge(scene) {
    const bridgeGroup = new THREE.Group();

    // ----- Bridge geometry constants (from spec) -----
    const span = 180;
    const archHeight = 90;
    const deckY = 105;
    const archDepth = 6;
    const archWidth = 14;

    const points = [];      // line segment vertex pairs
    const colors = [];      // per-vertex colors for stress map

    /**
     * getArchY — Parabolic arch equation.
     * @param {number} x - horizontal position along span
     * @param {boolean} isTop - true for top chord, false for bottom chord
     */
    const getArchY = (x, isTop) => {
        const a = archHeight / (span * span);
        return isTop
            ? -a * (x * x) + archHeight
            : -a * (x * x) + archHeight - archDepth;
    };

    /**
     * getStressColor — Maps a Y value to a color between red (base) and cyan (top).
     * @param {number} y - the Y coordinate of the vertex
     */
    const getStressColor = (y) => {
        // Normalize y from [0, deckY] to [0, 1]
        const t = Math.max(0, Math.min(1, y / deckY));
        // Red (loaded/base) to Cyan (unloaded/top)
        const r = 0.94 * (1 - t) + 0.02 * t;   // ef/ff → 06/ff
        const g = 0.27 * (1 - t) + 0.71 * t;    // 44/ff → b6/ff
        const b = 0.27 * (1 - t) + 0.83 * t;    // 44/ff → d4/ff
        return { r, g, b };
    };

    /**
     * addSegment — Pushes a line segment (two vertices) with stress-mapped colors.
     */
    const addSegment = (v1, v2) => {
        points.push(v1, v2);
        const c1 = getStressColor(v1.y);
        const c2 = getStressColor(v2.y);
        colors.push(c1.r, c1.g, c1.b);
        colors.push(c2.r, c2.g, c2.b);
    };

    // ----- Generate arch truss segments (exact spec logic) -----
    const steps = 45;
    const stepX = (span * 2) / steps;

    for (let i = 0; i < steps; i++) {
        const x1 = -span + i * stepX;
        const x2 = x1 + stepX;
        const y1TL = getArchY(x1, true);
        const y1BL = getArchY(x1, false);
        const y2TL = getArchY(x2, true);
        const y2BL = getArchY(x2, false);
        const zL = -archWidth / 2;
        const zR = archWidth / 2;

        // Top chords (left & right faces)
        addSegment(new THREE.Vector3(x1, y1TL, zL), new THREE.Vector3(x2, y2TL, zL));
        addSegment(new THREE.Vector3(x1, y1TL, zR), new THREE.Vector3(x2, y2TL, zR));

        // Bottom chords (left & right faces)
        addSegment(new THREE.Vector3(x1, y1BL, zL), new THREE.Vector3(x2, y2BL, zL));
        addSegment(new THREE.Vector3(x1, y1BL, zR), new THREE.Vector3(x2, y2BL, zR));

        // Diagonal bracing (left & right faces)
        addSegment(new THREE.Vector3(x1, y1BL, zL), new THREE.Vector3(x2, y2TL, zL));
        addSegment(new THREE.Vector3(x1, y1BL, zR), new THREE.Vector3(x2, y2TL, zR));

        // Cross bracing (connecting left face to right face)
        addSegment(new THREE.Vector3(x1, y1TL, zL), new THREE.Vector3(x2, y2TL, zR));

        // Spandrel columns (every 2nd step) — vertical members to deck
        if (i % 2 === 0) {
            addSegment(
                new THREE.Vector3(x1, y1TL, zL),
                new THREE.Vector3(x1, deckY, zL)
            );
            addSegment(
                new THREE.Vector3(x1, y1TL, zR),
                new THREE.Vector3(x1, deckY, zR)
            );
        }
    }

    // ----- Create colored line geometry -----
    const trussGeo = new THREE.BufferGeometry().setFromPoints(points);
    const colorArray = new Float32Array(colors);
    trussGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const trussMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85
    });
    const trussLines = new THREE.LineSegments(trussGeo, trussMat);
    bridgeGroup.add(trussLines);

    // ----- Deck (dark slab on top) -----
    const deckGeo = new THREE.BoxGeometry(span * 3.5, 3, archWidth + 6);
    const deckMat = new THREE.MeshBasicMaterial({
        color: 0x223344,
        transparent: true,
        opacity: 0.7
    });
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, deckY, 0);
    bridgeGroup.add(deckMesh);

    // Position the whole bridge group
    bridgeGroup.position.set(0, -40, 0);
    scene.add(bridgeGroup);

    return bridgeGroup;
}


/* -------------------------------------------------------
   4. CHENAB BRIDGE 3D VIEWER — Interactive viewer in the
      Technical Analysis section with OrbitControls and
      3 view modes: Realistic, Blueprint, Stress Map.
   ------------------------------------------------------- */
function initChenabViewer() {
    const canvas = document.getElementById('chenab-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080810);

    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
    camera.position.set(0, 60, 300);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ----- OrbitControls for interactive rotation -----
    let controls = null;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.target.set(0, 30, 0);
        controls.minDistance = 100;
        controls.maxDistance = 600;
        controls.update();
    }

    // ----- Lights -----
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(60, 120, 80);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 0.4, 500);
    pointLight.position.set(-50, 80, 100);
    scene.add(pointLight);

    // ----- Build the bridge using the user's exact math -----
    // We build it once and swap materials for view modes.
    const bridgeData = buildChenabArch(scene);

    // ----- Grid helper (visible in Blueprint mode) -----
    const gridHelper = new THREE.GridHelper(600, 30, 0x112233, 0x0a1520);
    gridHelper.position.y = -40;
    scene.add(gridHelper);

    // ----- View mode switching -----
    let currentViewMode = 'realistic';   // Track active mode for animation loop

    const viewButtons = document.querySelectorAll('.viewer-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentViewMode = btn.dataset.view;
            applyViewMode(currentViewMode, bridgeData, scene, gridHelper);
        });
    });

    // Start in Realistic mode
    applyViewMode('realistic', bridgeData, scene, gridHelper);

    // ----- Stress Map — Moving Load Animation -----
    // Simulates a train traversing the bridge from left to right.
    // Members near the virtual train glow red; far members stay cyan.
    const span = 180;                        // must match buildChenabArch
    let stressTrainPos = -span;              // current x-position of virtual load
    const stressTrainSpeed = 1.2;            // units per frame
    const stressSigma = 3500;                // Gaussian spread (higher = wider glow)

    /**
     * updateStressColors — Recalculates vertex colors each frame
     * based on proximity to the moving point mass (stressTrainPos).
     */
    function updateStressColors() {
        const posAttr = bridgeData.trussGeo.getAttribute('position');
        const colorAttr = bridgeData.trussGeo.getAttribute('color');
        if (!posAttr || !colorAttr) return;

        const count = posAttr.count;
        for (let i = 0; i < count; i++) {
            const px = posAttr.getX(i);
            const py = posAttr.getY(i);

            // Distance from the moving load (only horizontal x matters most)
            const dx = px - stressTrainPos;
            const dist2 = dx * dx;

            // Gaussian proximity factor: 1.0 = directly under load, 0.0 = far away
            const proximity = Math.exp(-dist2 / stressSigma);

            // Height factor: lower members carry more load
            const heightFactor = 1.0 - Math.min(1, py / 105);

            // Combined intensity: red when loaded, cyan when unloaded
            const intensity = Math.min(1, proximity * 1.5 + heightFactor * 0.3);

            // Interpolate: Deep Red (0.94, 0.27, 0.27) ↔ Cool Cyan (0.02, 0.71, 0.83)
            const r = 0.02 + 0.92 * intensity;
            const g = 0.71 - 0.44 * intensity;
            const b = 0.83 - 0.56 * intensity;

            colorAttr.setXYZ(i, r, g, b);
        }
        colorAttr.needsUpdate = true;
    }

    // ----- Animation Loop -----
    function animate() {
        requestAnimationFrame(animate);
        if (controls) controls.update();

        // When in stress mode, animate the moving load
        if (currentViewMode === 'stress') {
            stressTrainPos += stressTrainSpeed;
            // Loop back to left side when train passes the right end
            if (stressTrainPos > span) {
                stressTrainPos = -span;
            }
            updateStressColors();
        }

        renderer.render(scene, camera);
    }
    animate();

    // ----- Handle viewer resize -----
    const resizeObserver = new ResizeObserver(() => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    resizeObserver.observe(canvas.parentElement);
}


/**
 * buildChenabArch — EXACT math from user's specification.
 * Generates the heavy truss arch geometry. Returns references
 * to the truss lines and deck mesh for material swapping.
 */
function buildChenabArch(scene) {
    const bridgeGroup = new THREE.Group();

    // Bridge geometry constants (from the user's exact spec)
    const span = 180;
    const archHeight = 90;
    const deckY = 105;
    const archDepth = 6;
    const archWidth = 14;

    const points = [];

    /**
     * getArchY — Parabolic arch equation.
     * @param {number} x - horizontal position along span
     * @param {boolean} isTop - true = top chord, false = bottom chord
     */
    const getArchY = (x, isTop) => {
        const a = archHeight / (span * span);
        return isTop
            ? -a * (x * x) + archHeight
            : -a * (x * x) + archHeight - archDepth;
    };

    // ----- Generate all line-segment points (exact user code) -----
    const steps = 45;
    const stepX = (span * 2) / steps;

    for (let i = 0; i < steps; i++) {
        const x1 = -span + i * stepX;
        const x2 = x1 + stepX;
        const y1TL = getArchY(x1, true);
        const y1BL = getArchY(x1, false);
        const y2TL = getArchY(x2, true);
        const y2BL = getArchY(x2, false);
        const zL = -archWidth / 2;
        const zR = archWidth / 2;

        // Chords & Bracing (exactly as specified)
        points.push(new THREE.Vector3(x1, y1TL, zL), new THREE.Vector3(x2, y2TL, zL));
        points.push(new THREE.Vector3(x1, y1BL, zL), new THREE.Vector3(x2, y2BL, zL));
        points.push(new THREE.Vector3(x1, y1TL, zR), new THREE.Vector3(x2, y2TL, zR));
        points.push(new THREE.Vector3(x1, y1BL, zR), new THREE.Vector3(x2, y2BL, zR));
        points.push(new THREE.Vector3(x1, y1BL, zL), new THREE.Vector3(x2, y2TL, zL));
        points.push(new THREE.Vector3(x1, y1BL, zR), new THREE.Vector3(x2, y2TL, zR));
        points.push(new THREE.Vector3(x1, y1TL, zL), new THREE.Vector3(x2, y2TL, zR));

        // Spandrels — vertical columns to deck (every 2nd step)
        if (i % 2 === 0) {
            points.push(new THREE.Vector3(x1, y1TL, zL), new THREE.Vector3(x1, deckY, zL));
            points.push(new THREE.Vector3(x1, y1TL, zR), new THREE.Vector3(x1, deckY, zR));
        }
    }

    // ----- Build stress-map colors for each vertex -----
    // Used when Stress Map mode is active.
    const stressColors = [];
    points.forEach(p => {
        const t = Math.max(0, Math.min(1, p.y / deckY));
        // Red (base / loaded) → Cyan (top / unloaded)
        stressColors.push(
            0.94 * (1 - t) + 0.02 * t,   // R
            0.27 * (1 - t) + 0.71 * t,    // G
            0.27 * (1 - t) + 0.83 * t     // B
        );
    });

    // ----- Create geometry with vertex colors -----
    const trussGeo = new THREE.BufferGeometry().setFromPoints(points);
    trussGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(stressColors), 3));

    // Default material (will be swapped per view mode)
    const trussMat = new THREE.LineBasicMaterial({ color: 0x06b6d4 });
    const trussLines = new THREE.LineSegments(trussGeo, trussMat);
    bridgeGroup.add(trussLines);

    // ----- Deck mesh -----
    const deckGeo = new THREE.BoxGeometry(span * 3.5, 3, archWidth + 6);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x223344 });
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, deckY, 0);
    bridgeGroup.add(deckMesh);

    // Position the entire bridge
    bridgeGroup.position.set(0, -40, 0);
    scene.add(bridgeGroup);

    // Return references for view mode switching
    return { bridgeGroup, trussLines, trussGeo, deckMesh };
}


/**
 * applyViewMode — Switches the material/style of the Chenab bridge.
 * @param {'realistic'|'blueprint'|'stress'} mode
 * @param {Object} bridgeData - returned from buildChenabArch
 * @param {THREE.Scene} scene
 * @param {THREE.GridHelper} gridHelper
 */
function applyViewMode(mode, bridgeData, scene, gridHelper) {
    const { trussLines, deckMesh } = bridgeData;

    switch (mode) {
        case 'realistic':
            // Dark metallic gray tones, solid look
            scene.background = new THREE.Color(0x080810);
            trussLines.material = new THREE.LineBasicMaterial({
                color: 0x8899aa,
                linewidth: 1
            });
            deckMesh.material = new THREE.MeshStandardMaterial({
                color: 0x334455,
                roughness: 0.7,
                metalness: 0.4
            });
            gridHelper.visible = false;
            break;

        case 'blueprint':
            // Cyan wireframe on dark navy background
            scene.background = new THREE.Color(0x040820);
            trussLines.material = new THREE.LineBasicMaterial({
                color: 0x06b6d4,
                transparent: true,
                opacity: 0.8
            });
            deckMesh.material = new THREE.MeshBasicMaterial({
                color: 0x0a2040,
                wireframe: true,
                transparent: true,
                opacity: 0.5
            });
            gridHelper.visible = true;
            break;

        case 'stress':
            // Vertex-colored stress map: red (base) → cyan (top)
            scene.background = new THREE.Color(0x0a0a0f);
            trussLines.material = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.9
            });
            deckMesh.material = new THREE.MeshBasicMaterial({
                color: 0x223344,
                transparent: true,
                opacity: 0.6
            });
            gridHelper.visible = false;
            break;
    }
}


/* -------------------------------------------------------
   5. MODAL SYSTEM — Generic open/close for all modals.
   Uses [data-open] / [data-close] attributes on buttons.
   All modals (flood, drainage, resume, chenab) use the
   same mechanism. To disable any modal, comment out the
   classList.add('open') call without breaking the site.
   ------------------------------------------------------- */

function initModals() {

    // =====================================================
    // GENERIC MODALS — uses [data-open] / [data-close]
    // =====================================================
    document.querySelectorAll('[data-open]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.open;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close triggers (close buttons inside modals)
    document.querySelectorAll('[data-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modalId = closeBtn.dataset.close;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Backdrop click to close — works for ALL modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Escape key to close any open modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.open').forEach(modal => {
                modal.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    });

    // Resume button (special case — no data-open attribute)
    const btnResume = document.getElementById('btn-resume');
    if (btnResume) {
        btnResume.addEventListener('click', () => {
            const modal = document.getElementById('modal-resume');
            if (modal) {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    }
}


/* -------------------------------------------------------
   6. GSAP ANIMATIONS — ScrollTrigger-based reveals,
   stat counter, and skill bar fills.
   ------------------------------------------------------- */
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Skipping animations.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ----- Section title reveals -----
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // ----- Glass card stagger reveals -----
    const cardGroups = [
        '.stats-row .stat-card',
        '.skills-grid .skill-card',
        '.cert-grid .cert-card',
        '.projects-grid .project-card'
    ];

    cardGroups.forEach(selector => {
        const cards = gsap.utils.toArray(selector);
        if (cards.length === 0) return;

        gsap.from(cards, {
            scrollTrigger: {
                trigger: cards[0].parentElement,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out'
        });
    });

    // ----- Stat counter animation -----
    // Counts up numbers in .stat-number elements
    gsap.utils.toArray('.stat-number[data-target]').forEach(numEl => {
        const target = parseInt(numEl.dataset.target, 10);
        const obj = { val: 0 };

        gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: numEl,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: () => {
                numEl.textContent = Math.round(obj.val);
            }
        });
    });

    // ----- Skill bar fill animation -----
    // Each .skill-fill has a data-width attribute (0–100) for its width percentage
    gsap.utils.toArray('.skill-fill').forEach(bar => {
        const targetWidth = bar.dataset.width + '%';

        gsap.to(bar, {
            width: targetWidth,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // ----- Analysis section two-column reveal -----
    const analysisDetails = document.querySelector('.analysis-details');
    const analysisViewer = document.querySelector('.analysis-viewer');

    if (analysisDetails) {
        gsap.from(analysisDetails, {
            scrollTrigger: {
                trigger: analysisDetails,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });
    }
    if (analysisViewer) {
        gsap.from(analysisViewer, {
            scrollTrigger: {
                trigger: analysisViewer,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });
    }

    // ----- Contact section reveals -----
    const contactLinks = document.querySelector('.contact-links');
    const terminalBox = document.querySelector('.terminal-box');

    if (contactLinks) {
        gsap.from(contactLinks, {
            scrollTrigger: {
                trigger: contactLinks,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }
    if (terminalBox) {
        gsap.from(terminalBox, {
            scrollTrigger: {
                trigger: terminalBox,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // ----- Hero overlay fade-in -----
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroOverlay) {
        gsap.from(heroOverlay, {
            y: 30,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
        });
    }
}
