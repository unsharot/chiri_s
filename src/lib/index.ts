import * as je from './jaxa.earth.esm.js';
import * as turf from '@turf/turf';

// https://data.earth.jaxa.jp/api/javascript/v1.2.3/docs/global.html#ColorMapObject
type ColorMapObject = {
	min: number; // 色を塗る範囲の最小値
	max: number; // 色を塗る範囲の最大値
	colors?: string; // "gray", "jet", "ndvi", "smc", "ic", もしくは色コードの配列
	deleteMin?: boolean; // trueの場合は最小値以下を透明にする
	deleteMax?: boolean; // trueの場合は最大値以上を透明にする
	log10?: boolean; // trueの場合は対数目盛にする
	nanColor?: string; // NaNを塗る色 - 未指定時は透明
};

async function getJaxaImage(
	collection: string,
	band: string,
	bbox: number[],
	width: number,
	height: number,
	colorMap: ColorMapObject
) {
	/**
	 * JAXA Earth APIから画像を取得する
	 *
	 * 参考: https://data.earth.jaxa.jp/api/javascript/
	 *
	 * @param collection - データセットのcollection.jsonのURL
	 * @param band - データセットのバンド名
	 * @param bbox - データを取得する緯度経度範囲 - [最小経度(西), 最小緯度(南), 最大経度(東), 最大緯度(北)]
	 * @param width - データを取得する画像の幅
	 * @param height - データを取得する画像の高さ
	 * @param colorMap - 色マップの設定
	 * @returns Image
	 */

	// @ts-expect-error 引数エラーを抑制
	const image = await je.getImage({
		collection,
		band,
		bbox,
		width,
		height,
		colorMap
	});

	return image;
}

////////////////////////////////////////

type Point = {
	lng: number;
	lat: number;
};

function getRandomPoint() {
	const lng = Math.random() * 360 - 180;
	const lat = Math.random() * 170 - 85;
	return { lng, lat };
}

function calcDistance(p1: Point, p2: Point) {
	return turf.distance(turf.point([p1.lng, p1.lat]), turf.point([p2.lng, p2.lat]));
}

function isSamePoint(p1: Point, p2: Point) {
	return p1.lng == p2.lng && p1.lat == p2.lat;
}

/////////////////////////////////////////

type HintItem = {
	name: string;
	api: {
		collection: string;
		band: string;
		colors: string;
		colorMin: number;
		colorMax: number;
	};
	imgDataURL: string;
};

const initHintItems: HintItem[] = [
	{
		name: '標高(数値表層モデル)',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json',
			band: 'DSM',
			colors: 'jet',
			colorMin: 0,
			colorMax: 10000
		},
		imgDataURL: ''
	},
	{
		name: '森林非森林',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS-2.PALSAR-2_FNF.v2.1.0_global_yearly/collection.json',
			band: 'FNF',
			colors: 'ndvi',
			colorMin: 0,
			colorMax: 10000
		},
		imgDataURL: ''
	},
	{
		name: '地表面温度',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-LST.daytime.v3_global_monthly/collection.json',
			band: 'LST',
			colors: 'jet',
			colorMin: 223.1,
			colorMax: 323.1,
		},
		imgDataURL: ''
	},
	{
		name: '海面水温',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds2/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SST.daytime.v4_global_daily/collection.json',
			band: 'SST',
			colors: 'jet',
			colorMin: 0.0,
			colorMax: 40.0,
		},
		imgDataURL: ''
	},
	{
		name: '降水量',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_GSMaP_standard.Gauge.00Z-23Z.v6_monthly/collection.json',
			band: 'PRECIP',
			colors: 'jet',
			colorMin: 0.1,
			colorMax: 10.0,
		},
		imgDataURL: ''
	},
	{
		name: '植生指数',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-C.SGLI_standard.L3-NDVI.daytime.v3_global_monthly/collection.json',
			band: 'NDVI',
			colors: 'ndvi',
			colorMin: 0.0,
			colorMax: 1.0,
		},
		imgDataURL: ''
	},
	{
		name: '土壌水分量',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.G-Portal_GCOM-W.AMSR2_standard.L3-SMC.daytime.v3_global_monthly/collection.json',
			band: 'SMC',
			colors: 'jet',
			colorMin: 0.0,
			colorMax: 30.0,
		},
		imgDataURL: ''
	},
	{
		name: '海氷密接度',
		api: {
			collection:
				'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.JASMES_GCOM-W.AMSR2_ic0.v201_north_daily/collection.json',
			band: 'IC0',
			colors: 'jet',
			colorMin: 0.0,
			colorMax: 100.0,
		},
		imgDataURL: ''
	},
] as const;

/////////////////

const markerLabels = [
	'ア',
	'イ',
	'ウ',
	'エ',
	'オ',
	'カ',
	'キ',
	'ク',
	'ケ',
	'コ',
	'サ',
	'シ',
	'ス',
	'セ',
	'ソ',
	'タ',
	'チ',
	'ツ',
	'テ',
	'ト',
	'ナ',
	'ニ',
	'ヌ',
	'ネ',
	'ノ',
	'ハ',
	'ヒ',
	'フ',
	'ヘ',
	'ホ',
	'マ',
	'ミ',
	'ム',
	'メ',
	'モ',
	'ヤ',
	'ユ',
	'ヨ',
	'ラ',
	'リ',
	'ル',
	'レ',
	'ロ',
	'ワ',
	'ヲ',
	'ン'
] as const;



export { getJaxaImage, getRandomPoint, calcDistance, isSamePoint, initHintItems, markerLabels };
export type { HintItem, Point };
