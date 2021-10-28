self.outlets = 3

// Handy for debugging. (self.post dumps things on the same line.)
const console = {
    log(...args) {
        self.post(...args, "\n")
    },
}

// Useful for hot reloading (with e.g. `npx rollup -c -w`).
self.running = false

function sleep(ms) {
    if (!self.running) {
        // Convenient place for user to cancel the piece.
        throw new Error("Interrupted by user.")
    }
    return new Promise(resolve => setTimeout(resolve, ms))
}

function play(pitch, velocity = 100, duration = 1000) {
    // Send note data out to a `makenote` object.
    self.outlet(2, duration)
    self.outlet(1, velocity)
    self.outlet(0, pitch)
}

function euclid(hits, length, offset = 0) {
    // Generate Euclidean rhythm with given parameters.
    // Returns an array of 1's (indicating onsets) and 0's (indicating rests).
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

let history = [...new Array(8)].map(_ => new Array(8).fill(0))

async function playPiece() {
    // Clear history (in case the piece is being restarted).
    for (const states of history) {
        states.fill(0)
    }

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
    for (let beat = 0; beat < 512; beat++) {
        // First, shift history by one to make room for the new states.
        // (We avoid allocating new arrays because Max gets noticeably sluggish...)
        for (let i = 7; i > 0; i--) {
            for (let j = 0; j < 8; j++) {
                history[i][j] = history[i - 1][j]
            }
        }
        for (const [i, [pitch, rhythm]] of rhythms.entries()) {
            if (rhythm[beat % rhythm.length] && Math.random() > silentProb) {
                play(pitch, 100, noteDur)
                history[0][i] = pitch
            } else {
                history[0][i] = 0
            }
        }
        canvas.redraw()
        await sleep(beatDur)
    }
}

// Entry point for Max.
self.msg_int = (x) => {
    if (x > 0) {
        self.running = true
        playPiece()
    } else {
        self.running = false
    }
}

// Graphics.
const canvas = self.mgraphics
canvas.init()
canvas.relative_coords = 1
canvas.autofill = 0

const colors = {
    36: [0, 0, 0],
    48: [1, 0, 0],
    60: [0, 0, 1],
    67: [0, 1, 0],
    69: [1, 1, 0],
    72: [1, 1, 1],
    74: [0, 1, 1],
    75: [0.8, 0.3, 0.5],
    76: [1, 0.13, 1],
}

self.paint = () => {
    for (const [i, states] of history.entries()) {
        for (const [j, pitch] of states.entries()) {
            if (pitch) {
                canvas.set_source_rgb(...colors[pitch])
                const x = (1 - (i + 1) / states.length) * 2 - 1
                const y = ((j + 1) / states.length) * 2 - 1
                canvas.rectangle(x, y, 1 / 4, 1 / 4)
                canvas.fill()
            }
        }
    }
}
