import { useRef, useState, ChangeEvent } from "react";
import { filesize, compressImage, fileToBase64, download } from "../utils/file"
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
/**
 * 目标：实现tinyPng网站基本图片压缩并提供下载功能
 */
export default function ImageCompress() {
    const fileRef = useRef<HTMLInputElement|null>(null)
    const [filelist, setFilelist] = useState<ICompressedFile[]>([])
    function handleTapContainer() {
        if (fileRef.current) {
            fileRef.current.click()
        }
    }
    async function handleFileChange(ev: ChangeEvent<HTMLInputElement>) {
        if (ev.target.files && ev.target.files.length > 0) {
            const file = ev.target.files[0]
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
            setFilelist(_fileList)
            action()
            function action() {
                setTimeout(async () => {
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
                            setFilelist(newFilelist)
                            console.log("ok")
                        }                
                    } catch (error) {
                        console.log("compressfile error", error)
                    }                
                }, 2500);
            }
        }
    }
    function handleDownload(fileItem: ICompressedFile) {
        const current = filelist.find(l => l.key === fileItem.key)
        if (current) {
            download(current.url, current.name)
            alert("下载成功")
        }
    }
    return (
        <div className="flex flex-col items-center box-border">
            <div className="w-400px h-200px box-border border-2 border-dashed border-black rounded-md mt-8" onClick={handleTapContainer}>
                <figure className="icon"></figure>
                <div className="font-bold text-lg text-center">Drop your WebP,Png or JPEG files here!</div>
                <div className="font-normal text-xs text-center">Up to 20 images, max 5 MB each</div>
                <input type="file" ref={fileRef} hidden onChange={handleFileChange} />
            </div>
            {/* drop file list */}
            <div className="bg-white p-3 border border-solid border-gray-500">
                {
                    filelist.map(l => {
                        return (
                            <div key={l.key} className="bg-gray-300 px-2 py-1 box-border w-[720px] flex flex-row items-center justify-between">
                                <div className="text-sm font-bold">{l.name}</div>
                                <div className="flex flex-row items-center gap-3">
                                    <div className="text-hex-[#8cc938] text-sm">{l.originSize}</div>
                                    <div className="bg-white box-border p-0.5 rounded-2xl">
                                        <div className="h-5 w-[250px] box-border rounded-2xl overflow-hidden relative flex flex-row justify-center items-center">
                                            <span className="relative z-20 text-xs">{ l.state }</span>
                                            <div className="bg-hex-[#8cc938] absolute left-0 top-0 bottom-0 w-full z-10"></div>
                                        </div>
                                    </div>
                                    <div className="text-hex-[#8cc938] text-sm">{l.compressedSize}</div>
                                </div>
                                {
                                    l.state === "Finished" && (
                                        <div className="flex flex-row items-center gap-4">
                                            <div className="font-bold text-sm underline cursor-pointer" onClick={() => handleDownload(l)}>download</div>
                                            <div className="font-bold text-sm">{l.compressRate}</div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}