// Night drive down Route 47: a perspective highway with long-exposure traffic trails
// (headlights coming, taillights going), utility poles, sagging low-voltage lines and data
// pulses running along them. Plain canvas 2D. Pauses off-screen, and draws a single still
// frame for reduced motion.

type RGB = readonly [number, number, number]

const AMBER: RGB = [237, 177, 79]
const TEAL: RGB = [147, 200, 201]
const WARM_WHITE: RGB = [255, 240, 214]
const TAIL_RED: RGB = [255, 74, 58]

const CAM_H = 1.5 // camera height above the road (world units)
const LANE = 3.7
const ROAD_HALF = LANE * 2 + 0.4
const SPEED = 11 // world units per second
const DASH = 3.2
const GAP = 5.6
const POLE_GAP = 26
const POLE_X = ROAD_HALF + 3.4
const POLE_TOP = 8.4
const SAG = 1.15
const Z_FAR = 340

type Star = { x: number; y: number; r: number; phase: number; speed: number }
type Pulse = { side: -1 | 1; wire: number; z: number; v: number; color: RGB }
type Car = { x: number; z: number; v: number; color: RGB; oncoming: boolean }

const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// Small deterministic PRNG so the scene looks the same on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function startRoadScene(canvas: HTMLCanvasElement, { reducedMotion }: { reducedMotion: boolean }) {
  const maybeCtx = canvas.getContext('2d')
  if (!maybeCtx) return () => {}
  const ctx: CanvasRenderingContext2D = maybeCtx

  const rand = mulberry32(47)
  let width = 0
  let height = 0
  let horizon = 0
  let vpBase = 0
  let focal = 1
  let zNear = 1
  let time = 3.2
  let parallax = 0
  let parallaxTarget = 0
  let raf = 0
  let last = 0
  let onScreen = true
  let stars: Star[] = []
  let treeLine: number[] = []

  const wires = [
    { dx: -1.25, y: POLE_TOP - 0.7 },
    { dx: 1.25, y: POLE_TOP - 0.7 },
    { dx: 0, y: POLE_TOP + 0.05 },
  ]

  const pulses: Pulse[] = Array.from({ length: 16 }, (_, i) => spawnPulse(i % 2 ? 1 : -1, true))
  // Cars live between just below the bottom of the screen and far down the road.
  const carNear = () => Math.max(zNear, 2) * 0.8
  const carFar = Z_FAR * 0.8
  // Spread the cars out along their trips so there's traffic from the very first frame.
  const ONCOMING = 4
  const SAME_WAY = 4
  const cars: Car[] = [
    ...Array.from({ length: ONCOMING }, (_, i) => spawnCar(true, (i + rand() * 0.7) / ONCOMING)),
    ...Array.from({ length: SAME_WAY }, (_, i) => spawnCar(false, (i + rand() * 0.7) / SAME_WAY)),
  ]

  function spawnPulse(side: -1 | 1, anywhere = false): Pulse {
    const outbound = rand() > 0.35
    return {
      side,
      wire: Math.floor(rand() * wires.length),
      z: anywhere ? 6 + rand() * (Z_FAR - 40) : outbound ? 4 + rand() * 6 : Z_FAR - rand() * 40,
      v: (outbound ? 1 : -1) * SPEED * (1.6 + rand() * 1.6),
      color: rand() > 0.45 ? AMBER : TEAL,
    }
  }

  // Oncoming traffic (left lanes) rushes past with white headlights; traffic going our way
  // (right lanes) slowly pulls away showing red taillights. `v` is speed relative to the camera.
  // `progress` (0..1) starts a car part-way through its trip.
  function spawnCar(oncoming: boolean, progress?: number): Car {
    const lane = rand() > 0.5 ? 1.5 : 0.5
    const near = carNear()
    let z: number
    if (progress === undefined) z = oncoming ? carFar + rand() * 30 : near
    else z = oncoming ? carFar - (carFar - near) * progress : near + (carFar - near) * progress
    return {
      x: (oncoming ? -1 : 1) * LANE * lane,
      z,
      v: SPEED * (oncoming ? 1.9 + rand() * 0.6 : 0.3 + rand() * 0.45),
      color: oncoming ? WARM_WHITE : TAIL_RED,
      oncoming,
    }
  }

  const vpx = () => vpBase + parallax
  const sx = (x: number, z: number) => vpx() + (x * focal) / z
  const sy = (y: number, z: number) => horizon + ((CAM_H - y) * focal) / z
  const fog = (z: number) => clamp(1 - (z - zNear) / (Z_FAR - zNear), 0, 1) ** 1.35

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const wide = width >= 900
    horizon = height * (wide ? 0.6 : 0.68)
    vpBase = width * (wide ? 0.7 : 0.55)
    focal = height * (wide ? 0.95 : 0.8)
    zNear = (CAM_H * focal) / (height - horizon)

    const starRand = mulberry32(7)
    stars = Array.from({ length: Math.round((width * horizon) / 5200) }, () => ({
      x: starRand() * width,
      y: starRand() ** 1.6 * horizon * 0.92,
      r: 0.35 + starRand() * 0.95,
      phase: starRand() * Math.PI * 2,
      speed: 0.6 + starRand() * 1.8,
    }))

    // Rolling tree line along the horizon (northern Illinois is flat, but not bare).
    const treeRand = mulberry32(11)
    const step = 6
    const raw = Array.from({ length: Math.ceil(width / step) + 12 }, () => treeRand())
    treeLine = raw.map((_, i) => {
      let sum = 0
      for (let k = -3; k <= 3; k++) sum += raw[clamp(i + k, 0, raw.length - 1)]
      const clump = sum / 7
      return 2 + clump ** 2 * 26 + (raw[i] > 0.93 ? 8 : 0)
    })
  }

  function update(dt: number) {
    time += dt
    parallax += (parallaxTarget - parallax) * Math.min(1, dt * 3)

    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i]
      p.z += (p.v - SPEED) * dt
      if (p.z > Z_FAR || p.z < zNear * 0.7) pulses[i] = spawnPulse(p.side)
    }
    for (let i = 0; i < cars.length; i++) {
      const c = cars[i]
      c.z += (c.oncoming ? -c.v : c.v) * dt
      if (c.oncoming ? c.z < carNear() * 0.7 : c.z > carFar) cars[i] = spawnCar(c.oncoming)
    }
  }

  function drawSky() {
    const sky = ctx.createLinearGradient(0, 0, 0, horizon)
    sky.addColorStop(0, '#0a0c0e')
    sky.addColorStop(0.55, '#111418')
    sky.addColorStop(0.9, '#1d1c1a')
    sky.addColorStop(1, '#2a2419')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, width, horizon + 1)

    for (const s of stars) {
      const twinkle = reducedMotion ? 0.75 : 0.55 + 0.45 * Math.sin(time * s.speed + s.phase)
      ctx.fillStyle = `rgba(238,241,242,${(0.25 + 0.55 * twinkle) * (1 - s.y / horizon) ** 0.6})`
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fill()
    }

    const glow = ctx.createRadialGradient(vpx(), horizon, 0, vpx(), horizon, Math.max(width, height) * 0.62)
    glow.addColorStop(0, rgba(AMBER, 0.42))
    glow.addColorStop(0.18, rgba(AMBER, 0.16))
    glow.addColorStop(0.5, rgba(AMBER, 0.04))
    glow.addColorStop(1, rgba(AMBER, 0))
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)
  }

  function drawTreeLine() {
    const step = width / (treeLine.length - 12)
    const shift = (parallax * 0.25) % step
    ctx.fillStyle = '#0c0e10'
    ctx.beginPath()
    ctx.moveTo(-step * 6, horizon + 1)
    for (let i = 0; i < treeLine.length; i++) {
      const x = -step * 6 + i * step + shift
      // Trees shrink toward the vanishing point so the road reads as going "into" them.
      const nearVp = clamp(Math.abs(x - vpx()) / (width * 0.35), 0.25, 1)
      ctx.lineTo(x, horizon - treeLine[i] * nearVp)
    }
    ctx.lineTo(width + step * 6, horizon + 1)
    ctx.closePath()
    ctx.fill()
  }

  function drawGround() {
    const ground = ctx.createLinearGradient(0, horizon, 0, height)
    ground.addColorStop(0, '#15171a')
    ground.addColorStop(1, '#08090a')
    ctx.fillStyle = ground
    ctx.fillRect(0, horizon, width, height - horizon)

    // Road surface
    const zn = zNear * 0.8
    const road = ctx.createLinearGradient(0, horizon, 0, height)
    road.addColorStop(0, 'rgba(46,50,54,0.35)')
    road.addColorStop(1, 'rgba(38,42,46,0.9)')
    ctx.fillStyle = road
    ctx.beginPath()
    ctx.moveTo(sx(-ROAD_HALF, zn), sy(0, zn))
    ctx.lineTo(sx(ROAD_HALF, zn), sy(0, zn))
    ctx.lineTo(sx(ROAD_HALF, Z_FAR), sy(0, Z_FAR))
    ctx.lineTo(sx(-ROAD_HALF, Z_FAR), sy(0, Z_FAR))
    ctx.closePath()
    ctx.fill()

    // Solid edge lines
    for (const edge of [-ROAD_HALF + 0.25, ROAD_HALF - 0.25]) {
      ctx.fillStyle = 'rgba(214,222,224,0.28)'
      ctx.beginPath()
      ctx.moveTo(sx(edge - 0.08, zn), sy(0, zn))
      ctx.lineTo(sx(edge + 0.08, zn), sy(0, zn))
      ctx.lineTo(sx(edge + 0.08, Z_FAR), sy(0, Z_FAR))
      ctx.lineTo(sx(edge - 0.08, Z_FAR), sy(0, Z_FAR))
      ctx.closePath()
      ctx.fill()
    }

    // Dashed lane lines, the three lines from the shield
    const period = DASH + GAP
    const phase = (time * SPEED) % period
    for (const x0 of [-LANE, 0, LANE]) {
      const hw = x0 === 0 ? 0.11 : 0.085
      for (let z = zNear * 0.7 - phase; z < Z_FAR; z += period) {
        const z1 = Math.max(z, zNear * 0.7)
        const z2 = z + DASH
        if (z2 <= z1) continue
        const a = fog(z1) * (x0 === 0 ? 1 : 0.8)
        if (a <= 0.01) continue
        ctx.fillStyle = rgba(AMBER, a)
        ctx.beginPath()
        ctx.moveTo(sx(x0 - hw, z1), sy(0, z1))
        ctx.lineTo(sx(x0 + hw, z1), sy(0, z1))
        ctx.lineTo(sx(x0 + hw, z2), sy(0, z2))
        ctx.lineTo(sx(x0 - hw, z2), sy(0, z2))
        ctx.closePath()
        ctx.fill()
      }
    }
  }

  // Long-exposure light trails: a bright lamp at the car, with its streak fading out behind it.
  function drawCars() {
    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
    const cutoff = carNear() * 0.7
    for (const c of cars) {
      if (c.z < cutoff) continue
      const a = Math.min(1, fog(c.z) * 1.1)
      if (a <= 0.02) continue
      const zA = c.z
      const zB = Math.max(cutoff, c.oncoming ? c.z + 16 : c.z - 11)
      const y = c.oncoming ? 0.7 : 0.8
      const w = clamp((0.2 * focal) / zA, 1, 7)
      for (const side of [-0.8, 0.8]) {
        const x1 = sx(c.x + side, zA)
        const y1 = sy(y, zA)
        const x2 = sx(c.x + side, zB)
        const y2 = sy(y, zB)
        // soft glow first, then the bright core
        for (const [lineWidth, alpha] of [
          [w * 3.2, a * 0.22],
          [w, a],
        ]) {
          const grad = ctx.createLinearGradient(x1, y1, x2, y2)
          grad.addColorStop(0, rgba(c.color, alpha))
          grad.addColorStop(1, rgba(c.color, 0))
          ctx.strokeStyle = grad
          ctx.lineWidth = lineWidth
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        const r = w * 2.4
        const lamp = ctx.createRadialGradient(x1, y1, 0, x1, y1, r)
        lamp.addColorStop(0, rgba(c.color, a))
        lamp.addColorStop(1, rgba(c.color, 0))
        ctx.fillStyle = lamp
        ctx.fillRect(x1 - r, y1 - r, r * 2, r * 2)
      }
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  const poleOffset = () => (time * SPEED) % POLE_GAP
  const firstPoleZ = () => POLE_GAP * 0.35 - poleOffset()

  function wireY(z: number, wireIndex: number) {
    const rel = (z - firstPoleZ()) / POLE_GAP
    const s = rel - Math.floor(rel)
    return wires[wireIndex].y - SAG * 4 * s * (1 - s)
  }

  function drawPolesAndWires() {
    const z0 = firstPoleZ()
    const poles: number[] = []
    for (let z = z0; z < Z_FAR; z += POLE_GAP) poles.push(z)

    // Wires: sampled catenary between each pair of poles.
    ctx.lineWidth = 1.1
    for (const side of [-1, 1] as const) {
      for (let w = 0; w < wires.length; w++) {
        const x = side * POLE_X + wires[w].dx
        for (let i = 0; i < poles.length - 1; i++) {
          const za = Math.max(poles[i], zNear * 0.5)
          const zb = poles[i + 1]
          if (zb <= za) continue
          const a = fog(za) * (side === -1 ? 0.28 : 0.42)
          if (a <= 0.01) continue
          ctx.strokeStyle = rgba(TEAL, a)
          ctx.beginPath()
          let started = false
          for (let k = 0; k <= 14; k++) {
            const z = poles[i] + ((zb - poles[i]) * k) / 14
            if (z < za) continue
            const X = sx(x, z)
            const Y = sy(wireY(z, w), z)
            if (started) ctx.lineTo(X, Y)
            else ctx.moveTo(X, Y)
            started = true
          }
          ctx.stroke()
        }
      }
    }

    // Poles, far to near so the closest one sits on top.
    for (let i = poles.length - 1; i >= 0; i--) {
      const z = poles[i]
      if (z < zNear * 0.5) continue
      for (const side of [-1, 1]) {
        const x = side * POLE_X
        const a = fog(z) * (side === -1 ? 0.55 : 0.85)
        if (a <= 0.01) continue
        const w = Math.max(1.2, (0.26 * focal) / z)
        ctx.fillStyle = `rgba(6,7,8,${Math.min(1, a + 0.15)})`
        ctx.fillRect(sx(x, z) - w / 2, sy(POLE_TOP + 0.5, z), w, sy(0, z) - sy(POLE_TOP + 0.5, z))
        const armY = sy(POLE_TOP - 0.6, z)
        ctx.fillRect(sx(x - 1.6, z), armY - w * 0.25, sx(x + 1.6, z) - sx(x - 1.6, z), Math.max(1, w * 0.5))
        // Amber insulator glints
        ctx.fillStyle = rgba(AMBER, a * 0.8)
        for (const dx of [-1.25, 1.25]) {
          ctx.beginPath()
          ctx.arc(sx(x + dx, z), armY - w * 0.4, Math.max(0.8, w * 0.28), 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }

  function drawPulses() {
    ctx.globalCompositeOperation = 'lighter'
    for (const p of pulses) {
      if (p.z < zNear * 0.7) continue
      const a = fog(p.z)
      if (a <= 0.02) continue
      const x = p.side * POLE_X + wires[p.wire].dx
      const dir = Math.sign(p.v)
      // Short comet tail behind the pulse
      for (let k = 5; k >= 0; k--) {
        const z = p.z - dir * k * 0.9
        if (z < zNear * 0.7) continue
        const X = sx(x, z)
        const Y = sy(wireY(z, p.wire), z)
        const r = Math.max(1.4, (0.34 * focal) / z) * (1 - k * 0.12)
        const g = ctx.createRadialGradient(X, Y, 0, X, Y, r * 3.2)
        g.addColorStop(0, rgba(p.color, a * (1 - k * 0.16)))
        g.addColorStop(0.35, rgba(p.color, a * 0.35 * (1 - k * 0.16)))
        g.addColorStop(1, rgba(p.color, 0))
        ctx.fillStyle = g
        ctx.fillRect(X - r * 3.2, Y - r * 3.2, r * 6.4, r * 6.4)
      }
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  let ready = false
  function draw() {
    drawSky()
    drawTreeLine()
    drawGround()
    drawCars()
    drawPolesAndWires()
    drawPulses()
    if (!ready) {
      ready = true
      canvas.classList.add('is-ready')
    }
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0)
    last = now
    update(dt)
    draw()
    raf = requestAnimationFrame(frame)
  }

  function play() {
    if (reducedMotion || raf || !onScreen || document.hidden) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function pause() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const ro = new ResizeObserver(() => {
    resize()
    if (!raf) draw()
  })
  ro.observe(canvas)

  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    if (onScreen) play()
    else pause()
  })
  io.observe(canvas)

  const onVisibility = () => (document.hidden ? pause() : play())
  document.addEventListener('visibilitychange', onVisibility)

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    parallaxTarget = (e.clientX / window.innerWidth - 0.5) * -48
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  resize()
  draw()
  play()

  return () => {
    pause()
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointer)
  }
}
