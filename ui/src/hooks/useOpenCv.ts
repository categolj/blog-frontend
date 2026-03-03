import {useState, useEffect} from 'react';

type OpenCvStatus = 'loading' | 'ready' | 'error';

const OPENCV_CDN_URL = 'https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.10.0-release.1/dist/opencv.min.js';

function isCvReady(): boolean {
	return typeof window !== 'undefined' && !!window.cv && typeof window.cv.Mat === 'function';
}

export function useOpenCv(): OpenCvStatus {
	const [status, setStatus] = useState<OpenCvStatus>(() => {
		return isCvReady() ? 'ready' : 'loading';
	});

	useEffect(() => {
		if (status === 'ready') {
			return;
		}

		const waitForInit = () => {
			if (isCvReady()) {
				setStatus('ready');
				return;
			}
			if (window.cv && typeof window.cv === 'object') {
				window.cv['onRuntimeInitialized'] = () => setStatus('ready');
			}
		};

		const existingScript = document.querySelector(`script[src="${OPENCV_CDN_URL}"]`);
		if (existingScript) {
			waitForInit();
			return;
		}

		const script = document.createElement('script');
		script.src = OPENCV_CDN_URL;
		script.async = true;

		script.onload = () => {
			waitForInit();
		};

		script.onerror = () => {
			setStatus('error');
		};

		document.head.appendChild(script);
	}, [status]);

	return status;
}
