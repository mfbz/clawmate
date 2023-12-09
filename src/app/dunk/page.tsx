'use client';

import Icon from '@ant-design/icons';
import { Button, Card, ConfigProvider, Form, Input, Modal, Spin, theme as ThemeManager, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce, useWindowSize } from 'usehooks-ts';
import { useAccount, useWalletClient } from 'wagmi';
import { getPublicClient, waitForTransaction } from 'wagmi/actions';
import { InjectiveConstants } from '../../constants/injective';
import { refetchHeader } from '../_components/application';
import { TokenUtils } from '../_utils/token-utils';
import { AiOutlineCodeSandbox } from 'react-icons/ai';

export default function DunkPage() {
	const router = useRouter();
	const { token } = ThemeManager.useToken();

	// Get connected user if any
	const { address, isConnecting, isConnected, isDisconnected } = useAccount();

	// To correctly space hero
	const { height } = useWindowSize();
	// Hero top calculated
	const heroTop = useMemo(() => {
		return (height - 720) / 3;
	}, [height]);

	// Modal stuff
	const [modalOpen, setModalOpen] = useState(false);
	const showModal = useCallback(() => setModalOpen(true), []);
	const hideModal = useCallback(() => setModalOpen(false), []);

	// Form reference
	const [form] = Form.useForm();
	// Needed data
	const [tokenData, setTokenData] = useState<{ tokenAddress: string; tokenId: string } | null>(null);
	// Debounce it to avoid spamming public endpoint
	const debouncedTokenData = useDebounce(tokenData, 500);

	// Get metadata from erc20 token contract uri compatible with opensea standard
	const onGetMetadata = useCallback(async (tokenAddress: string, tokenId: bigint) => {
		try {
			const uri = await getPublicClient().readContract({
				address: tokenAddress as any,
				abi: [
					{
						inputs: [
							{
								internalType: 'uint256',
								name: '_tokenId',
								type: 'uint256',
							},
						],
						name: 'tokenURI',
						outputs: [
							{
								internalType: 'string',
								name: '',
								type: 'string',
							},
						],
						stateMutability: 'view',
						type: 'function',
					},
				],
				functionName: 'tokenURI',
				args: [tokenId],
			});

			const result = await fetch(uri);
			return await result.json();
		} catch (error) {
			return null;
		}
	}, []);

	// Token image
	const [tokenImage, setTokenImage] = useState<string | null>(null);
	// When data available fetch token image
	useEffect(() => {
		const fetchTokenImage = async (tokenAddress: string, tokenId: bigint) => {
			try {
				const data = await onGetMetadata(tokenAddress, tokenId);
				if (data?.image?.length) {
					setTokenImage(data.image);
				} else {
					setTokenImage(null);
				}
			} catch (error) {
				console.log('Error fetching token image');
			}
		};

		if (
			debouncedTokenData?.tokenAddress?.length &&
			debouncedTokenData?.tokenId?.length &&
			!isNaN(+debouncedTokenData.tokenId)
		) {
			fetchTokenImage(debouncedTokenData.tokenAddress, TokenUtils.toBigInt(+debouncedTokenData.tokenId, 0));
		}
	}, [debouncedTokenData, onGetMetadata]);

	// Get token reward
	const onGetTokenReward = useCallback(async (tokenAddress: string) => {
		try {
			const data = await getPublicClient().readContract({
				address: InjectiveConstants.NETWORK_DATA.contracts.ClawmateManager.address as any,
				abi: [
					{
						inputs: [
							{
								internalType: 'address',
								name: '_token',
								type: 'address',
							},
						],
						name: 'getTokenReward',
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
				functionName: 'getTokenReward',
				args: [tokenAddress as any],
			});

			return data;
		} catch (error) {
			return null;
		}
	}, []);

	// Dunk management
	const [dunkLoading, setDunkLoading] = useState(false);
	// Token reward
	const [tokenReward, setTokenReward] = useState<bigint | null>(null);

	// Get wallet client to do transactions
	const { data: walletClient } = useWalletClient();
	// Execute dunk token
	const handleDunkToken = useCallback(async () => {
		// Set loading
		setDunkLoading(true);

		try {
			// Validate it exists
			if (!walletClient) throw new Error();

			// Execute write with simulate to validate transaction
			const { request } = await getPublicClient().simulateContract({
				account: walletClient.account.address,
				address: tokenData?.tokenAddress! as any,
				abi: [
					{
						inputs: [
							{
								internalType: 'address',
								name: 'from',
								type: 'address',
							},
							{
								internalType: 'address',
								name: 'to',
								type: 'address',
							},
							{
								internalType: 'uint256',
								name: 'tokenId',
								type: 'uint256',
							},
						],
						name: 'safeTransferFrom',
						outputs: [],
						stateMutability: 'nonpayable',
						type: 'function',
					},
				],
				functionName: 'safeTransferFrom',
				args: [
					walletClient.account.address,
					InjectiveConstants.NETWORK_DATA.contracts.ClawmateManager.address as any,
					TokenUtils.toBigInt(+tokenData?.tokenId!, 0),
				],
			});
			// If we are here it means no error has been thrown so continue and execute the transaction
			const hash = await walletClient.writeContract(request);
			// Wait for transaction to be confirmed
			const receipt = await waitForTransaction({ hash });
			console.log(receipt);

			// Now everything is completed so display reward
			const reward = await onGetTokenReward(tokenData?.tokenAddress!);
			setTokenReward(reward);

			// Refetch balance in the header
			await refetchHeader();
		} catch (error) {
			// hehe
			console.log(error);
		}

		// Set no more loading
		setDunkLoading(false);
	}, [tokenData, walletClient, onGetTokenReward]);

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
						marginTop: heroTop,
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
						backgroundImage: tokenReward ? 'url(/highlight-effect.png)' : undefined,
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				>
					{dunkLoading ? (
						<>
							<Spin
								indicator={
									<Icon
										style={{ fontSize: 200, color: '#FFFFFF' }}
										component={(props: any) => <AiOutlineCodeSandbox {...props} fill={'#FFFFFF'} />}
										spin={true}
									/>
								}
							/>

							<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: token.margin, textAlign: 'center' }}>
								{'Submitting transaction...'}
							</Typography.Title>
						</>
					) : tokenReward ? (
						<>
							<img src={'/claw-token-big.png'} width={'30%'} height={'auto'} />

							<Typography.Title
								level={1}
								style={{ color: '#43ffe2', textAlign: 'center', fontSize: '3em', marginTop: token.margin }}
							>
								{'Earned ' + TokenUtils.toNumber(tokenReward, 18) + ' CLAW tokens'}
							</Typography.Title>

							<Button
								type={'primary'}
								size={'large'}
								onClick={() => {
									// Clear everything
									hideModal();
									setTokenReward(null);
									form.resetFields();
								}}
								style={{
									height: 64,
									paddingLeft: token.padding * 6,
									paddingRight: token.padding * 6,
									marginTop: token.margin * 2,
									background: '#FFFFFF',
								}}
							>
								<Typography.Title
									level={2}
									style={{
										margin: 0,
										color: '#0d1117',
									}}
								>
									{'AWESOME!'}
								</Typography.Title>
							</Button>
						</>
					) : (
						<>
							<Card
								cover={
									<div style={{ width: '100%' }}>
										{tokenImage ? (
											<img src={tokenImage} width={'100%'} height={'auto'} style={{ background: '#43ffe2' }} />
										) : (
											<img src={'/nft-placeholder.png'} width={'100%'} height={'auto'} />
										)}
									</div>
								}
								bodyStyle={{ padding: 0 }}
								style={{ width: '30%', background: '#FFFFFF', border: '1px solid #FFFFFF' }}
							>
								<div style={{ display: 'flex', flexDirection: 'column', padding: token.padding }}>
									<ConfigProvider
										theme={{
											components: {
												Input: {
													borderRadius: 0,
													borderRadiusLG: 0,
													borderRadiusSM: 0,
													borderRadiusXS: 0,
													borderRadiusOuter: 0,
													colorBgContainer: '#FFFFFF',
													colorBorder: '#DDDDDD',
													colorText: '#0d1117',
													colorTextPlaceholder: '#0d1117',
												},
											},
										}}
									>
										<Form
											form={form}
											layout={'vertical'}
											initialValues={{ tokenAddress: '', tokenId: '' }}
											style={{ width: '100%' }}
											onValuesChange={(changedValues, values) =>
												setTokenData((_tokenData: any) => ({ ..._tokenData, ...changedValues }))
											}
										>
											<Form.Item
												name={'tokenAddress'}
												rules={[{ required: true, message: 'Enter token address' }]}
												style={{ marginBottom: token.margin }}
											>
												<Input placeholder={'Token address'} size={'large'} />
											</Form.Item>

											<Form.Item
												name={'tokenId'}
												rules={[{ required: true, message: 'Enter token id' }]}
												style={{ marginBottom: 0 }}
											>
												<Input placeholder={'Token id'} size={'large'} />
											</Form.Item>
										</Form>
									</ConfigProvider>
								</div>
							</Card>

							<Button
								type={'primary'}
								size={'large'}
								onClick={handleDunkToken}
								style={{
									height: 64,
									paddingLeft: token.padding * 6,
									paddingRight: token.padding * 6,
									marginTop: token.margin * 2,
								}}
								disabled={
									debouncedTokenData === null ||
									!debouncedTokenData?.tokenAddress?.length ||
									!debouncedTokenData?.tokenId?.length ||
									isNaN(+debouncedTokenData.tokenId)
								}
							>
								<Typography.Title
									level={2}
									style={{
										margin: 0,
										color: !(
											debouncedTokenData === null ||
											!debouncedTokenData?.tokenAddress?.length ||
											!debouncedTokenData?.tokenId?.length ||
											isNaN(+debouncedTokenData.tokenId)
										)
											? '#0d1117'
											: undefined,
									}}
								>
									{'DUNK'}
								</Typography.Title>
							</Button>
						</>
					)}
				</div>
			</Modal>
		</>
	);
}
