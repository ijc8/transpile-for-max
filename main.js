self.outlets = 3

function play(pitch, velocity = 100, duration = 1000) {
    // Send note data out to a `makenote` object.
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

// Piece is 512 beats in 60 seconds.
const pieceLength = 512
const noteDur = 200
const beatDur = (60 * 1000 - noteDur) / pieceLength

const pitches = [36, 48, 60, 67, 69, 72, 74, 75]

async function playPiece() {
    self.running = true

    const rhythms = []
    async function buildUp() {
        // Section 1: Gradually layer on increasingly busy Euclidean rhythms.
        for (const [index, pitch] of pitches.entries()) {
            rhythms.push([pitch, euclid(index + 1, 8)])
            await sleep(beatDur * 32)
        }
        rhythms[rhythms.length - 1][0] += 1
    }

    let silentProb = 0
    async function tearDown() {
        // Section 2: Gradually filter out more and more notes.
        for (let i = 0; i < 256; i++) {
            silentProb = i / 255
            await sleep(beatDur)
        }
    }

    // Start section processes in the background.
    buildUp().then(tearDown)

    // Throughout both sections, play all the current layers.
    for (let i = 0; self.running; i++) {
        for (const [pitch, rhythm] of rhythms) {
            if (rhythm[i % rhythm.length] && Math.random() > silentProb) {
                play(pitch, 100, noteDur)
            }
        }
        await sleep(beatDur)
    }
}

self.play = playPiece
