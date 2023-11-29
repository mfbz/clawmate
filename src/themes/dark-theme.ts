import type { ThemeConfig } from 'antd';

export const DARK_THEME: ThemeConfig = {
	token: {
		colorTextBase: '#ffffff',
		colorPrimary: '#43ffe2',
		colorBgBase: '#161D27',
		colorBgContainer: '#161D27',
		colorInfo: '#ffffff',
		borderRadius: 16,
	},
	components: {
		Button: {
			borderRadius: 16,
			primaryColor: '#0d1117',
			defaultBg: '#0d1117',
		},
		Layout: {
			headerHeight: 64,
			headerBg: '#161D27',
			headerColor: '#ffffff',
		},
		Popover: {
			colorBgElevated: '#161D27',
		},
		Input: {
			borderRadius: 8,
			borderRadiusLG: 8,
			borderRadiusSM: 8,
			borderRadiusXS: 8,
			borderRadiusOuter: 8,
		},
		Form: {
			itemMarginBottom: 16,
		},
		Tabs: {
			cardGutter: 8,
			colorBorderSecondary: '#0B0E13',
			lineWidthBold: 5,
		},
		Menu: {
			activeBarHeight: 5,
		},
		Modal: {
			zIndexPopupBase: 1031,
		},
	},
};
