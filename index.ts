let vertShaderSrc = require('./vert-shader.glsl')
let fragShaderSrc = require('./frag-shader.glsl')
import { factorial } from './example.rs'

function getWebglContext(): WebGLRenderingContext {
    let canvas = document.getElementById('canv') as HTMLCanvasElement | null

    if (!canvas) {
        console.log('oh now')
    }
    let context = canvas.getContext('webgl')
    return context
}

let gl = getWebglContext()


function createShader(context, type, src) {
    let shader = context.createShader(type)
    context.shaderSource(shader, src)
    context.compileShader(shader)
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        console.error('failed to compile', context.getShaderInfoLog(shader))
        return
    }
    return shader
}

let vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc)
let fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc)


let program = gl.createProgram()
gl.attachShader(program, vertShader)
gl.attachShader(program, fragShader)
gl.linkProgram(program)

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('failed to link', gl.getProgramInfoLog(program))
}
gl.validateProgram(program)
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('failed to validate', gl.getProgramInfoLog(program))
}
gl.clearColor(0, 0, 0, 1)
gl.useProgram(program)



setInterval(() => {
    // create buffers
    function rand() {
        return [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]
    }

    function colorRand() {
        return [Math.random(), Math.random(), Math.random()]
    }
    let triangleBuffers = [
    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),
    //    -0.5, 0.5, 0, 0, 1, 1,
    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),

    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),

    ...rand(), ...colorRand(),
    ...rand(), ...colorRand(),
    ...rand(), ...colorRand()
    ]


    let triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleBuffers), gl.DYNAMIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.enableVertexAttribArray(positionAttribLocation)

    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor')
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(colorAttribLocation)

    gl.useProgram(program)
    gl.clearColor(Math.random(), Math.random(), Math.random(), 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, triangleBuffers.length / 6)

}, 21)

 console.log(factorial(5))