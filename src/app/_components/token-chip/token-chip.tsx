'use client';

import { Typography } from 'antd';
import { TokenUtils } from '../../_utils/token-utils';

export const TokenChip = function TokenChip({
	token,
	amount,
	color = '#FFFFFF',
}: {
	token: 'INJ' | 'CLAW';
	amount: bigint;
	color?: string;
}) {
	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
			<img
				src={token === 'INJ' ? '/injective-token.png' : '/claw-token'}
				width={32}
				height={32}
				alt={'token icon'}
			></img>

			<Typography.Text strong={true} style={{ color }}>
				{TokenUtils.toNumber(amount, 18)}
			</Typography.Text>
		</div>
	);
};
