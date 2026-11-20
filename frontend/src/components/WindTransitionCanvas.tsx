import { memo, useEffect, useRef } from 'react'

// Keep the original leaf timings/positions, but draw into a single canvas
// rather than animating hundreds of independent DOM images.
const sprites = ['/leaf-green.png', '/leaf-lightgreen.png', '/leaf-yellow.png']
const COUNT = 256
const COVER_START = 64
const scatter = (seed: number) => {
  const n = Math.sin(seed * 127.1 + 78.233) * 43758.5453
  return n - Math.floor(n)
}
const leaves = Array.from({ length: COUNT }, (_, i) => {
  const covering = i >= COVER_START
  const index = i - COVER_START
  const col = index % 16
  const row = Math.floor(index / 16) % 10
  const layer = Math.floor(index / 160)
  const progress = (i + 1) / COUNT
  const arrival = .03 + 2.05 * Math.log1p(progress * Math.expm1(5)) / 5
  return {
    image: i % sprites.length,
    covering,
    x: covering ? (col + .5 + (scatter(i + 211) - .5) * .48 + (layer === 1 ? .3 : 0)) * .0625 : 0,
    y: covering ? (row + .5 + (scatter(i + 223) - .5) * .4 + (layer === 1 ? .25 : 0)) * .1 : .06 + scatter(i + 17) * .88,
    rotation: (scatter(i + 39) * 360 - 180) * Math.PI / 180,
    spin: (scatter(i + 51) > .5 ? 1 : -1) * (120 + scatter(i + 71) * 250) * Math.PI / 180,
    delay: arrival,
    duration: covering ? 3.8 - arrival : 1.25 + scatter(i + 113) * .4,
    size: covering ? 19 + scatter(i + 179) * 4 : 11 + scatter(i + 157) * 4,
    drift: covering ? 0 : Math.round((scatter(i + 197) - .5) * 3),
  }
})
const clamp = (n: number) => Math.max(0, Math.min(1, n))

const WindTransitionCanvas = memo(function WindTransitionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return
    let cancelled = false
    let frame = 0
    let lastFrame = -Infinity
    const start = performance.now()
    const images = sprites.map(src => {
      const image = new Image()
      image.src = src
      return image
    })

    const draw = (now: number) => {
      if (cancelled) return
      frame = requestAnimationFrame(draw)
      // Limit canvas raster work to 55fps; animation still follows elapsed wall-clock time.
      const frameInterval = 1000 / 45
      if (lastFrame !== -Infinity && now - lastFrame < frameInterval) return
      // Carry fractional frame time forward to maintain consistent scheduling.
      lastFrame = lastFrame === -Infinity
        ? now
        : now - ((now - lastFrame) % frameInterval)

      const bounds = canvas.getBoundingClientRect()
      const w = bounds.width
      const h = bounds.height
      if (!w || !h) return
      // Render at 1 physical pixel per CSS pixel to cap the canvas workload on tablets.
      const pixelW = Math.max(1, Math.round(w))
      const pixelH = Math.max(1, Math.round(h))
      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW
        canvas.height = pixelH
      }
      ctx.clearRect(0, 0, pixelW, pixelH)
      const seconds = (now - start) / 1000
      // CSS vw/vh in the original animation were relative to the browser viewport.
      const vw = window.innerWidth / 100
      const vh = window.innerHeight / 100
      const sx = pixelW / w
      const sy = pixelH / h

      for (const leaf of leaves) {
        const local = (seconds - leaf.delay) / leaf.duration
        if (local < 0 || local > 1) continue
        const image = images[leaf.image]
        if (!image.complete || !image.naturalWidth) continue

        const opacity = leaf.covering
          ? Math.min(clamp(local / .08), clamp((1 - local) / .12))
          : Math.min(clamp(local / .12), clamp((1 - local) / .18))
        if (opacity <= 0) continue

        const size = leaf.size * vw
        const aspect = image.naturalHeight / image.naturalWidth
        const imageH = size * aspect
        // CSS translate percentages are relative to the image itself; vw is viewport-relative.
        const travelX = leaf.covering
          ? (-140 + 265 * local) * vw
          : (-22 + 142 * local) * vw
        const travelY = leaf.covering ? -imageH * .5 : -imageH * .5 + leaf.drift * vh * local
        const scale = leaf.covering ? 1.15 - .05 * local : .8 + .2 * local
        const angle = leaf.rotation + leaf.spin * local

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.translate((leaf.x * w + size / 2 + travelX) * sx, (leaf.y * h + imageH / 2 + travelY) * sy)
        ctx.rotate(angle)
        ctx.scale(scale * sx, scale * sy)
        ctx.drawImage(image, -size / 2, -imageH / 2, size, imageH)
        ctx.restore()
      }
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="wind-transition" aria-hidden="true">
      <canvas ref={canvasRef} className="wind-transition-canvas" />
    </div>
  )
})
export default WindTransitionCanvas
