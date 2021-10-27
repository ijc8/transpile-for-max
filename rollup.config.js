import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    dir: 'output',
    format: 'iife'
  },
  plugins: [
    babel({ babelHelpers: "inline" }),
    commonjs({
      include: ["node_modules/**"],
    }),  
    nodeResolve(),
  ]
};
