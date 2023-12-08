'use client';

import { Button, theme as ThemeManager, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function HomePage() {
	const router = useRouter();
	const { token } = ThemeManager.useToken();

	// Get connected user if any
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	return (
		<main
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'flex-end',
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'column', marginTop: 160 }}>
				<Typography.Title level={1} style={{ color: '#43ffe2', textAlign: 'right', fontSize: '5em' }}>
					{'Dunk and Grab NFTs'}
				</Typography.Title>

				<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: 0, textAlign: 'right' }}>
					{'Dunk your NFTs to get CLAW tokens'}
				</Typography.Title>

				<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: 0, textAlign: 'right' }}>
					{'Use CLAW tokens to grab random cool NFTs'}
				</Typography.Title>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
						alignItems: 'center',
						marginTop: token.margin * 2,
					}}
				>
					<Button
						type={'primary'}
						size={'large'}
						onClick={() => router.push('/dunk')}
						style={{
							height: 64,
							paddingLeft: token.padding * 4,
							paddingRight: token.padding * 4,
							marginRight: token.margin * 2,
						}}
					>
						<Typography.Title level={2} style={{ margin: 0, color: '#0d1117' }}>
							{'DUNK'}
						</Typography.Title>
					</Button>

					<Button
						type={'primary'}
						size={'large'}
						onClick={() => router.push('/grab')}
						style={{
							height: 64,
							paddingLeft: token.padding * 4,
							paddingRight: token.padding * 4,
							background: '#FFFFFF',
						}}
					>
						<Typography.Title level={2} style={{ margin: 0, color: '#0d1117' }}>
							{'GRAB'}
						</Typography.Title>
					</Button>
				</div>
			</div>
		</main>
	);
}
