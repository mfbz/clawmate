'use client';

import Icon from '@ant-design/icons';
import { Button, Card, ConfigProvider, Form, Input, Modal, Spin, theme as ThemeManager, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineCodeSandbox } from 'react-icons/ai';
import { useWindowSize } from 'usehooks-ts';
import { useAccount, useContractEvent, useContractRead, useWalletClient } from 'wagmi';
import { getPublicClient, waitForTransaction } from 'wagmi/actions';
import { InjectiveConstants } from '../../constants/injective';
import { TokenChip } from '../_components/token-chip';
import { TokenUtils } from '../_utils/token-utils';
import { refetchHeader } from '../_components/application';

export default function GrabPage() {
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

	// Get grab price
	const {
		data: grabPriceData,
		isError: grabPriceIsError,
		isLoading: grabPriceIsLoading,
	} = useContractRead({
		address: InjectiveConstants.NETWORK_DATA.contracts.ClawmateManager.address as any,
		abi: [
			{
				inputs: [],
				name: 'grabPrice',
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
		functionName: 'grabPrice',
	});

	// Modal stuff
	const [modalOpen, setModalOpen] = useState(false);
	const showModal = useCallback(() => setModalOpen(true), []);
	const hideModal = useCallback(() => setModalOpen(false), []);

	// Needed data
	const [tokenData, setTokenData] = useState<{ tokenAddress: string; tokenId: bigint } | null>(null);
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

		if (tokenData) {
			fetchTokenImage(tokenData.tokenAddress, tokenData.tokenId);
		}
	}, [tokenData, onGetMetadata]);

	// Grab management
	const [grabLoading, setGrabLoading] = useState(false);

	// Get wallet client to do transactions
	const { data: walletClient } = useWalletClient();
	// Execute dunk token
	const handleGrabToken = useCallback(async () => {
		// Set loading
		setGrabLoading(true);
		// Show modal
		showModal();

		try {
			// Validate it exists
			if (!walletClient) throw new Error();

			// Execute write with simulate to validate transaction
			const { request: approveRequest } = await getPublicClient().simulateContract({
				account: walletClient.account.address,
				address: InjectiveConstants.NETWORK_DATA.contracts.ClawmateToken.address as any,
				abi: [
					{
						inputs: [
							{
								internalType: 'address',
								name: 'spender',
								type: 'address',
							},
							{
								internalType: 'uint256',
								name: 'value',
								type: 'uint256',
							},
						],
						name: 'approve',
						outputs: [
							{
								internalType: 'bool',
								name: '',
								type: 'bool',
							},
						],
						stateMutability: 'nonpayable',
						type: 'function',
					},
				],
				functionName: 'approve',
				args: [InjectiveConstants.NETWORK_DATA.contracts.ClawmateManager.address as any, grabPriceData as bigint],
			});
			// If we are here it means no error has been thrown so continue and execute the transaction
			const approveHash = await walletClient.writeContract(approveRequest);
			// Wait for transaction to be confirmed
			const approveReceipt = await waitForTransaction({ hash: approveHash });
			console.log(approveReceipt);

			// Execute write with simulate to validate transaction
			const { request: grabTokenRequest } = await getPublicClient().simulateContract({
				account: walletClient.account.address,
				address: InjectiveConstants.NETWORK_DATA.contracts.ClawmateManager.address as any,
				abi: [
					{
						inputs: [],
						name: 'grabToken',
						outputs: [],
						stateMutability: 'nonpayable',
						type: 'function',
					},
				],
				functionName: 'grabToken',
			});
			// If we are here it means no error has been thrown so continue and execute the transaction
			const grabTokenHash = await walletClient.writeContract(grabTokenRequest);
			// Wait for transaction to be confirmed
			const grabTokenReceipt = await waitForTransaction({ hash: grabTokenHash });
			console.log(grabTokenReceipt);

			// Refetch balance in the header
			await refetchHeader();

			// Get token data from logs
			const logs = await getPublicClient().getContractEvents({
				address: InjectiveConstants.NETWORK_DATA.contracts.ClawmateManager.address as any,
				abi: [
					{
						anonymous: false,
						inputs: [
							{
								indexed: false,
								internalType: 'address',
								name: '_from',
								type: 'address',
							},
							{
								indexed: false,
								internalType: 'address',
								name: '_token',
								type: 'address',
							},
							{
								indexed: false,
								internalType: 'uint256',
								name: '_id',
								type: 'uint256',
							},
							{
								indexed: false,
								internalType: 'uint256',
								name: '_price',
								type: 'uint256',
							},
						],
						name: 'TokenGrabbed',
						type: 'event',
					},
				],
				eventName: 'TokenGrabbed',
				args: {
					_from: walletClient.account.address,
				},
			});
			// Set it
			setTokenData({ tokenAddress: logs[0].args._token as any, tokenId: logs[0].args._id as any });
		} catch (error) {
			// hehe
			console.log(error);
		}

		setGrabLoading(false);
	}, [showModal, grabPriceData, walletClient]);

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
						{'Grab NFTs'}
					</Typography.Title>

					<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: 0 }}>
						{'Use your CLAW tokens'}
					</Typography.Title>

					<Typography.Title level={2} style={{ color: '#FFFFFF', marginTop: 0 }}>
						{'Grab a random NFT from the pool'}
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
							onClick={handleGrabToken}
							style={{
								height: 64,
								paddingLeft: token.padding * 4,
								paddingRight: token.padding * 4,
							}}
							disabled={isDisconnected || !grabPriceData}
						>
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<Typography.Title level={2} style={{ margin: 0, color: '#0d1117' }}>
									{'GRAB'}
								</Typography.Title>

								{grabPriceData !== null && (
									<div style={{ marginLeft: token.margin }}>
										<TokenChip symbol={'CLAW'} amount={grabPriceData as bigint} color={'#0d1117'} />
									</div>
								)}
							</div>
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
				closable={!grabLoading}
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
						backgroundImage: tokenData ? 'url(/highlight-effect.png)' : undefined,
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				>
					{grabLoading ? (
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
									<Typography.Text style={{ marginTop: 0 }}>{tokenData?.tokenAddress}</Typography.Text>

									<Typography.Text strong={true} style={{ marginTop: token.margin }}>
										{'#' + tokenData?.tokenAddress}
									</Typography.Text>
								</div>
							</Card>

							<Button
								type={'primary'}
								size={'large'}
								onClick={() => {
									// Clear everything
									hideModal();
									setTokenData(null);
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
					)}
				</div>
			</Modal>
		</>
	);
}
