// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'esm',
            sourcemap: true,
        },
        {
            file: 'dist/umd.js',
            name: 'objectToFormData',
            format: 'umd',
            sourcemap: true,
        },
    ],
    plugins: [typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }), terser()],
};
