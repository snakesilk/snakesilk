# SnakeSilk XML Loader

## Usage

1) Install

        npm install snakesilk-engine snakesilk-xml-loader


2) Implement

```javascript
import {Game} from 'snakesilk-engine';
import XMLLoader from 'snakesilk-xml-loader';

const myGame = new Game();
const loader = new XMLLoader(myGame);

loader.loadGame('./myGame.xml').then(entrypoint => {
    myGame.run();
});
```
