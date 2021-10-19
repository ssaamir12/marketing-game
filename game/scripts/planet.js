function createPlanet(config, stage) {
    let planet = new DisplayObject(config, stage);
    planet.stage.blockers.push(planet)
    planet.id = Math.floor(Math.random() * 10000)
    planet.onCollision = config.onCollision

    const parentMove = planet.move
    planet.move = function () {
        parentMove.bind(planet)()
        if (this.sprite.y > (config.maxHeight)) {
            this.reset()
            const idx = this.stage.blockers.indexOf(this)
            this.stage.blockers.splice(idx, 1)
            this.stage.recentlyCreatedBlockers = planet.stage.recentlyCreatedBlockers.filter(b => b.id != this.id)
        } else if (this.sprite.y > (this.config.height) && planet.stage.recentlyCreatedBlockers.filter(b => b.id == this.id).length > 0) {
            planet.stage.recentlyCreatedBlockers = planet.stage.recentlyCreatedBlockers.filter(b => b.id != this.id)
        }
    }

    return planet
}

function createRandomPlanet(app, textures, moon) {
    const sumFreq = textures.map(t => t.frequency).reduce((a, b) => a + b)
    let freq = Math.floor(Math.random() * sumFreq)
    let i = 0
    while (freq > textures[i].frequency && i < textures.length) {
        freq -= textures[i].frequency
        i++
    }
    const prototype = textures[i]

    let youngBlockers = app.stage.recentlyCreatedBlockers
    const diameter = prototype.texture.width / (Math.floor(Math.random() * (prototype.maxratio - prototype.minratio)) + prototype.minratio)
    let maxX = app.renderer.width

    let maxHole = { x: -1, width: 0 }
    if (youngBlockers.length > 0) {

        const firstBlocker = youngBlockers[0]
        let aHole = {
            x: 0,
            width: firstBlocker.x() - firstBlocker.width / 2
        }
        if (aHole.width >= maxHole.width) {
            maxHole = aHole
        }

        for (let i = 0; i < youngBlockers.length - 2; i++) {

            const aHole = { x: youngBlockers[i].x() + youngBlockers[i].width, width: youngBlockers[i + 1].x() - youngBlockers[i].x() - youngBlockers[i].width * 1.1 - youngBlockers[i + 1].width }
            if (aHole.width >= maxHole.width) {
                maxHole = aHole
            }
        }
        const lastBlocker = youngBlockers[youngBlockers.length - 1]
        aHole = {
            x: lastBlocker.x() + lastBlocker.width,
            width: maxX - lastBlocker.x() - lastBlocker.width / 2
        }
        if (aHole.width >= maxHole.width) {
            maxHole = aHole
        }

    } else {
        maxHole = ({ x: 0, width: maxX })
    }

    const expectedX = Math.floor(Math.random() * maxHole.width) + maxHole.x
    const expectedY = -diameter * 1.3
    if (maxHole.width >= diameter && notCollidesMoon(moon, expectedX, expectedY, diameter, prototype.onCollision, app)) {
        const planet = createPlanet({
            texture: prototype.texture,
            onCollision: prototype.onCollision,
            x: expectedX,
            y: expectedY,
            width: diameter,
            height: diameter,
            angle: 90,
            rotationFactor: 0,
            zIndex: 8,
            accelerationFactor: 0.01,
            maxHeight: app.renderer.height + diameter + 300
        }, app.stage)
        planet.init()
        youngBlockers.push({ id: planet.id, x: () => { return planet.sprite.x }, y: () => {return planet.sprite.y} , width: diameter * 1.3 })
        youngBlockers.sort((a, b) => (a.x() > b.x()) ? 1 : (a.x() < b.x()) ? -1 : 0)

    }
}

function notCollidesMoon(moon, x, y, diameter, name, app) {
    const moonCenter = {name: "moon", x: moon.sprite.x + moon.sprite.width / 2, y: moon.sprite.y + moon.sprite.width / 2, radio: moon.sprite.width / 2}
    const planetCenter = {name: name, x: x +  diameter / 2, y: y +  diameter / 2, radio: diameter / 2}
  
    return distance(moonCenter,planetCenter) > moonCenter.radio + planetCenter.radio
}

function drawLines(blockers, moon, app) {
    const moonCenter = {name: "moon", x: moon.sprite.x + moon.sprite.width / 2, y: moon.sprite.y + moon.sprite.width / 2, radio: moon.sprite.width / 2 * 1.5}
    blockers.forEach(b => {
        const diameter = b.sprite.width
        const planetCenter = {name: name, x: b.sprite.x + diameter / 2 , y: b.sprite.y + diameter / 2, radio: b.sprite.width / 2}
        const graphics =  new PIXI.Graphics();
        app.stage.addChild(graphics);
        graphics.beginFill(0xFF0000);
        graphics.lineStyle(3, 0xFF0000);
    
        graphics.moveTo(planetCenter.x, planetCenter.y)
        graphics.lineTo(moonCenter.x, moonCenter.y)
        graphics.lineTo(planetCenter.x, planetCenter.y)
        graphics.zIndex = 9999
        app.stage.addChild(graphics)
    });
    
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2))
}