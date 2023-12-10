'use client';

import { Card, theme as ThemeManager, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Metadata } from '../../../_interfaces/metadata';
import { Nft } from '../../../_interfaces/nft';

export const NftCard = function NftCard({
	nft,
	disabled,
	onGetMetadata,
}: {
	nft: Nft;
	disabled?: boolean;
	onGetMetadata: () => Promise<Metadata | null> | Metadata | null;
}) {
	const { token } = ThemeManager.useToken();

	const [metadata, setMetadata] = useState<Metadata | null>(null);
	useEffect(() => {
		const fetchMetadata = async () => {
			const _metadata = await onGetMetadata();
			setMetadata(_metadata);
		};
		fetchMetadata();
	}, [onGetMetadata]);

	return (
		<Card
			cover={
				<img
					src={metadata?.image || '/nft-placeholder.png'}
					width={'100%'}
					height={'auto'}
					style={{ background: '#43ffe2' }}
				/>
			}
			bodyStyle={{ padding: 0 }}
			style={{ background: '#FFFFFF', border: '1px solid #FFFFFF' }}
		>
			<div style={{ display: 'flex', flexDirection: 'column', padding: token.padding }}>
				<Typography.Text style={{ marginTop: 0, color: '#161D27', overflow: 'hidden' }} ellipsis={true}>
					{nft.token}
				</Typography.Text>

				<Typography.Text strong={true} style={{ marginTop: token.margin, color: '#161D27' }}>
					{'#' + nft.id.toString()}
				</Typography.Text>
			</div>
		</Card>
	);
};
