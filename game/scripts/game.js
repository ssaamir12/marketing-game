const dizzyTime = 15

class Game {
    constructor(resources, app, planetsPrototypes) {
        const self = this
        this.gameKeyBinding = function (e) {
            if (e.code == "ArrowRight" && status > 0) {
                self.pressedKeys["right"] = true
            } else if (e.code == "ArrowLeft" && status > 0) {
                self.pressedKeys["left"] = true
            } else if (e.code == "KeyC" && status > 0) {
                rocket.useCoffee()
            } else if (e.code == "KeyP") {
                if (status > 0) {
                    self.pauseGame()
                } else {
                    self.unpauseGame()
                }
            }
        }

        self.pressedKeys = { "right": false, "left": false }

        let rocket
        let moon
        let arrow
        let timer
        let pauseButton
        let planetPopup

        this.initGame = function () {
            rocket = createRocket({
                texture: resources.rocket.texture,
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.7,
                width: resources.rocket.texture.width / 20,
                height: resources.rocket.texture.height / 20,
                angle: 0,
                rotationFactor: 0.03,
                speed: 1,
                accelerationFactor: 0.01,
                maxHeight: app.renderer.height + resources.rocket.texture.height / 20 + 300,
                coffees: {
                    texture: resources.coffee.texture,
                    x: 10,
                    y: app.renderer.height - resources.coffee.texture.height / 3 * 1.1,
                    width: resources.coffee.texture.width / 3,
                    height: resources.coffee.texture.height / 3,
                    zIndex: 99,
                    accelerationFactor: 0.01
                }
            }, app.stage)

            moon = createMoon({
                texture: resources.moon.texture,
                x: Math.random() * (app.renderer.width * 10) - app.renderer.width * 5,
                y: -1 * app.renderer.height * 18,
                width: resources.moon.texture.width / 5,
                height: resources.moon.texture.height / 5,
                angle: 0,
                rotationFactor: 0.03,
                speed: 1,
                accelerationFactor: 0.01,
                maxHeight: app.renderer.height + resources.rocket.texture.height / 20 + 300
            }, app.stage, rocket)

            arrow = createArrow({
                x: app.renderer.width * 0.9,
                y: app.renderer.height * 0.9,
                texture: resources.arrow.texture,
                width: resources.arrow.texture.width / 3,
                height: resources.arrow.texture.height / 3,
                BA: {
                    texture: resources.BA.texture,
                    x: app.renderer.width * 0.9,
                    y: app.renderer.height * 0.9,
                    width: resources.BA.texture.width / 3000,
                    height: resources.BA.texture.height / 3000
                }
            }, app.stage, moon, rocket)

            app.stage.blockers.forEach(d => d.init())
            app.stage.recentlyCreatedBlockers = []

            timer = createTimer({
                x: app.renderer.width * 0.9,
                y: app.renderer.height * 0.95
            }, app.stage)

            pauseButton = createPauseButton({
                x: app.renderer.width * 0.005,
                y: app.renderer.height * 0.005,
                texture: resources.pause.texture,
                width: resources.pause.texture.width / 3,
                height: resources.pause.texture.height / 3,
                zIndex: 9
            }, app.stage, this)

            const popupWidth = app.renderer.width / 4.3
            const popupHeight = app.renderer.height / 3.5
            planetPopup = createPlanetPopup({
                x: app.renderer.width * 0.99 - popupWidth,
                y: app.renderer.height * 0.7 - popupHeight / 2,
                width: popupWidth,
                height: popupHeight
            }, app)

            rocket.init()
            timer.init()
            moon.init()
            arrow.init()
            pauseButton.init()
            planetPopup.init()


            app.ticker.add(self.onTick)

            window.removeEventListener('keyup', self.onKeyReleased)
            window.addEventListener('keyup', self.onKeyReleased)
            window.addEventListener('keydown', self.gameKeyBinding);
            status = 1
            app.stage.interactive = true
            app.stage.on('pointerdown', function (e) {
                if (e.data.global.x < rocket.container.x) {
                    self.pressedKeys["left"] = true
                    self.pressedKeys["right"] = false
                } else {
                    self.pressedKeys["left"] = false
                    self.pressedKeys["right"] = true
                }
            })
            app.stage.on('touchmove', function (e) {
                if (e.data.global.x < rocket.container.x) {
                    self.pressedKeys["left"] = true
                    self.pressedKeys["right"] = false
                } else {
                    self.pressedKeys["left"] = false
                    self.pressedKeys["right"] = true
                }
            })
            app.stage.on('pointerup', function (e) {
                resetPressedKeys()
            })
            app.stage.on('pointerout', function (e) {
                resetPressedKeys()
            })
            app.stage.on('pointerleave', function (e) {
                resetPressedKeys()
            })
            app.stage.on('touchendoutside', function (e) {
                resetPressedKeys()
            })
            app.stage.on('touchcancel', function (e) {
                resetPressedKeys()
            })

            function resetPressedKeys() {
                self.pressedKeys["left"] = false
                self.pressedKeys["right"] = false
            }
        }

        self.onKeyReleased = function (e) {
            if (e.code == "ArrowRight") {
                self.pressedKeys["right"] = false
            } else if (e.code == "ArrowLeft") {
                self.pressedKeys["left"] = false
            }
        }

        self.onTick = function () {
            // Listen for frame updates
            if (status > 0) {
                app.stage.blockers.forEach(element => {
                    element.move()
                })
                if (!self.pressedKeys["right"] && !self.pressedKeys["left"]) {
                    rocket.resetRotation()
                } else if (self.pressedKeys["right"]) {
                    if (!rocket.isInverse()) {
                        rocket.rotateRight()
                    } else {
                        rocket.rotateLeft()
                    }
                } else if (self.pressedKeys["left"]) {
                    if (!rocket.isInverse()) {
                        rocket.rotateLeft()
                    } else {
                        rocket.rotateRight()
                    }
                }

                moon.move()
                arrow.move()
                rocket.updateStatus()
                app.bk.move()
                if (Math.floor(Math.random() * 100) < 15) {
                    createRandomPlanet(app, planetsPrototypes, moon)
                }

                app.stage.blockers.forEach(element => {
                    if (element.enabled && rocket.isTouching(element)) {
                        if (element.onCollision == "lose") {
                            app.stage.loseGame()
                        } else if (element.onCollision == "dizzy") {
                            rocket.addState({ type: element.onCollision })
                        } else if (element.onCollision == "transparent") {
                            arrow.makeInvisible()
                        } else if (element.onCollision == "slow") {
                            rocket.addState({ type: element.onCollision, started: new Date() })
                        } else if (element.onCollision == "coffee") {
                            rocket.addCoffee()
                            element.destroy()
                        } else if (element.onCollision == "removeTime") {
                            timer.reduceTime()
                        } else if (element.onCollision == "inverse") {
                            rocket.addState({ type: element.onCollision })
                        }
                        element.enabled = false
                    }
                })

                if (rocket.isTouching(moon)) {
                    app.stage.winGame()
                }
            }
        }
        app.resizeScreen()

        self.destroy = function () {
            app.ticker.remove(self.onTick)
            rocket.destroy()
            timer.destroy()
            moon.destroy()
            arrow.destroy()
            pauseButton.destroy()
            planetPopup.destroy()
            app.stage.blockers.forEach(b => b.destroy())
            app.stage.blockers = []
            window.removeEventListener('keyup', self.onPressedKey)
            window.removeEventListener('keydown', self.gameKeyBinding);
            app.stage.speed = app.stage.initialSpeed
        }

        self.restart = function () {
            self.destroy()
            self.initGame()
        }

        app.stage.loseGame = function () {
            showLabel("Programme failure. \n\n Game over", self)
        }

        app.stage.timeout = function () {
            showLabel("Oh no!\n Your Transformation Programme did not finish on time!", self)
        }

        app.stage.winGame = function () {
            showLabel("Congratulations, you have navigated your project successfully with Business Agility!", self)
        }

        function showLabel(text, self) {
            status = -2
            const container = createContainer()
            container.x = 0
            container.y = 0
            container.zIndex = 9999
            container.addChild(createMenuBackground())
            const label = createLabel(container, text, app.styles.h1, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.3,
                centered: true
            })
            const againButton = createButton(container, "Play again!", app.styles.h2, {
                x: label.x,
                y: app.renderer.height * 0.6,
                centered: true
            }, function () {
                app.stage.removeChild(container)
                self.restart()
            })

            app.stage.addChild(container)
        }

