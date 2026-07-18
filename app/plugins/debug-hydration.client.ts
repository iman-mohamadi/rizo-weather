export default defineNuxtPlugin(() => {
  const w = window as unknown as { __mm?: string[] }
  w.__mm = []
  const orig = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    const msg = args.map((a) => {
      const n = a as { nodeName?: string, outerHTML?: string, textContent?: string }
      if (n && n.nodeName) return `<${n.nodeName}> ${(n.outerHTML || n.textContent || '').slice(0, 200)}`
      return String(a)
    }).join(' || ')
    if (msg.includes('ydrat') || msg.includes('mismatch')) w.__mm!.push(msg)
    orig(...args)
  }
})
