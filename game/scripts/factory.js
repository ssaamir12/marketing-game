const createButton = function (container, label, style, config, callback) {
    const buttonContainer = new PIXI.Container();
    buttonContainer.interactive = true

    //callback
    const text = createLabel(buttonContainer, label, style, config)
    text.interactive = true
    text.on('pointerdown', function () {
        callback()
    })
    text.interactive = true
    container.addChild(buttonContainer)
    return buttonContainer
}

const createSprite = function (container, texture, config) {
    let sprite = new PIXI.Sprite(texture)
    sprite.x = config.x
    sprite.y = config.y
    sprite.width = config.width
    sprite.height = config.height
    sprite.zIndex = config.zIndex ? config.zIndex : 0
    container.addChild(sprite)
    return sprite
}

const createLabel = function (container, label, style, config) {
    let texture = new PIXI.Text(label, style)
    texture.x = config.x
    texture.y = config.y
    texture.zIndex = config.zIndex ? config.zIndex : 0
    if (config.width) {
        texture.width = config.width
    }
    texture.transform.pivot.x = config.centered ? texture.width / 2 : 0
    container.addChild(texture)
    return texture
}

const createPlanetLabel = function (container, texture, text, style, config) {
    const spriteContainer = createContainer(container, config);

    const sprite = createSprite(spriteContainer, texture, {
        x: 0,
        y: 0,
        width: config.width,
        height: config.height
    })

    createLabel(spriteContainer, text, style, {
        x: config.width + (config.separation? config.separation : 10),
        y: 0
    })
}

function createContainer(parent, config) {
    let container = new PIXI.Container();
    container.zIndex = 9
    container.x = (config && config.x) ? config.x : 0
    container.y = (config && config.y) ? config.y : 0
    if (parent) {
        parent.addChild(container)
    }
    return container
}