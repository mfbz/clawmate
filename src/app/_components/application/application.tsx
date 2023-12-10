'use client';

import Icon from '@ant-design/icons';
import { Button, Layout, theme as ThemeManager } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { useAccount, useConnect, useContractRead, useDisconnect } from 'wagmi';
import { InjectiveConstants } from '../../../constants/injective';
import { TokenChip } from '../token-chip';

let refetchHeaderCallback: (() => Promise<void>) | null = null;

function setRefetchHeader(_refetchHeaderCallback: () => Promise<void>) {
	refetchHeaderCallback = _refetchHeaderCallback;
}

export async function refetchHeader() {
	if (refetchHeaderCallback) await refetchHeaderCallback();
}

export const Application = function Application({ children }: React.PropsWithChildren) {
	// To navigate to other pages
	const router = useRouter();
	// Get path in order to know which segmented option to highlight
	const pathname = usePathname();

	// Antd design token
	const { token } = ThemeManager.useToken();

	// Wagmi account data
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
	const { disconnect } = useDisconnect();

	// NB: Only use metamask that is 0 in connectors array
	const connector = useMemo(() => {
		return connectors[0];
	}, [connectors]);

	const {
		data: balanceData,
		isError: balanceIsError,
		isLoading: balanceIsLoading,
		refetch: balanceRefetch,
	} = useContractRead({
		address: InjectiveConstants.NETWORK_DATA.contracts.ClawmateToken.address as any,
		abi: [
			{
				inputs: [
					{
						internalType: 'address',
						name: 'account',
						type: 'address',
					},
				],
				name: 'balanceOf',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256',
					},
				],
				stateMutability: 'view',
				type: 'function',
			},
		],
		functionName: 'balanceOf',
		args: [address],
	});
	// Set balance refetcher
	useEffect(() => {
		setRefetchHeader(async () => {
			await balanceRefetch();
		});
	}, [balanceRefetch]);

	const backgroundImage = useMemo(() => {
		switch (pathname) {
			case '/':
				return '/banner-hero.png';
			case '/dunk':
				return '/banner-dunk.png';
			case '/grab':
				return '/banner-grab.png';
			default:
				return undefined;
		}
	}, [pathname]);

	return (
		<Layout
			style={{
				minHeight: '100vh',
				position: 'relative',
			}}
		>
			<div
				style={{
					minHeight: '100vh',
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'top',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					zIndex: 0,
				}}
			></div>

			<Layout style={{ minHeight: '100vh', width: '80%', margin: '0 auto', background: 'transparent', zIndex: 1 }}>
				<Layout.Header
					style={{
						height: 64 + token.padding,
						paddingTop: token.padding / 2,
						paddingBottom: token.padding / 2,
						paddingLeft: token.paddingLG,
						paddingRight: token.paddingLG,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						background: 'transparent',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
						<div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => router.push('/')}>
							<img src={'/clawmate-logo.png'} height={32} alt={'clawmate logo'}></img>
						</div>

						<Button
							type={'text'}
							onClick={() => router.push('/dunk')}
							style={{
								marginLeft: token.margin * 2,
								color: pathname === '/dunk' ? '#43ffe2' : '#FFFFFF',
								borderBottom: pathname === '/dunk' ? '4px solid #43ffe2' : '0px solid #FFFFFF',
							}}
						>
							{'DUNK'}
						</Button>

						<Button
							type={'text'}
							onClick={() => router.push('/grab')}
							style={{
								marginLeft: token.margin,
								color: pathname === '/grab' ? '#43ffe2' : '#FFFFFF',
								borderBottom: pathname === '/grab' ? '4px solid #43ffe2' : '0px solid #FFFFFF',
							}}
						>
							{'GRAB'}
						</Button>
					</div>

					<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
						{isDisconnected ? (
							<>
								<Button type={'primary'} disabled={!connector.ready} onClick={() => connect({ connector })}>
									{'Connect wallet'}
								</Button>
							</>
						) : (
							<>
								{balanceData !== null && balanceData !== undefined && (
									<div style={{ marginRight: token.margin * 2 }}>
										<TokenChip symbol={'CLAW'} amount={balanceData as bigint} />
									</div>
								)}

								<Button
									type={'primary'}
									icon={<Icon component={() => <AiOutlinePoweroff />} />}
									onClick={() => disconnect()}
								/>
							</>
						)}
					</div>
				</Layout.Header>

				<Layout.Content
					style={{
						display: 'flex',
						paddingLeft: token.paddingLG,
						paddingRight: token.paddingLG,
						background: undefined,
					}}
				>
					<div style={{ flex: 1 }}>{children}</div>
				</Layout.Content>
			</Layout>
		</Layout>
	);
};
