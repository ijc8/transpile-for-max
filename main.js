self.outlets = 3

function play(pitch, velocity = 100, duration = 1000) {
    self.outlet(2, duration)
    self.outlet(1, velocity)
    self.outlet(0, pitch)
}

const console = {
    log(...args) {
        self.post(...args, "\n")
    },
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Useful for hot reloading.
self.running = false

function euclid(hits, length, offset = 0) {
    const beats = new Array(length)
    let counter = (length - hits) % length
    offset = (offset % length + length) % length

    for (let i = 0; i < length; i++) {
        counter += hits
        if (counter >= length) {
            counter -= length
            beats[(i + offset) % length] = 1
        } else {
            beats[(i + offset) % length] = 0
        }
    }

    return beats
}

const pitches = [36, 48, 60, 67, 69, 72, 77, 82]

async function buildup() {
    self.running = true

    const rhythms = {}
    for (const [index, pitch] of pitches.entries()) {
        rhythms[pitch] = euclid(index + 1, 8)
        for (let i = 0; i < 16; i++) {
            for (const [pitch, rhythm] of Object.entries(rhythms)) {
                console.log(i, pitch)
                if (rhythm[i % rhythm.length]) {
                    console.log("Play", pitch)
                    play(+pitch, 100, 200)
                }
            }
            await sleep(117)
        }
    }

    // const beats = euclid(3, 8)
    // for (let i = 0; self.running; i++) {
    //     if (beats[i % beats.length]) {
    //         play(60, 100, 200)
    //         play(64, 100, 200)
    //     }
    //     await sleep(117)
    // }
}

self.buildup = buildup
