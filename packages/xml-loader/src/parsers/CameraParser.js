const {Camera} = require('@snakesilk/engine');
const {ensure, children} = require('../util/traverse');
const Parser = require('./Parser');

class CameraParser extends Parser
{
    getCamera(cameraNode) {
        return Promise.resolve(this.parseCamera(cameraNode));
    }

    parseCamera(cameraNode) {
        ensure(cameraNode, 'camera');

        const camera = new Camera();
        const smoothing = this.getFloat(cameraNode, 'smoothing');
        if (smoothing) {
            camera.smoothing = smoothing;
        }

        const positionNode = children(cameraNode, 'position')[0];
        if (positionNode) {
            const position = this.getPosition(positionNode);
            camera.position.copy(position);
        }

        const pathNodes = children(cameraNode, 'path');
        for (let pathNode, i = 0; pathNode = pathNodes[i]; ++i) {
            const path = this.parseCameraPath(pathNode);
            camera.addPath(path);
        }

        return camera;
    }

    parseCameraPath(pathNode)
    {
        ensure(pathNode, 'path');

        const z = 150;
        const path = new Camera.Path();
        /* y1 and y2 is swapped because they are converted to negative values and
           y2 should always be bigger than y1. */
        const windowNode = pathNode.getElementsByTagName('window')[0];
        path.window[0] = this.getPosition(windowNode, 'x1', 'y1');
        path.window[1] = this.getPosition(windowNode, 'x2', 'y2');

        const constraintNode = pathNode.getElementsByTagName('constraint')[0];
        path.constraint[0] = this.getPosition(constraintNode, 'x1', 'y1', 'z');
        path.constraint[1] = this.getPosition(constraintNode, 'x2', 'y2', 'z');
        path.constraint[0].z = z;
        path.constraint[1].z = z;

        return path;
    }
}

module.exports = CameraParser;
