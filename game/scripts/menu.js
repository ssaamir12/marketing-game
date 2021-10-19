class Menu {

    constructor(app, startGame) {
        this.firstMenuContainer;
        const self = this
        this.init = function () {
            this.generalContainer = createContainer(app.stage)
            this.firstMenuContainer = createContainer(this.generalContainer)
            this.rulesContainer = createContainer()
            this.planetsContainer = createContainer()
            this.controlsContainer = createContainer()
            createLabel(this.firstMenuContainer, "Programme mission: \n Transformation journey to the moon", app.styles.h1, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.1,
                centered: true
            })
            createLabel(this.firstMenuContainer, "You have 90 seconds to reach the moon.\n\nHitting planets will result in a penalty/ game over!\n\nFollow the arrow... it will guide you to the moon. The closer you get, the brighter it shines.\n\nPress 'C' (or tap on mobile) to use your coffees and go faster.", app.styles.bigtext, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.325,
                centered: true
            })
            createButton(this.firstMenuContainer, "Start game", app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.85,
                centered: true
            }, startGame)
            createButton(this.firstMenuContainer, "Controls", app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.75,
                centered: true
            }, this.showControls)

            createLabel(this.rulesContainer, "Rules", app.styles.h1, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.1,
                centered: true
            })
            createLabel(this.rulesContainer, "Digital transformation projects can be full of traps and \"gotchas\". At Business Agility, we guide you through these expensive pitfalls.\n            The guiding arrow will change colour the closer you get to the moon - follow it and you can not fail",
             app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.2,
                centered: true
            })
            createButton(this.rulesContainer, "Controls", app.styles.h2, {
                x: app.renderer.width * 0.1,
                y: app.renderer.height * 0.9,
                centered: true
            }, this.showControls)
            createButton(this.rulesContainer, "Planets", app.styles.h2, {
                x: app.renderer.width * 0.3,
                y: app.renderer.height * 0.9,
                centered: true
            }, this.showPlanets)
            createButton(this.rulesContainer, "Start game", app.styles.h2, {
                x: app.renderer.width * 0.8,
                y: app.renderer.height * 0.9,
                centered: true
            }, startGame)

            createLabel(this.controlsContainer, "Controls", app.styles.h1, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.1,
                centered: true
            })
            createLabel(this.controlsContainer, "P: Pause/Resume game", app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.2,
                centered: true
            })
            createLabel(this.controlsContainer, "=>: Turn rocket to right", app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.25,
                centered: true
            })
            createLabel(this.controlsContainer, "<=: Turn rocket to left", app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.3,
                centered: true
            })
            createLabel(this.controlsContainer, "C: Use coffee", app.styles.h2, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.35,
                centered: true
            })
            createButton(this.controlsContainer, "Planets", app.styles.h2, {
                x: app.renderer.width * 0.1,
                y: app.renderer.height * 0.9,
                centered: true
            }, this.showPlanets)
            createButton(this.controlsContainer, "Start game", app.styles.h2, {
                x: app.renderer.width * 0.8,
                y: app.renderer.height * 0.9,
                centered: true
            }, startGame)
            createLabel(this.planetsContainer, "Planets", app.styles.h1, {
                x: app.renderer.width / 2,
                y: app.renderer.height * 0.1,
                centered: true
            })
            createButton(this.planetsContainer, "Controls", app.styles.h2, {
                x: app.renderer.width * 0.1,
                y: app.renderer.height * 0.9,
                centered: true
            }, this.showControls)
            createButton(this.planetsContainer, "Start game", app.styles.h2, {
                x: app.renderer.width * 0.8,
                y: app.renderer.height * 0.9,
                centered: true
            }, startGame)

            let i = 0
            app.planetsPrototypes.forEach(element => {
                const diameter = app.renderer.width / 25
                createPlanetLabel(this.planetsContainer, element.texture, element.description  , app.styles.text, {
                    x: app.renderer.width / 8,
                    y: app.renderer.height * 0.2 + diameter * 1.3 * i,
                    width: diameter,
                    height: diameter
                })
                i+=1;
            });

            window.addEventListener('keydown', this.gameKeyBinding);
            app.ticker.add(this.onTick)
        }

        this.onTick = function () {
            app.bk.move()
        }

        this.showFirstMenu = function () {
            self.generalContainer.removeChild(self.rulesContainer)
            self.generalContainer.addChild(self.firstMenuContainer)
            window.removeEventListener('keydown', self.rulesBinding);
            window.addEventListener('keydown', self.gameKeyBinding);
        }

        this.showRules = function () {
            self.generalContainer.removeChild(self.planetsContainer)
            self.generalContainer.removeChild(self.firstMenuContainer)
            self.generalContainer.removeChild(self.controlsContainer)
            self.generalContainer.addChild(self.rulesContainer)
            window.addEventListener('keydown', self.gameKeyBinding);
            window.removeEventListener('keydown', self.rulesBinding);
        }

        this.showControls = function () {
            self.generalContainer.removeChild(self.firstMenuContainer)
            self.generalContainer.removeChild(self.rulesContainer)
            self.generalContainer.removeChild(self.planetsContainer)
            self.generalContainer.addChild(self.controlsContainer)
        }

        this.showPlanets = function () {
            self.generalContainer.removeChild(self.rulesContainer)
            self.generalContainer.removeChild(self.controlsContainer)
            self.generalContainer.addChild(self.planetsContainer)
        }

        this.destroy = function () {
            app.stage.removeChild(this.generalContainer)
            app.ticker.remove(this.onTick)
            window.removeEventListener('keydown', this.gameKeyBinding);
        }
        this.gameKeyBinding = function (e) {
            if (e.code == "KeyS") {
                startGame()
            }
        }

        this.rulesBinding = function (e) {
            if (e.code == "Escape") {
                self.showFirstMenu()
            }
        }
    }
}