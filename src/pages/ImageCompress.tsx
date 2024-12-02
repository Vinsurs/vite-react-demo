import React from "react";
import { filesize, compressImage, fileToBase64, download, sleep } from "../utils/file"
import "../style/imageCompress.css"

type ICompressedFile = {
    key: string
    url: string
    name: string
    originSize: string
    originSizeByte: number
    state: "Finished" | "Failed" | "Uploading"
    compressedSize: string
    compressedSizeByte: number
    compressRate: string
}
type IData = {
    fileRef: React.RefObject<HTMLInputElement>
}
type IState = {
    filelist: ICompressedFile[]
}
/**
 * 目标：实现tinyPng网站基本图片压缩并提供下载功能
 */
export default class ImageCompress extends React.Component<unknown, IState> {
    data: IData
    constructor(props: unknown) {
        super(props)
        this.state = {
            filelist: []
        }
        this.data = {
            fileRef: React.createRef<HTMLInputElement>()
        } 
    }
    componentDidMount(): void {
        document.addEventListener("paste", this.handlePaste, false)
    }
    componentWillUnmount(): void {
        document.removeEventListener("paste", this.handlePaste, false)
    }
    handleWriteClipboard = () => {
        navigator.clipboard.writeText("写入文本").then(() => console.log("写入成")).catch(console.info)
    }
    handleReadClipboard = () => {
        navigator.permissions.query({ name: "clipboard-read" }).then(status => {
            if (status.state === "granted" || status.state === "prompt") {
                navigator.clipboard.read().then(items => {
                    console.log("items", items)
                    for (const item of items) {
                        for (const type of item.types) {
                            if (type.includes("text/")) {
                                item.getType(type).then(blob => {
                                    console.log("blob text:", blob, typeof blob)
                                    const textDecoder = new TextDecoder("utf-8")
                                    const reader = new FileReader()
                                    reader.onload = function () {
                                        const text = textDecoder.decode(reader.result as ArrayBuffer)
                                        console.log('text', text)
                                    }
                                    reader.readAsArrayBuffer(blob)
                                })
                            } else if (type.includes("image/")) {
                                console.log("剪切板是文件数据")
                                item.getType(type).then(blob => {
                                    console.log("blob image: ", blob, typeof blob)
                                    const reader = new FileReader()
                                    reader.onload = function () {
                                        console.log('image', reader.result)
                                    }
                                    reader.readAsDataURL(blob)
                                })
                            }
                        }
                    }
                }).catch(err => console.log("err", err))
            }
        })
    }
    handlePaste = (ev: React.ClipboardEvent) => {
        ev.preventDefault()
        if (ev.clipboardData.types.includes("Files")) {
            const file = ev.clipboardData.files.item(0)
            console.log("File", file)
            if (file && file.type.includes("image/")) {
                this.processFile(file)
            }
        }
        
    }
    handleTapContainer = () => {
        const { fileRef } = this.data
        if (fileRef.current) {
            fileRef.current.click()
        }
    }
    processFile = (file: File) => {
        const { filelist } = this.state
        const key = Date.now() + ""
        const _fileList = filelist.slice()
        _fileList.push({
            key,
            url: "",
            name: file.name,
            originSize: filesize(file.size) as string,
            originSizeByte: file.size,
            compressedSize: "",
            compressedSizeByte: 0,
            state: "Uploading",
            compressRate: '-0%'
        })
        this.setState({
            filelist: _fileList
        }, action)
        const _that = this
        function action() {
            setTimeout(async () => {
                const { filelist } = _that.state
                const imageUrl = await fileToBase64(file)
                try {
                    const { url, size, sizeByte } = await compressImage(imageUrl)
                    console.log("after compress:", size, sizeByte)
                    const newFilelist = filelist.concat()
                    console.log("newFilelist.length", newFilelist.length)
                    const index = newFilelist.findIndex(l => l.key === key)
                    if (~index) {
                        newFilelist[index].url = url
                        newFilelist[index].compressedSize = size
                        newFilelist[index].compressedSizeByte = sizeByte
                        newFilelist[index].state = "Finished"
                        const compressRate = ((newFilelist[index].originSizeByte - newFilelist[index].compressedSizeByte) * 100 / newFilelist[index].originSizeByte).toFixed(2)
                        newFilelist[index].compressRate = "-" + compressRate + "%"
                        _that.setState({
                            filelist: newFilelist
                        })
                        console.log("ok")
                    }                
                } catch (error) {
                    console.log("compressfile error", error)
                }                
            }, 2500);
        }
    }
    handleFileChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files && ev.target.files.length > 0) {
            const file = ev.target.files[0]
            this.processFile(file)
        }
    }
    handleDownload = (fileItem: ICompressedFile) => {
        const { filelist } = this.state
        const current = filelist.find(l => l.key === fileItem.key)
        if (current) {
            download(current.url, current.name)
            alert("下载成功")
        }
    }
    handleDragEnter = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        const target = ev.target as HTMLDivElement
        target.classList.remove('border-black')
        target.classList.add('border-sky-500')
    }
    handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
    }
    handleDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement
        target.classList.remove('border-sky-500')
        target.classList.add('border-black')
    }
    handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        const target = ev.target as HTMLDivElement
        target.classList.remove('border-sky-500')
        target.classList.add('border-black')
        const files = ev.dataTransfer.files
        if (files && files.length > 0) {
            const file = files.item(0)
            if (file && file.type.match(/image\/\w+/)) {
                this.processFile(file)
            } else {
                alert("拖拽的不是图片")
            }
        }
    }
    renderFileList() {
        const { filelist } = this.state
        if (filelist.length <= 0) return null
        return (
            <div className="bg-white p-3 border border-solid border-gray-500">
                {
                    filelist.map(l => {
                        return (
                            <div key={l.key} className="bg-gray-300 px-2 py-1 box-border w-[720px] flex flex-row items-center justify-between mt-4">
                                <div className="text-sm font-bold">{l.name}</div>
                                <div className="flex flex-row items-center gap-3">
                                    <div className="text-hex-[#8cc938] text-sm">{l.originSizeByte}</div>
                                    <div className="bg-white box-border p-0.5 rounded-2xl">
                                        <div className="h-5 w-[250px] box-border rounded-2xl overflow-hidden relative flex flex-row justify-center items-center">
                                            <span className="relative z-20 text-xs">{ l.state }</span>
                                            <div className="bg-hex-[#8cc938] absolute left-0 top-0 bottom-0 w-full z-10"></div>
                                        </div>
                                    </div>
                                    <div className="text-hex-[#8cc938] text-sm">{l.compressedSizeByte}</div>
                                </div>
                                {
                                    l.state === "Finished" && (
                                        <div className="flex flex-row items-center gap-4">
                                            <div className="font-bold text-sm underline cursor-pointer" onClick={() => this.handleDownload(l)}>download</div>
                                            <div className="font-bold text-sm">{l.compressRate}</div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    render(): React.ReactNode {
        const { fileRef } = this.data
        return (
            <div className="flex flex-col items-center box-border">
                <button onClick={this.handleReadClipboard}>读取剪切板</button>
                <button onClick={this.handleWriteClipboard}>写入剪切板</button>
                <div className="w-400px h-200px box-border border-2 border-dashed border-black rounded-md mt-8 " 
                onClick={this.handleTapContainer} 
                onDragEnter={this.handleDragEnter}
                onDragOver={this.handleDragOver} 
                onDragLeave={this.handleDragLeave} 
                onDrop={this.handleDrop}>
                    <figure className="icon"></figure>
                    <div className="font-bold text-lg text-center">Drop your WebP,Png or JPEG files here!</div>
                    <div className="font-normal text-xs text-center">Up to 20 images, max 5 MB each</div>
                    <input type="file" ref={fileRef} hidden onChange={this.handleFileChange} />
                </div>
                {/* drop file list */}
                { this.renderFileList() }
            </div>
        )
    }
}