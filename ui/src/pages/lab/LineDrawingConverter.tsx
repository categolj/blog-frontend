import {useState, useRef, useEffect, useCallback} from 'react'
import {useOpenCv} from '../../hooks/useOpenCv.ts'

type Mode = 'canny' | 'laplacian' | 'sobel' | 'sketch';

const MAX_WIDTH = 2048;

const DEFAULT_BLUR = 3;
const DEFAULT_THRESHOLD1 = 50;
const DEFAULT_THRESHOLD2 = 150;
const DEFAULT_LINE_THICKNESS = 0;

const LineDrawingConverter: React.FC = () => {
    const cvStatus = useOpenCv();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('image');
    const [dragOver, setDragOver] = useState(false);
    const [mode, setMode] = useState<Mode>('canny');
    const [blur, setBlur] = useState(DEFAULT_BLUR);
    const [threshold1, setThreshold1] = useState(DEFAULT_THRESHOLD1);
    const [threshold2, setThreshold2] = useState(DEFAULT_THRESHOLD2);
    const [invert, setInvert] = useState(false);
    const [lineThickness, setLineThickness] = useState(DEFAULT_LINE_THICKNESS);
    const [sourceReady, setSourceReady] = useState(0);

    const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const rafRef = useRef<number>(0);

    const loadImageToCanvas = useCallback((src: string) => {
        const img = new Image();
        img.onload = () => {
            const canvas = sourceCanvasRef.current;
            if (!canvas) return;
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) {
                height = Math.round(height * (MAX_WIDTH / width));
                width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
            }
            setSourceReady(prev => prev + 1);
        };
        img.src = src;
    }, []);

    const handleImageFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        setFileName(file.name.replace(/\.[^.]+$/, ''));
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImageSrc(result);
            loadImageToCanvas(result);
        };
        reader.readAsDataURL(file);
    }, [loadImageToCanvas]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    }, [handleImageFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
    }, [handleImageFile]);

    // Clipboard paste
    useEffect(() => {
        const onPaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) handleImageFile(file);
                    break;
                }
            }
        };
        document.addEventListener('paste', onPaste);
        return () => document.removeEventListener('paste', onPaste);
    }, [handleImageFile]);

    const processImage = useCallback(() => {
        if (cvStatus !== 'ready' || !sourceCanvasRef.current || !outputCanvasRef.current) return;
        if (sourceCanvasRef.current.width === 0 || sourceCanvasRef.current.height === 0) return;
        const cv = window.cv;
        const src = cv.imread(sourceCanvasRef.current);
        const gray = new cv.Mat();
        const blurred = new cv.Mat();
        const dst = new cv.Mat();
        try {
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            const ksize = blur * 2 + 1;
            cv.GaussianBlur(gray, blurred, new cv.Size(ksize, ksize), 0);

            switch (mode) {
                case 'canny': {
                    cv.Canny(blurred, dst, threshold1, threshold2);
                    if (lineThickness > 0) {
                        const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(lineThickness * 2 + 1, lineThickness * 2 + 1));
                        try {
                            cv.dilate(dst, dst, kernel);
                        } finally {
                            kernel.delete();
                        }
                    }
                    cv.bitwise_not(dst, dst);
                    break;
                }
                case 'laplacian': {
                    const lapKsize = Math.max(1, (Math.floor(threshold1 / 50) * 2) + 1);
                    const lap = new cv.Mat();
                    try {
                        cv.Laplacian(blurred, lap, cv.CV_16S, lapKsize);
                        cv.convertScaleAbs(lap, dst);
                        if (lineThickness > 0) {
                            const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(lineThickness * 2 + 1, lineThickness * 2 + 1));
                            try {
                                cv.dilate(dst, dst, kernel);
                            } finally {
                                kernel.delete();
                            }
                        }
                        cv.bitwise_not(dst, dst);
                    } finally {
                        lap.delete();
                    }
                    break;
                }
                case 'sobel': {
                    const sobelKsize = Math.max(1, (Math.floor(threshold1 / 50) * 2) + 1);
                    const gradX = new cv.Mat();
                    const gradY = new cv.Mat();
                    const absX = new cv.Mat();
                    const absY = new cv.Mat();
                    try {
                        cv.Sobel(blurred, gradX, cv.CV_16S, 1, 0, sobelKsize);
                        cv.Sobel(blurred, gradY, cv.CV_16S, 0, 1, sobelKsize);
                        cv.convertScaleAbs(gradX, absX);
                        cv.convertScaleAbs(gradY, absY);
                        cv.addWeighted(absX, 0.5, absY, 0.5, 0, dst);
                        if (lineThickness > 0) {
                            const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(lineThickness * 2 + 1, lineThickness * 2 + 1));
                            try {
                                cv.dilate(dst, dst, kernel);
                            } finally {
                                kernel.delete();
                            }
                        }
                        cv.bitwise_not(dst, dst);
                    } finally {
                        gradX.delete();
                        gradY.delete();
                        absX.delete();
                        absY.delete();
                    }
                    break;
                }
                case 'sketch': {
                    const heavyKsize = Math.max(1, (threshold1 * 2) + 1);
                    const heavyBlurred = new cv.Mat();
                    try {
                        cv.GaussianBlur(gray, heavyBlurred, new cv.Size(heavyKsize, heavyKsize), 0);
                        cv.divide(gray, heavyBlurred, dst, 256);
                        if (lineThickness > 0) {
                            const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(lineThickness * 2 + 1, lineThickness * 2 + 1));
                            try {
                                cv.erode(dst, dst, kernel);
                            } finally {
                                kernel.delete();
                            }
                        }
                    } finally {
                        heavyBlurred.delete();
                    }
                    break;
                }
            }

            if (invert) {
                cv.bitwise_not(dst, dst);
            }

            outputCanvasRef.current.width = sourceCanvasRef.current.width;
            outputCanvasRef.current.height = sourceCanvasRef.current.height;
            cv.imshow(outputCanvasRef.current, dst);
        } finally {
            src.delete();
            gray.delete();
            blurred.delete();
            dst.delete();
        }
    }, [cvStatus, mode, blur, threshold1, threshold2, lineThickness, invert]);

    // Debounced processing with requestAnimationFrame
    useEffect(() => {
        if (sourceReady === 0 || cvStatus !== 'ready') return;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(() => {
            processImage();
        });
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [sourceReady, processImage, cvStatus]);

    const resetParameters = useCallback(() => {
        setBlur(DEFAULT_BLUR);
        setThreshold1(DEFAULT_THRESHOLD1);
        setThreshold2(DEFAULT_THRESHOLD2);
        setLineThickness(DEFAULT_LINE_THICKNESS);
        setInvert(false);
    }, []);

    const downloadPng = () => {
        const canvas = outputCanvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${fileName}_${mode}.png`;
        a.click();
    };

    const modes: { key: Mode; label: string }[] = [
        {key: 'canny', label: 'Canny'},
        {key: 'laplacian', label: 'Laplacian'},
        {key: 'sobel', label: 'Sobel'},
        {key: 'sketch', label: 'Sketch'},
    ];

    const statusBadge = (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            cvStatus === 'ready'
                ? 'bg-(color:--tag-bg) text-(color:--tag-text)'
                : cvStatus === 'error'
                    ? 'bg-(color:--entry-meta-bg) text-fg'
                    : 'bg-(color:--tag-bg) text-(color:--tag-text)'
        }`}>
            {cvStatus === 'ready' ? 'Ready' : cvStatus === 'error' ? 'Load failed' : 'Loading OpenCV.js...'}
        </span>
    );

    const labelClasses = 'text-sm font-medium text-fg2';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-fg2">Status:</span>
                {statusBadge}
            </div>

            {/* Hidden source canvas for OpenCV (always rendered) */}
            <canvas ref={sourceCanvasRef} style={{display: 'none'}}/>

            {/* Drop zone */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragOver
                        ? 'border-(color:--accent) bg-(color:--card-hover-bg)'
                        : imageSrc
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
                    accept="image/*"
                    onChange={handleFileInput}
                    hidden
                />
                {imageSrc ? (
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-fg">{fileName}</p>
                        <p className="text-xs text-fg2">Click, drop, or paste to change image</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-4xl text-fg2">+</p>
                        <p className="text-fg2">Drop an image here, click to select, or paste from clipboard</p>
                    </div>
                )}
            </div>

            {imageSrc && (
                <>
                    {/* Mode selector */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Mode</label>
                        <div className="flex flex-wrap gap-2">
                            {modes.map(m => (
                                <button
                                    key={m.key}
                                    className={`px-4 py-1.5 rounded-[0.35rem] text-sm font-medium transition-colors duration-300 ${
                                        mode === m.key
                                            ? 'bg-fg text-bg'
                                            : 'bg-(color:--card-bg) text-fg2 border border-(color:--empty-border) hover:border-fg2'
                                    }`}
                                    onClick={() => setMode(m.key)}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="flex items-center justify-between mb-1">
                        <label className={labelClasses}>Parameters</label>
                        <button
                            className="text-xs text-fg2 hover:text-fg underline transition-colors"
                            onClick={resetParameters}
                        >
                            Reset
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="space-y-1">
                            <label className={labelClasses}>Blur ({blur})</label>
                            <input
                                type="range"
                                min={0}
                                max={10}
                                value={blur}
                                onChange={e => setBlur(Number(e.target.value))}
                                className="w-full accent-(color:--accent)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>
                                {mode === 'canny' ? `Lower Threshold (${threshold1})` : `Sensitivity (${threshold1})`}
                            </label>
                            <input
                                type="range"
                                min={mode === 'sketch' ? 1 : 0}
                                max={255}
                                value={threshold1}
                                onChange={e => setThreshold1(Number(e.target.value))}
                                className="w-full accent-(color:--accent)"
                            />
                        </div>
                        <div className={`space-y-1 ${mode !== 'canny' ? 'invisible' : ''}`}>
                            <label className={labelClasses}>Upper Threshold ({threshold2})</label>
                            <input
                                type="range"
                                min={0}
                                max={255}
                                value={threshold2}
                                onChange={e => setThreshold2(Number(e.target.value))}
                                className="w-full accent-(color:--accent)"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClasses}>Line Thickness ({lineThickness})</label>
                            <input
                                type="range"
                                min={0}
                                max={5}
                                value={lineThickness}
                                onChange={e => setLineThickness(Number(e.target.value))}
                                className="w-full accent-(color:--accent)"
                            />
                        </div>
                        <div className="flex items-center gap-2 self-end pb-1">
                            <input
                                type="checkbox"
                                id="invert"
                                checked={invert}
                                onChange={e => setInvert(e.target.checked)}
                                className="accent-(color:--accent)"
                            />
                            <label htmlFor="invert" className={labelClasses}>Invert</label>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-fg2">Original</h3>
                            <img src={imageSrc} alt="Original" className="max-w-full rounded-md"/>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-fg2">Result</h3>
                            <canvas ref={outputCanvasRef} className="max-w-full rounded-md"/>
                        </div>
                    </div>

                    {/* Download button */}
                    <button
                        className="py-2 px-6 rounded-[0.35rem] font-semibold bg-fg text-bg hover:bg-fg2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={downloadPng}
                        disabled={cvStatus !== 'ready'}
                    >
                        Download PNG
                    </button>
                </>
            )}
        </div>
    );
};

export default LineDrawingConverter
