function send(x) {
    outlet(0, x)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function buildup() {
    send(60)
    await sleep(500)
    send(64)
    await sleep(1000)
    send(67)
}

self.buildup = buildup
