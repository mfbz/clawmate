'use client';

import { Card, List, theme as ThemeManager, Typography } from 'antd';
import { Metadata } from '../../_interfaces/metadata';
import { Nft } from '../../_interfaces/nft';
import { NftCard } from './components/nft-card';

export const NftCardGrid = function NftCardGrid({
	nfts,
	disabled,
	onGetMetadata,
}: {
	nfts: Nft[];
	disabled?: boolean;
	onGetMetadata: (tokenAddress: string, tokenId: bigint) => Promise<Metadata | null> | Metadata | null;
}) {
	const { token } = ThemeManager.useToken();

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<List
				grid={{ gutter: token.margin, column: 3 }}
				dataSource={nfts}
				renderItem={(item) => (
					<List.Item>
						<NftCard
							nft={item}
							onGetMetadata={async () => await onGetMetadata(item.token, item.id)}
							disabled={disabled}
						/>
					</List.Item>
				)}
				locale={{
					emptyText: <div></div>,
				}}
			/>
		</div>
	);
};
