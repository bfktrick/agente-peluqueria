'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Outer ring — slower spring, follows with lag
  const outerX = useSpring(mouseX, { stiffness: 200, damping: 24, mass: 0.5 })
  const outerY = useSpring(mouseY, { stiffness: 200, damping: 24, mass: 0.5 })

  // Inner dot — faster spring, nearly instant
  const innerX = useSpring(mouseX, { stiffness: 800, damping: 30 })
  const innerY = useSpring(mouseY, { stiffness: 800, damping: 30 })

  const isHovering = useRef(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleEnterClickable = () => {
      isHovering.current = true
    }
    const handleLeaveClickable = () => {
      isHovering.current = false
    }

    window.addEventListener('mousemove', handleMove)

    // Enlarge cursor on interactive elements
    const clickables = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, label'
    )
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', handleEnterClickable)
      el.addEventListener('mouseleave', handleLeaveClickable)
    })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      clickables.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnterClickable)
        el.removeEventListener('mouseleave', handleLeaveClickable)
      })
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-green-sage mix-blend-difference"
        style={{
          x: outerX,
          y: outerY,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-green-bright"
        style={{
          x: innerX,
          y: innerY,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
        }}
      />
    </>
  )
}
