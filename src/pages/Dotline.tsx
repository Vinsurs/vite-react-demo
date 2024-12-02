import React, { useEffect, useRef } from "react";
import { Graph } from "../utils/dotline"
import { useOutletContext } from "react-router-dom";

export default function Dotline() {
    const layoutContext = useOutletContext<{from: string}>()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if(canvasRef.current) {
            new Graph(canvasRef.current, 60).setup()
        }
    }, [])
    return (
        <canvas ref={canvasRef} title={layoutContext.from} className="bg-black w-[800px] h-[600px] box-border mx-auto"></canvas>
    )
}