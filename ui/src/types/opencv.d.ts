declare namespace cv {
	class Mat {
		rows: number;
		cols: number;
		data: Uint8Array;
		delete(): void;
	}

	class Size {
		constructor(width: number, height: number);
	}

	class Scalar {
		constructor(v0: number, v1?: number, v2?: number, v3?: number);
	}

	const CV_8U: number;
	const CV_16S: number;
	const CV_64F: number;
	const COLOR_RGBA2GRAY: number;
	const COLOR_GRAY2RGBA: number;

	function imread(canvas: HTMLCanvasElement | string): Mat;
	function imshow(canvas: HTMLCanvasElement | string, mat: Mat): void;
	function cvtColor(src: Mat, dst: Mat, code: number): void;
	function GaussianBlur(src: Mat, dst: Mat, ksize: Size, sigmaX: number): void;
	function Canny(src: Mat, dst: Mat, threshold1: number, threshold2: number): void;
	function Laplacian(src: Mat, dst: Mat, ddepth: number, ksize?: number): void;
	function Sobel(src: Mat, dst: Mat, ddepth: number, dx: number, dy: number, ksize?: number): void;
	function addWeighted(src1: Mat, alpha: number, src2: Mat, beta: number, gamma: number, dst: Mat): void;
	function convertScaleAbs(src: Mat, dst: Mat, alpha?: number, beta?: number): void;
	function divide(src1: Mat, src2: Mat, dst: Mat, scale?: number): void;
	function bitwise_not(src: Mat, dst: Mat): void;
	function dilate(src: Mat, dst: Mat, kernel: Mat): void;
	function erode(src: Mat, dst: Mat, kernel: Mat): void;
	function getStructuringElement(shape: number, ksize: Size): Mat;

	const MORPH_RECT: number;
	const MORPH_ELLIPSE: number;

	let onRuntimeInitialized: () => void;
}

interface Window {
	cv: typeof cv;
}
