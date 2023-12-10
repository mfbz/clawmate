'use client';

import { Typography, theme as ThemeManager } from 'antd';
import { TokenUtils } from '../../_utils/token-utils';

export const TokenChip = function TokenChip({
	symbol,
	amount,
	color = '#FFFFFF',
}: {
	symbol: 'INJ' | 'CLAW';
	amount: bigint;
	color?: string;
}) {
	const { token } = ThemeManager.useToken();
	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
			<img
				src={symbol === 'INJ' ? '/injective-token.png' : '/claw-token.png'}
				width={32}
				height={32}
				alt={'token icon'}
			></img>

			<Typography.Text strong={true} style={{ color, marginLeft: token.margin / 2 }}>
				{TokenUtils.toNumber(amount, 18)}
			</Typography.Text>
		</div>
	);
};
