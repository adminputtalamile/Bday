import confetti from 'canvas-confetti'

const PALETTE = ['#ff7a93', '#eac581', '#f3dcae', '#d94f70', '#ffffff']

export function burstConfetti() {
  const duration = 1600
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors: PALETTE,
      scalar: 0.9,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors: PALETTE,
      scalar: 0.9,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()

  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: PALETTE,
  })
}

export function grandFinaleConfetti() {
  const end = Date.now() + 3200
  ;(function frame() {
    confetti({
      particleCount: 5,
      startVelocity: 35,
      spread: 360,
      ticks: 200,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
      colors: PALETTE,
      scalar: 1.1,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()

  confetti({
    particleCount: 160,
    spread: 130,
    startVelocity: 55,
    origin: { y: 0.5 },
    colors: PALETTE,
  })
}
