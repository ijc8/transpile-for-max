// function send(x) {
//     outlet(0, x)
// }

// function setTimeout(task, timeout) {
//     let allowExecution = false
//     const tsk = new Task(() => {
//         if (allowExecution) {
//             task()
//             tsk.cancel()
//         }
//         allowExecution = true
//     })

//     tsk.interval = timeout
//     tsk.repeat(2)
// }

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
// }

// async function buildup() {
//     send(60)
//     // await sleep(1000)
//     await Promise.resolve()
//     send(72)
// }

function buildup() {
    Promise.resolve().then(function () { post("Hi!") })
}

jsthis.buildup = buildup
