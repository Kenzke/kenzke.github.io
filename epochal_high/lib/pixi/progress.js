import Theme from './theme.js'

/**
 * Class that represents a PixiJS Progress.
 * 
 * @example
 * // Create the progress
 * const progress = new Progress({
 *     app: app
 * })
 *
 * // Add the progress to a DisplayObject
 * app.scene.addChild(progress)
 *
 * @class
 * @extends PIXI.Container
 * @see {@link http://pixijs.download/dev/docs/PIXI.Container.html|PIXI.Container}
 * @see {@link https://www.iwm-tuebingen.de/iwmbrowser/lib/pixi/progress.html|DocTest}
 */
export default class Progress extends PIXI.Container {
    
    /**
     * Creates an instance of a Progress.
     * 
     * @constructor
     * @param {object} [opts] - An options object to specify to style and behaviour of the progress.
     * @param {number} [opts.id=auto generated] - The id of the progress.
     * @param {PIXIApp} [opts.app=window.app] - The app where the progress belongs to.
     * @param {number} [opts.width] - The width of the progress bar. When not set, the width is the size of the app
     *     minus 2 * opts.margin.
     * @param {number} [opts.height=2] - The height of the progress bar.
     * @param {string|Theme} [opts.theme=dark] - The theme to use for this progress. Possible values are dark, light, red
     *     or a Theme object.
     * @param {number} [opts.margin=100] - The outer spacing to the edges of the app.
     * @param {number} [opts.padding=0] - The inner spacing (distance from icon and/or label) to the border.
     * @param {number} [opts.fill=Theme.fill] - The color of the progress background as a hex value.
     * @param {number} [opts.fillAlpha=Theme.fillAlpha] - The alpha value of the background.
     * @param {number} [opts.fillActive=Theme.primaryColor] - The color of the progress background when activated.
     * @param {number} [opts.fillActiveAlpha=Theme.fillActiveAlpha] - The alpha value of the background when activated.
     * @param {number} [opts.stroke=Theme.stroke] - The color of the border as a hex value.
     * @param {number} [opts.strokeWidth=0] - The width of the border in pixel.
     * @param {number} [opts.strokeAlpha=Theme.strokeAlpha] - The alpha value of the border.
     * @param {number} [opts.strokeActive=Theme.strokeActive] - The color of the border when activated.
     * @param {number} [opts.strokeActiveWidth=0] - The width of the border in pixel when activated.
     * @param {number} [opts.strokeActiveAlpha=Theme.strokeActiveAlpha] - The alpha value of the border when activated.
     * @param {boolean} [opts.background=false] - The alpha value of the border when activated.
     * @param {number} [opts.backgroundFill=Theme.background] - A textstyle object for the styling of the label. See PIXI.TextStyle
     *     for possible options.
     * @param {number} [opts.backgroundFillAlpha=1] - A textstyle object for the styling of the label when the
     *     progress is activated. See PIXI.TextStyle for possible options.
     * @param {number} [opts.radius=Theme.radius] - The radius of the four corners of the progress (which is a rounded rectangle).
     * @param {boolean} [opts.destroyOnComplete=true] - Should the progress bar destroy itself after reaching 100 %?
     * @param {boolean} [opts.visible=true] - Is the progress initially visible (property visible)?
     */
    constructor(opts = {}) {

        super()
        
        const theme = Theme.fromString(opts.theme)
        this.theme = theme

        this.opts = Object.assign({}, {
            id: PIXI.utils.uid(),
            app: window.app,
            width: null,
            height: 2,
            margin: 100,
            padding: 0,
            fill: theme.fill,
            fillAlpha: theme.fillAlpha,
            fillActive: theme.primaryColor,
            fillActiveAlpha: theme.fillActiveAlpha,
            stroke: theme.stroke,
            strokeWidth: 0,
            strokeAlpha: theme.strokeAlpha,
            strokeActive: theme.strokeActive,
            strokeActiveWidth: 0,
            strokeActiveAlpha: theme.strokeActiveAlpha,
            background: false,
            backgroundFill: theme.background,
            backgroundFillAlpha: 1,
            radius: theme.radius,
            destroyOnComplete: true,
            visible: true
        }, opts)

        this.id = this.opts.id

        this.background = null
        this.bar = null
        this.barActive = null

        this.alpha = 0
        
        this.visible = this.opts.visible

        this._progress = 0

        // setup
        //-----------------
        this.setup()

        // layout
        //-----------------
        this.layout()
    }
    
