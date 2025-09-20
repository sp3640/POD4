import React, { useState, useEffect } from 'react'
import '../../styles/CountdownTimer.css'

const CountdownTimer = ({ endTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(endTime) - new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    if (Object.keys(timeLeft).length === 0) {
      onComplete?.()
    }

    return () => clearTimeout(timer)
  })

  const timerComponents = []

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return
    }

    timerComponents.push(
      <span key={interval} className="time-segment">
        <span className="time-number">{timeLeft[interval]}</span>
        <span className="time-label">{interval}</span>
      </span>
    )
  })

  return (
    <div className="countdown-timer">
      {timerComponents.length ? (
        <div className="timer-display">
          {timerComponents}
        </div>
      ) : (
        <span className="timer-ended">Auction ended</span>
      )}
    </div>
  )
}

export default CountdownTimer