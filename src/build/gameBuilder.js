export class GameBuilder {

    constructor() {
        this.codes = [];
        this.spriteData = [];
    }

    addSpriteData(spriteData) {
        this.spriteData.push(spriteData);
    }

    addCode(codeText) {
        this.codes.push(codeText);
    }

    async build() {
        const gameTemplate = await this.getGameTemplate();
        let reader = gameTemplate.body.getReader();
        let {value: chunk, done: readerDone} = await reader.read();
        const utf8Decoder = new TextDecoder("utf-8");
        chunk = chunk ? utf8Decoder.decode(chunk) : "";
        const indexOfSpritesData = chunk.indexOf('@SPRITES_DATA');
        let a = chunk.substring(0, indexOfSpritesData + 13);
        let b = chunk.substring(indexOfSpritesData + 13);
        let spritesDataStr = 'this.spritesData = ';
        this.spriteData.forEach((sd, i) => {
            if (i === 0) {
                spritesDataStr = spritesDataStr + '[';
            }
            spritesDataStr = spritesDataStr + JSON.stringify(sd);
            if (i === this.spriteData.length - 1) {
                spritesDataStr = spritesDataStr + '];';
            } else {
                spritesDataStr = spritesDataStr + ', ';
            }
        });
        b = '\n' + spritesDataStr + b;
        let c = a + b;
        const indexOfCode = c.indexOf('@GAME_CODE');
        let d = c.substring(0, indexOfCode + 10);
        let e = c.substring(indexOfCode + 10);
        this.codes.forEach(cd => {
            e = cd + e;
        });
        e = '\n' + e;
        let f = d + e;

    }

    getGameTemplate() {
        return new Promise((res, rej) => {
            fetch('gameTemplate.js')
                .then(template => res(template))
                .catch((err) => console.log(err));
        });
    }
}
