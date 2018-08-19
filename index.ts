let vertShaderSrc = require('./vert-shader.glsl')
let fragShaderSrc = require('./frag-shader.glsl')
// import { factorial } from './example.rs'
import * as glMatrix from 'gl-matrix'
let canvas = document.getElementById('canv') as HTMLCanvasElement | null
canvas.style.width = window.innerHeight + 'px'
canvas.style.height = window.innerHeight + 'px'

function getWebglContext(): WebGLRenderingContext {

    if (!canvas) {
        console.log('oh now')
    }
    let context = canvas.getContext('webgl')
    return context
}

let gl = getWebglContext()
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.CULL_FACE)


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

    var boxVertices = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
    ]
	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];


    let boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.DYNAMIC_DRAW)

    let boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.DYNAMIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.enableVertexAttribArray(positionAttribLocation)

    let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord')
    gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(texCoordAttribLocation)

    let boxTexture = gl.createTexture()
    let imageTexture: HTMLImageElement = document.getElementById('crate-texture') as HTMLImageElement
    gl.bindTexture(gl.TEXTURE_2D, boxTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageTexture)
    gl.bindTexture(gl.TEXTURE_2D, null)

    gl.useProgram(program)
    let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
    let matViewUniformLocation = gl.getUniformLocation(program, 'mView')
    let matProjUniformLocation = gl.getUniformLocation(program, 'mProj')
    
    let worldMatrix = new Float32Array(16)
    let viewMatrix = new Float32Array(16)
    let projMatrix = new Float32Array(16)

    glMatrix.mat4.identity(worldMatrix)
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0])
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(50), canvas.width/canvas.height, 0.1, 1000)

    gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix)
    gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix)
    gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix)
    
    let angle = 0;
    let idMatrix = new Float32Array(16)
    glMatrix.mat4.identity(idMatrix)

    let loop = () => {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(worldMatrix, idMatrix, angle, [1, 1, 0])
        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix)
        gl.clearColor(0, Math.abs(1 - Math.tan(angle)), Math.abs(1 / Math.sin(angle)), 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.bindTexture(gl.TEXTURE_2D, boxTexture)
        gl.activeTexture(gl.TEXTURE0)
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)
        requestAnimationFrame(loop)
    }
    loop()