        self.pauseGame = function () {
            status = -2
            const container = createContainer()
            container.name = "pausemenu"
            container.x = 0
            container.y = 0
            container.zIndex = 9999

            const initx = app.renderer.width * 0.25

            container.addChild(createMenuBackground())
            const inity = app.renderer.height * 0.26
            const label = createLabel(container, "Paused", app.styles.h1, {
                x: initx * 2,
                y: inity,
                centered: true
            })
            const restartButton = createButton(container, "Restart", app.styles.h2, {
                x: initx * 2,
                y: inity + label.height * 1.2,
                centered: true
            }, function () {
                app.stage.removeChild(container)
                self.restart()
            })

            createButton(container, "Resume", app.styles.h2, {
                x: initx * 2,
                y: inity + label.height * 1.2 + restartButton.height * 2,
                centered: true
            }, function () {
                self.unpauseGame()
            })
            createButton(container, "Exit", app.styles.h2, {
                x: initx * 2,
                y: inity + label.height * 1.2 * 2 + restartButton.height * 2,
                centered: true
            }, function () {
                app.game.destroy()
                app.menu.init()
                app.stage.removeChild(container)
            })

            app.stage.addChild(container)
        }
        self.unpauseGame = function () {
            const pausemenu = app.stage.children.filter(c => c.name == "pausemenu")[0]
            app.stage.removeChild(pausemenu)
            status = 1
        }

        function createMenuBackground() {
            const initx = app.renderer.width * 0.25
            const background = new PIXI.Graphics()
            background.lineStyle(2, 0xFFFFFF, 1);
            background.alpha = 0.8
            background.beginFill(0xAA4F08, 1);
            background.drawRoundedRect(initx, app.renderer.height * 0.25, app.renderer.width * 0.5, app.renderer.height * 0.4)
            background.endFill();
            return background;
        }
    }
}