    /**
     * Creates children and instantiates everything.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    setup() {

        // interaction
        //-----------------
        this.on('added', e => {
            this.show()
        })

        // background
        //-----------------
        if (this.opts.background) {
            const background = new PIXI.Graphics()
            this.background = background
            this.addChild(background)
        }

        // bar
        //-----------------
        const bar = new PIXI.Graphics()
        this.bar = bar
        this.addChild(bar)

        const barActive = new PIXI.Graphics()
        this.barActive = barActive
        this.bar.addChild(barActive)

        return this
    }
    
    /**
     * Should be called to refresh the layout of the progress. Can be used after resizing.
     * 
     * @return {Progress} A reference to the progress for chaining.
     */
    layout() {

        const width = this.opts.app.size.width
        const height = this.opts.app.size.height

        // background
        //-----------------
        if (this.opts.background) {
            this.background.clear()
            this.background.beginFill(this.opts.backgroundFill, this.opts.backgroundFillAlpha)
            this.background.drawRect(0, 0, width, height)
            this.background.endFill()
        }

        this.draw()

        return this
    }
    
    /**
     * Draws the canvas.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    draw() {

        this.bar.clear()
        this.barActive.clear()

        this.drawBar()
        this.drawBarActive()

        return this
    }
    
    /**
     * Draws the bar.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    drawBar() {

        const width = this.opts.app.size.width
        const height = this.opts.app.size.height

        this.radius = this.opts.radius
        if ((this.radius * 2) > this.opts.height) {
            this.radius = this.opts.height / 2
        }

        const wantedWidth = this.opts.width || (width - (2 * this.opts.margin))
        const wantedHeight = this.opts.height

        this.bar.lineStyle(this.opts.strokeWidth, this.opts.stroke, this.opts.strokeAlpha)
        this.bar.beginFill(this.opts.fill, this.opts.fillAlpha)
        if (this.radius > 1) {
            this.bar.drawRoundedRect(0, 0, wantedWidth, wantedHeight, this.radius)
        } else {
            this.bar.drawRect(0, 0, wantedWidth, wantedHeight)
        }
        this.bar.endFill()
        
        this.bar.x = width / 2 - this.bar.width / 2
        this.bar.y = height / 2 - this.bar.height / 2

        return this
    }
    
    /**
     * Draws the active bar.
     * 
     * @private
     * @return {Progress} A reference to the progress for chaining.
     */
    drawBarActive() {

        const wantedWidth = this.bar.width - (2 * this.opts.padding)
        const wantedHeight = this.bar.height - (2 * this.opts.padding)
        
        const barActiveWidth = wantedWidth * this._progress / 100

        this.barActive.lineStyle(this.opts.strokeActiveWidth, this.opts.strokeActive, this.opts.strokeActiveAlpha)
        this.barActive.beginFill(this.opts.fillActive, this.opts.fillActiveAlpha)
        if (barActiveWidth > 0) {
            if (this.radius > 1) {
                this.barActive.drawRoundedRect(0, 0, barActiveWidth, wantedHeight, this.radius)
            } else {
                this.barActive.drawRect(0, 0, barActiveWidth, wantedHeight)
            }
        }
        this.barActive.endFill()

        this.barActive.x = this.opts.padding
        this.barActive.y = this.opts.padding

        return this
    }
    
    /**
     * Shows the progress (sets his alpha values to 1).
     * 
     * @return {Progress} A reference to the progress for chaining.
     */
    show() {
        TweenMax.to(this, this.theme.fast, {alpha: 1})

        return this
    }
    
    /**
     * Hides the progress (sets his alpha values to 1).
     * 
     * @return {Progress} A reference to the progress for chaining.
     */
    hide() {
        TweenMax.to(this, this.theme.fast, {alpha: 0, onComplete: () => this.visible = false})

        return this
    }
    
    /**
     * Gets or sets the progress. Has to be a number between 0 and 100.
     * 
     * @member {number}
     */
    get progress() {
        return this._progress
    }
    set progress(value) {

        value = Math.round(value)

        if (value < 0) {
            value = 0
        }

        if (value > 100) {
            value = 100
        }

        TweenMax.to(this, this.theme.normal, {
            _progress: value,
            onUpdate: () => this.draw(),
            onComplete: () => {
                if (value === 100 && this.opts.destroyOnComplete) {
                    TweenMax.to(this, this.theme.fast, {
                        alpha: 0,
                        onComplete: () => this.destroy({children: true})
                    })
                }
            }
        })
    }
}
