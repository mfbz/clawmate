'use client';

import { Button, theme as ThemeManager, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function DunkPage() {
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
				alignItems: 'center',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 160,
				}}
			>
				<Typography.Title level={1} style={{ color: '#43ffe2', fontSize: '5em' }}>
					{'Dunk NFTs'}
				</Typography.Title>

				<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: 0 }}>
					{'Choose an NFT to dunk in the pool'}
				</Typography.Title>

				<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: 0 }}>
					{'Get rewarded with CLAW tokens'}
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
						}}
					>
						<Typography.Title level={2} style={{ margin: 0, color: '#0d1117' }}>
							{'DUNK'}
						</Typography.Title>
					</Button>
				</div>
			</div>
		</main>
	);
}
