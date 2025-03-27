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

type Point = {
	lng: number;
	lat: number;
};

function randomPoint() {
	const lng = Math.random() * 360 - 180;
	const lat = Math.random() * 170 - 85;
	return { lng, lat };
}

function calcDistance(p1: Point, p2: Point) {
	return turf.distance(turf.point([p1.lng, p1.lat]), turf.point([p2.lng, p2.lat]));
}

function samePoint(p1: Point, p2: Point) {
	if (p1.lng == p2.lng && p1.lat == p2.lat) {
		return true;
	} else {
		return false;
	}
}

export { getJaxaImage, randomPoint, calcDistance, samePoint };
export type { HintItem, Point };
