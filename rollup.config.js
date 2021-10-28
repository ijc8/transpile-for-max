import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

export default {
    input: "main.js",
    output: {
        banner: `var self = this

function setTimeout(task, timeout) {
    var allowExecution = false
    var tsk = new Task(function () {
        if (allowExecution) {
            task()
            tsk.cancel()
        }
        allowExecution = true
    })

    tsk.interval = timeout
    tsk.repeat(2)
}`,
        file: "../bundle.js",
        format: "iife",
    },
    plugins: [
        babel({ babelHelpers: "inline" }),
        commonjs({
            include: ["node_modules/**"],
        }),
        nodeResolve(),
        terser(),
    ],
}
