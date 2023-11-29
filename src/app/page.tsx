'use client';

import { useAccount } from 'wagmi';

export default function HomePage() {
	// Get connected user if any
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	return (
		<main>
			<div></div>
		</main>
	);
}
