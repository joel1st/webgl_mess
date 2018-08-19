precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

// varying vec3 fragColor;
varying vec2 fragTexCoord;

void main()
{
    fragTexCoord = vertTexCoord;
    vec4 newPos = mProj * mView * mWorld * vec4(vertPosition, 1);
    gl_Position = newPos;
}