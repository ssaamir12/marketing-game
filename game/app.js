const canvas = document.getElementById("canvas");

const initialWidth = 1024
const initialHeight = 780

const app = new PIXI.Application({ view: canvas, width: initialWidth, height: initialHeight });

document.body.appendChild(app.view);

// 1 = Play, <0 = Stop
status = 1

app.resizeScreen = function () {
    const windowWidth = window.innerWidth * 0.9
    const windowHeight = window.innerHeight * 0.9
    const newWidth = windowWidth > initialWidth ? initialWidth : windowWidth
    const newHeight = windowHeight > initialHeight ? initialHeight : windowHeight

    const widthRatio = newWidth / initialWidth
    const heightRatio = newHeight / initialHeight

    if (widthRatio < heightRatio) {
        app.renderer.view.style.width = newWidth + 'px';
        app.renderer.view.style.height = initialHeight * widthRatio + 'px';
    } else {
        app.renderer.view.style.width = initialWidth * heightRatio + 'px';
        app.renderer.view.style.height = newHeight + 'px';
    }
}

app.loader
    .add('rocket', 'textures/rocket.png')
    .add('background', 'textures/space.jpg')
    .add('planet', 'textures/planet9.png')
    .add('planet1', 'textures/planet4.png')
    .add('planet2', 'textures/planet10.png')
    .add('planet3', 'textures/planet5.png')
    .add('planet4', 'textures/planet.png')
    .add('planet5', 'textures/planet11.png')
    .add('coffee', 'textures/coffee.png')
    .add('moon', 'textures/moon.png')
    .add('arrow', 'textures/arrow.png')
    .add('BA', 'textures/BA.png')
    .add('logo', 'textures/BAlogo.png')
    .add('pause', 'textures/timeout.png')
    .load((loader, resources) => {
        app.stage.sortableChildren = true
        app.stage.blockers = []
        app.styles = getStyles(app)
        app.stage.initialSpeed = 1.5
        app.stage.speed = app.stage.initialSpeed
        app.stage.orientation = Math.PI / 2
        app.stage.getStatus = function () {
            return status;
        }
        app.planetsPrototypes = [
            //{ texture: resources.planet.texture, onCollision: "dizzy", key: "Dizzy", description: "Makes your rocket shake.", frequency: 25, maxratio: 10, minratio: 5 },
            { texture: resources.planet4.texture, onCollision: "removeTime", key: "10-second delay", description: "This shortens your timer by 10 seconds", frequency: 25, maxratio: 10, minratio: 5 },
            { texture: resources.planet1.texture, onCollision: "lose", key: "Programme fail!", description: "Hitting this planet makes you lose the project entirely!", frequency: 25, maxratio: 5, minratio: 3 },
            //{ texture: resources.planet3.texture, onCollision: "slow", key: "", description: "If you hit this, you’ll accrue so much technical debt, you’ll slow right down", frequency: 25, maxratio: 10, minratio: 7 },
            { texture: resources.planet2.texture, onCollision: "transparent", key: "Guiding arrow lost", description: "You'll lose sight of the project - your solution assurance arrow disappears", frequency: 25, maxratio: 7, minratio: 5 },
            { texture: resources.planet5.texture, onCollision: "inverse", key: "Controls are reversed", description: "Hitting this makes you lose direction – the controls are switched round!", frequency: 25, maxratio: 10, minratio: 5 },
            { texture: resources.coffee.texture, onCollision: "coffee", key: "Use me to speed up!", description: "Collect these to make you go faster through your project! (tap the coffee or hit 'C' to use them!)", frequency: 10, maxratio: 5, minratio: 5 },
        ]

        app.bk = createBk(resources.background.texture, app.renderer.width, app.renderer.height, app.stage)
        app.stage.addChild(app.bk)

        function startGame() {
            app.menu.destroy()
            app.game.initGame()
        }

        app.game = new Game(resources, app, app.planetsPrototypes);
        app.menu = new Menu(app, startGame)

        app.menu.init()

        const BAlogo = createBAlogo({
            x: app.renderer.width * 0.99 - resources.logo.texture.width / 7,
            y: app.renderer.height * 0.01,
            width: resources.logo.texture.width / 7,
            height: resources.logo.texture.height / 7,
            texture: resources.logo.texture,
            zIndex: 99
        }, app.stage)
        BAlogo.init()

        window.addEventListener('keydown', function (e) {
            if (e.code == "KeyF") {
                fullscreen()
            }
        });

        function fullscreen() {
            const elem = document.getElementById("canvas")
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }

        window.addEventListener('resize', function (e) {
            let replay = false
            if (status > 0) {
                status *= -1
                replay = true
            }
            app.resizeScreen()

            if (replay) {
                status *= -1
            }
        })
    });