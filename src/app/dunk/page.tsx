'use client';

import { Button, Card, Form, Input, Modal, theme as ThemeManager, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export default function DunkPage() {
	const router = useRouter();
	const { token } = ThemeManager.useToken();

	// Get connected user if any
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	// Modal stuff
	const [modalOpen, setModalOpen] = useState(false);
	const showModal = useCallback(() => setModalOpen(true), []);
	const hideModal = useCallback(() => setModalOpen(false), []);

	const [nftImage, setNftImage] = useState<string | null>(null);

	return (
		<>
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
							onClick={showModal}
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

			<Modal
				width={'80%'}
				open={modalOpen}
				onCancel={hideModal}
				closeIcon={
					<div>
						<img src={'/close-icon.png'} width={64} height={64} />
					</div>
				}
				footer={null}
				centered={true}
				styles={{
					content: { padding: token.padding * 4, background: 'transparent', boxShadow: 'none' },
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundImage: 'url(/highlight-effect.png)',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				>
					<Card
						cover={
							<div style={{ width: 400 }}>
								<div style={{ height: '0', width: '100%', paddingBottom: '100%', background: '#43ffe2' }}>
									{nftImage ? (
										<img src={nftImage} width={'100%'} height={'auto'} style={{ background: '#43ffe2' }} />
									) : (
										<div
											style={{
												width: '100%',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												paddingTop: 100,
											}}
										>
											<img src={'/nft-placeholder.png'} width={200} height={200} />
										</div>
									)}
								</div>
							</div>
						}
						bodyStyle={{ padding: 0 }}
						style={{ marginTop: 80, background: '#FFFFFF' }}
					>
						<div style={{ display: 'flex', flexDirection: 'column', padding: token.padding * 2 }}>
							<Form
								layout={'vertical'}
								initialValues={{ nftContract: '', nftTokenId: '' }}
								style={{ width: '100%' }}
								onFinish={(values) => console.log('TODO')}
							>
								<Form.Item name={'nftContract'} rules={[{ required: true }]} style={{ marginBottom: token.margin }}>
									<Input
										placeholder={'Token address'}
										size={'large'}
										style={{ background: '#FFFFFF', color: '#0d1117', borderColor: '#DDDDDD' }}
									/>
								</Form.Item>

								<Form.Item name={'nftTokenId'} rules={[{ required: true }]} style={{ marginBottom: 0 }}>
									<Input
										placeholder={'Token id'}
										size={'large'}
										style={{ background: '#FFFFFF', color: '#0d1117', borderColor: '#DDDDDD' }}
									/>
								</Form.Item>
							</Form>
						</div>
					</Card>

					<Button
						type={'primary'}
						size={'large'}
						onClick={showModal}
						style={{
							height: 64,
							paddingLeft: token.padding * 6,
							paddingRight: token.padding * 6,
							marginTop: token.margin * 4,
						}}
					>
						<Typography.Title level={2} style={{ margin: 0, color: '#0d1117' }}>
							{'DUNK'}
						</Typography.Title>
					</Button>
				</div>
			</Modal>
		</>
	);
}
