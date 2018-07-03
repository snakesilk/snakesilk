const {Vector2} = require('three');
const {UVAnimator} = require('@snakesilk/engine');

const {ensure} = require('../util/traverse')
const Parser = require('./Parser');

function faceCoordsToIndex(coords, segs) {
    let i, j, x, y, faceIndex, indices = [];
    for (i in coords.x) {
        x = coords.x[i] - 1;
        for (j in coords.y) {
            y = coords.y[j] - 1;
            /* The face index is the first of the two triangles that make up a rectangular
               face. The Animator.UV will set the UV map to the faceIndex and faceIndex+1.
               Since we expect to paint two triangles at every index we need to 2x the index
               count so that we skip two faces for every index jump. */
            faceIndex = (x + (y * segs.x)) * 2;
            indices.push(faceIndex);
        }
    }
    return indices;
}

class FaceParser extends Parser
{
    parseAnimators(faceNodes, animations) {
        const animators = [];
        for (let j = 0, faceNode; faceNode = faceNodes[j]; ++j) {
            const animator = this.parseAnimator(faceNode, animations);
            if (animator.indices.length === 0) {
                animator.indices = [j * 2];
            }
            animators.push(animator);
        }
        return animators;
    }

    parseAnimator(faceNode, animations) {
        ensure(faceNode, 'face');

        const animator = new UVAnimator();
        animator.indices = [];
        animator.offset = this.getFloat(faceNode, 'offset') || 0;

        animator.name = faceNode.getAttribute('animation');
        if (!animator.name) {
            throw new Error("No default animation defined");
        }
        if (!animations.has(animator.name)) {
            throw new Error("Animation " + animator.name + " not defined");
        }

        const animation = animations.get(animator.name);
        animator.setAnimation(animation);

        animator.indices = this.parseIndices(faceNode);

        animator.indices.sort(function(a, b) {
            return a - b;
        });

        return animator;
    }

    parseIndices(faceNode) {
        ensure(faceNode, 'face');

        const indices = [];
        const segs = this.getVector2(faceNode.parentNode, 'w-segments', 'h-segments')
                   || new Vector2(1, 1);

        const rangeNodes = faceNode.getElementsByTagName('range');
        for (let rangeNode, i = 0; rangeNode = rangeNodes[i]; ++i) {
            const coords = {
                'x': this.getRange(rangeNode, 'x', segs.x),
                'y': this.getRange(rangeNode, 'y', segs.y),
            };
            const rangeIndices = faceCoordsToIndex(coords, segs);
            indices.push(...rangeIndices);
        }

        const indexJSON = faceNode.getAttribute('index');
        if (indexJSON) {
            const jsonIndices = JSON.parse(indexJSON);
            indices.push(...jsonIndices);
        }

        return indices;
    }
}

module.exports = FaceParser;
