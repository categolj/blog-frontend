import {useState, useRef, useEffect, useCallback} from 'react'
import {FFmpeg} from '@ffmpeg/ffmpeg'
import {fetchFile} from '@ffmpeg/util'
import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'

const MovToGifConverter: React.FC = () => {
    const [loaded, setLoaded] = useState(false)
    const [inputFile, setInputFile] = useState<File | null>(null)
    const [outputURL, setOutputURL] = useState<string | null>(null)
    const [converting, setConverting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [logMessages, setLogMessages] = useState<string[]>([])
    const [scale, setScale] = useState('720')
    const [fps, setFps] = useState('10')
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low')
    const [speed, setSpeed] = useState(1)
    const [dragOver, setDragOver] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    const ffmpegRef = useRef(new FFmpeg())
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const load = async () => {
            const ffmpeg = ffmpegRef.current

            ffmpeg.on('progress', ({progress: p}) => {
                if (p > 0 && p < 1) {
                    setProgress(Math.round(p * 100))
                }
            })

            ffmpeg.on('log', ({message}) => {
                setLogMessages(prev => [...prev.slice(-99), message])
            })

            try {
                await ffmpeg.load({coreURL, wasmURL})
                setLoaded(true)
            } catch (e) {
                console.error('Failed to load FFmpeg:', e)
                setLoadError(e instanceof Error ? e.message : 'Unknown error')
            }
        }

        load()
    }, [])

    const handleFile = useCallback((file: File) => {
        setInputFile(file)
        setOutputURL(null)
        setProgress(0)
        setLogMessages([])
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }, [handleFile])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }, [])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }, [handleFile])

    const convert = async () => {
        if (!inputFile || !loaded) return

        setConverting(true)
        setProgress(0)
        setLogMessages([])
        setOutputURL(null)

        const ffmpeg = ffmpegRef.current

        try {
            await ffmpeg.writeFile('input.mov', await fetchFile(inputFile))

            const scaleVal = parseInt(scale, 10) || 720
            const fpsVal = parseInt(fps, 10) || 10
            const speedFilter = speed !== 1 ? `setpts=${(1 / speed).toFixed(4)}*PTS,` : ''
            const fpsFilter = `fps=${fpsVal},`
            const scaleFilter = `scale=${scaleVal}:-1:flags=lanczos`

            if (quality === 'high') {
                const paletteVf = `${speedFilter}${fpsFilter}${scaleFilter},palettegen=max_colors=256:stats_mode=diff`
                await ffmpeg.exec([
                    '-i', 'input.mov',
                    '-vf', paletteVf,
                    'palette.png',
                ])
                const outputVf = `${speedFilter}${fpsFilter}${scaleFilter} [x]; [x][1:v] paletteuse=dither=floyd_steinberg`
                await ffmpeg.exec([
                    '-i', 'input.mov',
                    '-i', 'palette.png',
                    '-lavfi', outputVf,
                    'output.gif',
                ])
            } else {
                const ditherOpt = quality === 'medium'
                    ? ',split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3'
                    : ''
                const vf = `${speedFilter}${fpsFilter}${scaleFilter}${ditherOpt}`
                await ffmpeg.exec([
                    '-i', 'input.mov',
                    '-vf', vf,
                    'output.gif',
                ])
            }

            const data = await ffmpeg.readFile('output.gif') as Uint8Array
            const blob = new Blob([(data as unknown as BlobPart)], {type: 'image/gif'})
            setOutputURL(URL.createObjectURL(blob))
        } catch (e) {
            console.error('Conversion failed:', e)
            setLogMessages(prev => [...prev, `Error: ${e instanceof Error ? e.message : 'Conversion failed'}`])
        } finally {
            setConverting(false)
        }
    }

    const downloadGif = () => {
        if (!outputURL) return
        const a = document.createElement('a')
        a.href = outputURL
        const baseName = inputFile?.name.replace(/\.[^.]+$/, '') ?? 'output'
        a.download = `${baseName}.gif`
        a.click()
    }

    const statusBadge = (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            loaded
                ? 'bg-(color:--tag-bg) text-(color:--tag-text)'
                : loadError
                    ? 'bg-(color:--entry-meta-bg) text-fg'
                    : 'bg-(color:--tag-bg) text-(color:--tag-text)'
        }`}>
            {loaded ? 'Ready' : loadError ? 'Load failed' : 'Loading FFmpeg...'}
        </span>
    )

    const inputClasses = 'w-full px-3 py-2 rounded-md border border-(color:--empty-border) bg-(color:--card-bg) text-fg text-sm focus:outline-none focus:ring-2 focus:ring-(color:--accent)'
    const labelClasses = 'text-sm font-medium text-fg2'

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-fg2">Status:</span>
                {statusBadge}
            </div>

            {/* Drop zone */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragOver
                        ? 'border-(color:--accent) bg-(color:--card-hover-bg)'
                        : inputFile
                            ? 'border-(color:--empty-border) bg-(color:--card-bg)'
                            : 'border-(color:--empty-border) hover:border-fg2'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,.mov"
                    onChange={handleFileInput}
                    hidden
                />
                {inputFile ? (
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-fg">{inputFile.name}</p>
                        <p className="text-sm text-fg2">{(inputFile.size / 1024 / 1024).toFixed(1)} MB</p>
                        <p className="text-xs text-fg2">Click or drop to change file</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-4xl text-fg2">+</p>
                        <p className="text-fg2">Drop a video file here or click to select</p>
                    </div>
                )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                    <label className={labelClasses}>Width (px)</label>
                    <input
                        type="number"
                        value={scale}
                        onChange={e => setScale(e.target.value)}
                        min={100}
                        max={1920}
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-1">
                    <label className={labelClasses}>FPS</label>
                    <input
                        type="number"
                        value={fps}
                        onChange={e => setFps(e.target.value)}
                        min={1}
                        max={30}
                        className={inputClasses}
                    />
                </div>
                <div className="space-y-1">
                    <label className={labelClasses}>Quality</label>
                    <select
                        value={quality}
                        onChange={e => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                        className={inputClasses}
                    >
                        <option value="low">Low (fast)</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (slow)</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className={labelClasses}>Speed</label>
                    <select
                        value={speed}
                        onChange={e => setSpeed(Number(e.target.value))}
                        className={inputClasses}
                    >
                        <option value={0.25}>0.25x</option>
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                        <option value={4}>4x</option>
                    </select>
                </div>
            </div>

            {/* Convert button */}
            <button
                className="w-full py-3 px-4 rounded-[0.35rem] font-semibold bg-fg text-bg hover:bg-fg2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                onClick={convert}
                disabled={!loaded || !inputFile || converting}
            >
                {converting ? `Converting... ${progress}%` : 'Convert to GIF'}
            </button>

            {/* Progress bar */}
            {converting && (
                <div className="w-full h-2 bg-(color:--card-bg) rounded-full overflow-hidden border border-(color:--empty-border)">
                    <div
                        className="h-full bg-fg transition-all duration-300"
                        style={{width: `${progress}%`}}
                    />
                </div>
            )}

            {/* Result */}
            {outputURL && (
                <div className="space-y-4 p-4 rounded-lg bg-(color:--card-bg) border border-(color:--empty-border)">
                    <h3 className="text-lg font-semibold text-fg">Result</h3>
                    <img src={outputURL} alt="Converted GIF" className="max-w-full rounded-md"/>
                    <button
                        className="py-2 px-6 rounded-[0.35rem] font-semibold bg-fg text-bg hover:bg-fg2 transition-colors duration-300"
                        onClick={downloadGif}
                    >
                        Download GIF
                    </button>
                </div>
            )}

            {/* Log */}
            {logMessages.length > 0 && (
                <details className="rounded-lg bg-(color:--card-bg) border border-(color:--empty-border)">
                    <summary className="px-4 py-2 cursor-pointer text-sm font-medium text-fg2">
                        FFmpeg Log ({logMessages.length})
                    </summary>
                    <pre className="px-4 py-2 text-xs !text-fg !bg-(color:--card-bg) border-none overflow-x-auto max-h-48 overflow-y-auto">
                        {logMessages.join('\n')}
                    </pre>
                </details>
            )}
        </div>
    )
}

export default MovToGifConverter
