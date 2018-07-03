const {Vector2} = require('three');
const {Animation, UVCoords} = require('@snakesilk/engine');

const {closest} = require('../util/traverse')
const LoopTree = require('../util/LoopTree');
const Parser = require('./Parser');

class AnimationParser extends Parser
{
    getUVMap(frameNode, textureSize) {
        const offset = this.getVector2(frameNode, 'x', 'y');

        const size = this.getVector2(frameNode, 'w', 'h') ||
                     this.getVector2(closest(frameNode, 'animation'), 'w', 'h') ||
                     this.getVector2(closest(frameNode, 'animations'), 'w', 'h');

        return new UVCoords(offset, size, textureSize);
    }

    parseAnimation(animationNode, textureSize)
    {
        const id = animationNode.getAttribute('id');
        const group = animationNode.getAttribute('group') || undefined;
        const animation = new Animation(id, group);

        const loopTree = new LoopTree();
        this.parseAnimationChildren(loopTree, animationNode.children, textureSize);
        loopTree.squash().forEach(([uvMap, duration]) => {
            animation.addFrame(uvMap, duration);
        });

        return animation;
    }

    parseAnimationChildren(loopTree, nodes, textureSize) {
        Array.from(nodes).forEach(node => {
            loopTree.frames.push(this.parseAnimationChild(node, textureSize));
        });
    }

    parseAnimationChild(node, textureSize) {
         if (node.tagName === 'loop') {
            const loopTree = new LoopTree();
            loopTree.loops = parseInt(node.getAttribute('count'), 10);
            this.parseAnimationChildren(loopTree, node.children, textureSize);
            return loopTree;
        } else {
            return this.parseFrame(node, textureSize);
        }
    }

    parseFrame(frameNode, textureSize) {
        const uvMap = this.getUVMap(frameNode, textureSize);
        const duration = this.getFloat(frameNode, 'duration') || undefined;
        return [uvMap, duration];
    }
}

module.exports = AnimationParser;
