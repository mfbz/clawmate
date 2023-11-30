import type { ThemeConfig } from 'antd';

export const DARK_THEME: ThemeConfig = {
	token: {
		colorTextBase: '#ffffff',
		colorPrimary: '#43ffe2',
		colorBgBase: '#161D27',
		colorBgContainer: '#161D27',
		colorInfo: '#ffffff',
		borderRadius: 0,
	},
	components: {
		Button: {
			borderRadius: 0,
			primaryColor: '#0d1117',
			defaultBg: '#0d1117',
			controlOutlineWidth: 0,
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
			borderRadius: 0,
			borderRadiusLG: 0,
			borderRadiusSM: 0,
			borderRadiusXS: 0,
			borderRadiusOuter: 0,
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
