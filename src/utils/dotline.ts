export class Graph {
    canvas: HTMLCanvasElement
    dotCount: number
    ctx: CanvasRenderingContext2D
    dots: Dot[]
    maxDistance: number
    constructor(canvas: HTMLCanvasElement, dotCount: number, maxDistance = 100) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        this.dotCount = dotCount
        this.dots = []
        this.maxDistance = maxDistance
    }
    tweekSize() {
        const { width, height } = this.canvas.getBoundingClientRect()
        this.canvas.width = width * window.devicePixelRatio
        this.canvas.height = height * window.devicePixelRatio
    }
    setup() {
        this.tweekSize()
        for (let i = 0; i < this.dotCount; i++) {
            const pos = this.getRandomPos()
            this.dots.push(new Dot(pos.x, pos.y, 4))
        }
        this.draw()
    }
    draw() {
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i]
            for (let j = i + 1; j < this.dots.length; j++) {
                const next = this.dots[j]
                const distance = this.getDistance(dot, next)
                if (distance > this.maxDistance) continue
                const opacity = 1 - distance / this.maxDistance
                const color = `rgba(255, 255, 255, ${opacity})`
                new Line(color, dot, next).draw(this.ctx)
            }
            dot.draw(this.ctx)
        }
        requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.draw()
        })
    }
    getRandomPos() {
        return {
            x: Math.floor(Math.random() * this.canvas.width),
            y: Math.floor(Math.random() * this.canvas.height)
        }
    }
    getDistance(point1: Dot, point2: Dot) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
    }
}
class Dot {
    x: number
    y: number
    r: number
    lastPaintTime: number
    speed: {
        x: number
        y: number
    }
    constructor(x: number, y: number, r: number) {
        this.x = x
        this.y = y
        this.r = r
        this.lastPaintTime = 0
        this.speed = {
            x: this.getMinMax(-40, 40),
            y: this.getMinMax(-40, 40),
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        if (this.lastPaintTime) {
            const duration = (+new Date() - this.lastPaintTime) / 1000
            this.x += duration * this.speed.x
            this.y += duration * this.speed.y
            if (this.x <= 0) {
                this.x = 0
                this.speed.x = -this.speed.x
            } else if (this.x > ctx.canvas.width) {
                this.x = ctx.canvas.width
                this.speed.x = -this.speed.x
            }
            if (this.y <= 0) {
                this.y = 0
                this.speed.y = -this.speed.y
            } else if (this.y > ctx.canvas.height) {
                this.y = ctx.canvas.height
                this.speed.y = -this.speed.y
            }
        }
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`
        ctx.fill()
        this.lastPaintTime = +new Date()
    }
    getMinMax(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}
class Line{
    color: string
    points: Dot[]
    constructor(color: string, ...dots: Dot[]) {
        this.color = color
        this.points = dots
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        const start = this.points[0]
        ctx.moveTo(start.x, start.y)
        for (let i = 1; i < this.points.length; i++) {
            const next = this.points[i]
            ctx.lineTo(next.x, next.y)
        }
        ctx.strokeStyle = this.color
        ctx.stroke()
    }
}