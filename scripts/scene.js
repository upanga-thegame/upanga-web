const canvas = document.querySelector('#scene-canvas');
const context = canvas?.getContext('2d');

if (context) {
    const section = canvas.parentElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stacked = window.matchMedia('(max-width: 900px)');
    const bands = 7;
    const segments = 12;
    const vertices = [[0, -1, 0], [0, 1, 0]];
    const edges = [];
    for (let band = 1; band < bands; band += 1) {
        const latitude = Math.PI * band / bands;
        const offset = vertices.length;
        for (let point = 0; point < segments; point += 1) {
            const longitude = 2 * Math.PI * (point + (band % 2) / 2) / segments;
            vertices.push([Math.sin(latitude) * Math.cos(longitude), -Math.cos(latitude), Math.sin(latitude) * Math.sin(longitude)]);
            const index = offset + point;
            const next = offset + (point + 1) % segments;
            edges.push([index, next]);
            if (band === 1) {
                edges.push([0, index]);
            } else {
                const diagonal = (point + (band % 2 ? 1 : segments - 1)) % segments;
                edges.push([index, index - segments], [index, offset - segments + diagonal]);
            }
            if (band === bands - 1) edges.push([1, index]);
        }
    }

    const particles = Array.from({ length: 125 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: 0.85 + Math.random() * 1.8,
        depth: 0.25 + Math.random() * 0.75,
    }));
    let width = 0;
    let height = 0;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let mouseX = 0;
    let mouseY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const draw = () => {
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#c9f36a';
        const particleShiftX = offsetX * Math.min(width * 0.16, 105);
        const particleShiftY = offsetY * Math.min(height * 0.18, 66);
        for (const particle of particles) {
            const drift = Math.sin(elapsed * 0.35 + particle.x * 14) * 8;
            const x = particle.x * width + particleShiftX * particle.depth + drift;
            const y = particle.y * height + particleShiftY * particle.depth;
            context.globalAlpha = particle.depth * 0.7;
            context.fillRect(x, y, particle.size, particle.size);
        }
        context.globalAlpha = 1;

        const centerX = width * (stacked.matches ? 0.5 : 0.26) + offsetX * Math.min(width * 0.12, 66);
        const centerY = height / 2 + offsetY * Math.min(height * 0.12, 44);
        const radius = Math.min(height * 0.42, width * (stacked.matches ? 0.44 : 0.19), 220);
        const angle = elapsed * 0.16 + offsetX * 0.68;
        const pitch = 0.23 + offsetY * 0.5;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        const projected = vertices.map(([x, y, z]) => {
            const rotatedX = x * cosAngle + z * sinAngle;
            const rotatedZ = z * cosAngle - x * sinAngle;
            const depth = y * sinPitch + rotatedZ * cosPitch;
            const scale = radius / (1 - depth * 0.22);
            return [centerX + rotatedX * scale, centerY + (y * cosPitch - rotatedZ * sinPitch) * scale, depth];
        });

        for (const front of [false, true]) {
            context.beginPath();
            for (const [from, to] of edges) {
                const a = projected[from];
                const b = projected[to];
                if ((a[2] + b[2] >= 0) !== front) continue;
                context.moveTo(a[0], a[1]);
                context.lineTo(b[0], b[1]);
            }
            context.strokeStyle = front ? 'rgba(124, 226, 206, .48)' : 'rgba(124, 226, 206, .17)';
            context.lineWidth = front ? 1.15 : 1;
            context.stroke();
        }
    };

    const resize = () => {
        width = section.clientWidth;
        height = section.clientHeight;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        draw();
    };

    const tick = (time) => {
        const delta = Math.max(0, Math.min((time - lastTime) / 1000, 0.05));
        lastTime = time;
        elapsed += delta;
        const ease = 1 - Math.exp(-delta * 9);
        offsetX += (mouseX - offsetX) * ease;
        offsetY += (mouseY - offsetY) * ease;
        draw();
        frame = requestAnimationFrame(tick);
    };

    const updatePlayback = () => {
        if (visible && !motion.matches) {
            if (!frame) {
                lastTime = performance.now();
                frame = requestAnimationFrame(tick);
            }
        } else {
            cancelAnimationFrame(frame);
            frame = 0;
        }
    };

    window.addEventListener('pointermove', (event) => {
        if (motion.matches || event.pointerType === 'touch') return;
        mouseX = 2 * event.clientX / window.innerWidth - 1;
        mouseY = 2 * event.clientY / window.innerHeight - 1;
    }, { passive: true });
    const resetPointer = () => {
        mouseX = 0;
        mouseY = 0;
    };
    document.documentElement.addEventListener('pointerleave', resetPointer);
    window.addEventListener('pointercancel', resetPointer);
    window.addEventListener('blur', resetPointer);
    motion.addEventListener('change', () => {
        if (motion.matches) {
            resetPointer();
            offsetX = 0;
            offsetY = 0;
            draw();
        }
        updatePlayback();
    });
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
    }).observe(section);
    new ResizeObserver(resize).observe(section);
    resize();
}
