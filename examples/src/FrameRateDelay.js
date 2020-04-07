import * as THREE from 'three'
import React, { useEffect, useState } from 'react'

// lock the thread for <delay> ms by running useless code
const runJunk = (delay = 0) => {
  const start = Date.now()
  while (Date.now() < start + delay) {
    let a = 23123 + 312
    a = a * a
  }
}

export default () => {
  const [delay, setDelay] = useState(0)

  useEffect(() => {
    if (delay === 0) return

    let t

    const loop = () => {
      runJunk(delay)
      t = requestAnimationFrame(loop)
    }

    loop()

    return () => cancelAnimationFrame(t)
  }, [delay])

  return (
    <>
      <input
        style={{ marginLeft: '100px', width: '300px' }}
        type="range"
        min={0}
        max={100}
        step={5}
        value={delay}
        onChange={(e) => setDelay(+e.target.value)}
      />
      <div style={{ paddingLeft: '100px' }}>{Math.round(delay)}ms wasted / frame</div>
    </>
  )
}

// init stats
;(function () {
  var script = document.createElement('script')
  script.onload = function () {
    var stats = new window.Stats()
    document.body.appendChild(stats.dom)
    requestAnimationFrame(function loop() {
      stats.update()
      requestAnimationFrame(loop)
    })
  }
  script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'
  document.head.appendChild(script)
})()
