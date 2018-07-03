function flatten(loopTree) {
  const flat = loopTree.frames.reduce((flat, frame) => {
    if (frame instanceof LoopTree) {
      return flat.concat(flatten(frame));
    }
    return flat.concat([frame]);
  }, []);

  const all = [];
  for (let i = 0; i < loopTree.loops; ++i) {
    all.push(...flat);
  }

  return all;
}

class LoopTree
{
    constructor(frames = [], loops = 1)
    {
        this.frames = frames;
        this.loops = loops;
    }

    squash() {
        return flatten(this);
    }
}

module.exports = LoopTree;
