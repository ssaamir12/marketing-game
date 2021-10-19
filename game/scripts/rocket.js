function createRocket(config, stage) {
    let rocket = new DisplayObject(config, stage);
    rocket.state = []
    rocket.statetimeout = 15

    rocket.coffees = 0
    rocket.getPath = function () {
        return this.pathsByAngle[this.container.rotation]
    }

    rocket.reset = function () {
        rocket.init()
    }
    rocket.resetRotation = function () {
        if (this.container.angle < this.config.angle) {
            this.rotateRight()
        } else if (this.container.angle > this.config.angle) {
            this.rotateLeft()
        }
    }

    rocket.destroy = function () {
        this.stage.removeChild(this.container);
        this.coffeesSprites.forEach(element => {
            element.destroy()
        });
    }

    rocket.addState = function (elem) {
        elem.timeout = this.statetimeout
        elem.getCompletedRatio = () => (rocket.statetimeout - elem.timeout) / rocket.statetimeout
        elem.interval = setInterval(() => reduceTime(elem, this, this.stage), 10)
        this.state.push(elem)
    }

    function reduceTime(state, rocket, stage) {
        if (stage.getStatus() > 0) {
            state.timeout -= 0.01
        }
        if (state.timeout <= 0) {
            rocket.removeState(state)
        }
    }

    rocket.removeState = function (state) {
        this.state = this.state.filter(s => s != state)
        clearInterval(state.interval)
    }

    rocket.addCoffee = function () {
        rocket.coffees = Math.min(rocket.coffees + 1, 3)
        rocket.coffeesSprites[rocket.coffees - 1].sprite.alpha = 1
        rocket.coffeesSprites[rocket.coffees - 1].enabled = true
    }

    rocket.useCoffee = function () {
        if (rocket.coffees > 0 && stage.getStatus() > 0) {
            rocket.coffeesSprites[rocket.coffees - 1].sprite.alpha = 0
            rocket.coffees -= 1
            rocket.addState({ type: "fast", started: new Date(), amount: 1 })
        }
    }

    rocket.updateState = function (t) {
        this.state = this.state.filter(s => s.type != t.type)
        rocket.addState(t)
    }

    rocket.updateStatus = function () {
        let slowModifier = 1
        let fastModifier = 1
        this.state.forEach(state => {
            if (state.type == "dizzy") {
                const dizzyFactor = Math.random() * 6 * this.config.rotationFactor
                if (Math.floor(Math.random() * 2) - 1) {
                    this.rotateLeft(dizzyFactor)
                } else {
                    this.rotateRight(dizzyFactor)
                }
            }

            if (state.type == "transparent") {
                this.sprite.alpha = state.getCompletedRatio()
            }

            if (state.type == "slow") {
                slowModifier *= (0.018 * (state.getCompletedRatio() - 7.5) ** 2)
            }

            if (state.type == "fast") {
                fastModifier *= (-0.018 * (((rocket.statetimeout - state.timeout) - 7.5) ** 2) + 2.5)
            }
        })
        this.stage.speed = this.stage.initialSpeed * slowModifier * fastModifier
    }

    rocket.isDizzy = function () {
        return this.checkState("dizzy")
    }

    rocket.isInverse = function () {
        return this.checkState("inverse")
    }

    rocket.isSlow = function () {
        return this.checkState("slow")
    }

    rocket.isFast = function () {
        return this.checkState("fast")
    }

    rocket.isTransparent = function () {
        return this.checkState("transparent")
    }

    rocket.checkState = function (state) {
        return rocket.state.some(t => t.type == state)
    }

    rocket.rotateLeft = function (rotateFactor) {
        if (this.container.angle > this.config.angle - 45 && stage.getStatus() > 0) {
            let rotation = (rotateFactor ? rotateFactor : this.config.rotationFactor)
            this.container.rotation -= rotation
            this.updateStageRotation()
            this.rotatePoints()
        }
    }

    rocket.rotateRight = function (rotateFactor) {
        if (this.container.angle < this.config.angle + 45 && stage.getStatus() > 0) {
            let rotation = rotateFactor ? rotateFactor : this.config.rotationFactor
            this.container.rotation += rotation
            this.updateStageRotation()
            this.rotatePoints()
        }
    }

    rocket.updateStageRotation = function () {
        this.stage.orientation = this.container.rotation + Math.PI / 2
    }

    rocket.init = function () {
        this.accelerationFactor = this.config.accelerationFactor

        this.sprite = new PIXI.Sprite(this.config.texture);
        this.sprite.x = -this.config.width / 2
        this.sprite.y = -this.config.height / 2
        this.sprite.width = this.config.width
        this.sprite.height = this.config.height
        this.sprite.angle = this.config.angle
        this.sprite.zIndex = 9

        this.graphics = new PIXI.Graphics();
        this.graphics.x = this.sprite.x
        this.graphics.y = this.sprite.y
        this.graphics.lineStyle(2, 0xFFFFFF, 1);
        this.graphics.alpha = 0
        this.graphics.beginFill(0xAA4F08, 1);
        this.graphics.drawPolygon(generatePath(this.config));
        this.graphics.endFill();

        this.container = new PIXI.Container();
        this.container.zIndex = 9
        this.container.x = this.config.x
        this.container.y = this.config.y
        this.container.addChild(this.graphics);
        this.container.addChild(this.sprite);

        this.stage.addChild(this.container);

        rocket.pathsByAngle = [];
        this.rotatePoints()
        this.updateStageRotation()

        this.coffeesSprites = []
        for (let i = 0; i < 3; i++) {
            const coffeesSprite = createCoffee(this.config.coffees, this.stage, i)
            this.coffeesSprites.push(coffeesSprite)
            coffeesSprite.sprite.interactive = true
            //coffeesSprite.sprite.hitArea = coffeesSprite.sprite
            coffeesSprite.sprite.on('tap', function (e) {
                e.stopPropagation()
                if (coffeesSprite.enabled) {
                    rocket.useCoffee()
                    coffeesSprite.enabled = false
                }
            })
            coffeesSprite.sprite.on('pointerdown', function (e) {
                console.log("touched coffee")
                e.stopPropagation()
            })
            
            coffeesSprite.init()
        }
        this.addCoffee()
        this.addCoffee()
        this.addCoffee()
    }

    rocket.rotatePoints = function () {
        if (!this.pathsByAngle[this.container.rotation]) {
            const middlePoint = { x: (this.sprite.width / 2), y: (this.sprite.height / 2) }
            const b = distance(middlePoint, { x: 0, y: 0 })
            const gamma = Math.atan(middlePoint.y / middlePoint.x)
            const newX2 = b * Math.cos(gamma + this.container.rotation)
            const newY2 = b * Math.sin(gamma + this.container.rotation)
            const deltaX = newX2 - middlePoint.x
            const deltaY = newY2 - middlePoint.y

            this.pathsByAngle[this.container.rotation] = generatePath(this.config).map(p => this.rotatePoint(p, { x: deltaX, y: deltaY }))
        }
    }

    rocket.rotatePoint = function (p, deltas) {
        const a = distance({ x: p.x, y: p.y }, { x: 0, y: 0 })
        const alpha = this.container.rotation

        const beta = Math.atan(p.y / p.x)
        const newX = a * Math.cos(beta + alpha)
        const newY = a * Math.sin(beta + alpha)

        return this.realPosition(new PIXI.Point(newX - deltas.x, newY - deltas.y))
    }

    rocket.isTouching = function (planet) {
        const planetMiddle = { x: planet.sprite.x + planet.sprite.width / 2, y: planet.sprite.y + planet.sprite.height / 2 }
        const radius = planet.sprite.width / 2
        let touches = false
        let i = 0
        this.stage.removeChild(this.pointer)
        const thePath = this.pathsByAngle[this.container.rotation]

        while (!touches && i < thePath.length - 2) {

            const a = distance(thePath[i], thePath[i + 1])
            const b = distance(thePath[i], planetMiddle)
            const c = distance(thePath[i + 1], planetMiddle)
            const sp = (a + b + c) / 2
            const area = Math.sqrt(sp * (sp - a) * (sp - b) * (sp - c))
            const dist = area * 2 / a
            const angle2 = Math.acos((Math.pow(b, 2) - Math.pow(a, 2) - Math.pow(c, 2)) / (-2 * a * c)) * 180 / Math.PI
            const angle3 = Math.acos((Math.pow(c, 2) - Math.pow(b, 2) - Math.pow(a, 2)) / (-2 * b * a)) * 180 / Math.PI

            touches = dist <= radius && angle2 <= 110 && angle3 <= 110
            i += 1
        }

        touches = touches || distance(thePath[0], planetMiddle) <= radius
            || distance(this.realPosition({ x: this.sprite.width * 0.30, y: this.sprite.height * 0.70 }), planetMiddle) <= radius
            || distance(this.realPosition({ x: this.sprite.width * 0.70, y: this.sprite.height * 0.70 }), planetMiddle) <= radius
        return touches
    }

    rocket.realPosition = function (p) {
        return { x: p.x + this.graphics.x + this.container.x, y: p.y + this.graphics.y + this.container.y }
    }

    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2))
    }

    function generatePath(config) {
        return [
            new PIXI.Point(config.width * 0.55, 0),
            new PIXI.Point(config.width * 0.63, config.height * 0.05),
            new PIXI.Point(config.width * 0.70, config.height * 0.1),
            new PIXI.Point(config.width * 0.75, config.height * 0.15),
            new PIXI.Point(config.width * 0.78, config.height * 0.2),
            new PIXI.Point(config.width * 0.81, config.height * 0.25),
            new PIXI.Point(config.width * 0.83, config.height * 0.30),
            new PIXI.Point(config.width * 0.83, config.height * 0.45),
            new PIXI.Point(config.width * 0.78, config.height * 0.55),
            new PIXI.Point(config.width * 0.75, config.height * 0.60),
            new PIXI.Point(config.width * 0.73, config.height * 0.65),
            new PIXI.Point(config.width * 0.70, config.height * 0.70),
            new PIXI.Point(config.width * 0.30, config.height * 0.70),
            new PIXI.Point(config.width * (1 - 0.70), config.height * 0.70),
            new PIXI.Point(config.width * (1 - 0.73), config.height * 0.65),
            new PIXI.Point(config.width * (1 - 0.75), config.height * 0.60),
            new PIXI.Point(config.width * (1 - 0.78), config.height * 0.55),
            new PIXI.Point(config.width * (1 - 0.83), config.height * 0.45),
            new PIXI.Point(config.width * (1 - 0.83), config.height * 0.30),
            new PIXI.Point(config.width * (1 - 0.81), config.height * 0.25),
            new PIXI.Point(config.width * (1 - 0.78), config.height * 0.2),
            new PIXI.Point(config.width * (1 - 0.75), config.height * 0.15),
            new PIXI.Point(config.width * (1 - 0.70), config.height * 0.1),
            new PIXI.Point(config.width * (1 - 0.63), config.height * 0.05),
            new PIXI.Point(config.width * (1 - 0.55), config.height * 0.00),
            new PIXI.Point(config.width * 0.55, 0),
            new PIXI.Point(config.width * (1 - 0.55), config.height * 0.00),
        ];
    }

    return rocket
}