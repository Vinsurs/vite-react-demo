import { filesize } from 'filesize'
export function fileToBase64(file: Blob) {
    return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.addEventListener("load", function () {
            resolve(reader.result as string)
        }, false)
        reader.readAsDataURL(file)
    })
}
export function download(url: string, filename: string) {
    const event = new MouseEvent("click", {
        bubbles: false,
    })
    const a = document.createElement("a")
    a.download = filename
    a.href = url
    a.dispatchEvent(event)
}
export function compressImage(imageUrl: string, type = "image/jpeg") {
    return new Promise<{ url: string; size: string; sizeByte: number; }>((resolve, reject) => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D 
        const image = new Image()
        image.onload = function () {
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            canvas.toBlob(async blob => {
                const url = await fileToBase64(blob as Blob)
                resolve({
                    size: filesize(blob?.size) as string,
                    sizeByte: blob?.size as number,
                    url
                })
            }, type, 0.3)
        }
        image.onerror = reject
        image.src = imageUrl
        image.crossOrigin = 'anonymous'
    })
}
export function sleep(delay: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(null)
        }, delay);
    })
}
export { filesize }