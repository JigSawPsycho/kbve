let sharedPort = null;
const listeners = new Map();

export function initSharedWorker() {
	if (!sharedPort) {
		const worker = new SharedWorker('/js/shared-worker.js');
		sharedPort = worker.port;
		sharedPort.start();

		sharedPort.onmessage = (e) => {
			console.log('[Worker] onmessage received:', e.data);

			const { type, payload, error, requestId, topic } = e.data;

			if (requestId && listeners.has(requestId)) {
				const { resolve, reject } = listeners.get(requestId);
				listeners.delete(requestId);
				error ? reject(error) : resolve(payload);
			}
			else if (requestId) {
				console.warn('[Client] Received unknown requestId:', requestId);
			}
		};
	}
	return sharedPort;
}


export function useSharedWorkerCall(type, payload = {}, timeoutMs = 10000) {
	return new Promise((resolve, reject) => {
		const requestId = crypto.randomUUID();
		
		const port = initSharedWorker();

		const timeout = setTimeout(() => {
			listeners.delete(requestId);
			reject(new Error(`Request timed out: ${type}`));
		}, timeoutMs);

		listeners.set(requestId, {
			resolve: (data) => {
				clearTimeout(timeout);
				listeners.delete(requestId);
				resolve(data);
			},
			reject: (err) => {
				clearTimeout(timeout);
				listeners.delete(requestId);
				reject(err);
			}
		});

		//port.postMessage({ type, ...payload, requestId });

		port.postMessage({ type, payload, requestId });

	});
}

export function subscribeToTopic(topic, onMessage) {
	const port = initSharedWorker();

	const handler = (e) => {
		if (e.data.topic === topic) {
			onMessage(e.data.payload);
		}
	};

	port.addEventListener('message', handler);
	port.postMessage({ type: 'subscribe', topic });

	return () => {
		port.postMessage({ type: 'unsubscribe', topic });
		port.removeEventListener('message', handler);
	};
}
