'use client';

import Icon from '@ant-design/icons';
import { Button, Layout, theme as ThemeManager } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { AiOutlineWallet } from 'react-icons/ai';
import { useAccount, useConnect } from 'wagmi';

export const Application = function Application({ children }: React.PropsWithChildren) {
	const router = useRouter();

	// Antd design token
	const { token } = ThemeManager.useToken();

	// Wagmi account data
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

	// NB: Only use metamask that is 0 in connectors array
	const connector = useMemo(() => {
		return connectors[0];
	}, [connectors]);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Layout style={{ minHeight: '100vh', width: '80%', margin: '0 auto' }}>
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
					<div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => router.push('/')}>
						<img src={'/clawmate-logo.png'} height={32} alt={'clawmate logo'}></img>
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
								<Button>{'TODO'}</Button>

								<Button
									icon={<Icon component={() => <AiOutlineWallet />} />}
									onClick={() => router.push('/users/' + address)}
								>
									{''}
								</Button>
							</>
						)}
					</div>
				</Layout.Header>

				<Layout.Content style={{ paddingLeft: token.paddingLG, paddingRight: token.paddingLG }}>
					{children}
				</Layout.Content>

				<Layout.Footer style={{ textAlign: 'center', padding: token.paddingLG }}>
					{'Copyright © 2023 Clawmate'}
				</Layout.Footer>
			</Layout>
		</Layout>
	);
};
