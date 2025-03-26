<script lang="ts">
	import DataTile from './DataTile.svelte';
	import { MapLibre } from 'svelte-maplibre-gl';
	import * as je from './jaxa.earth.esm.js';

	// const image = await je.getImage({
	// 	//利用するデータセットのcollection.jsonのURLを記載します。
	// 	collection:
	// 		'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json',

	// 	//利用するデータセットのバンドを指定します。
	// 	band: 'DSM',

	// 	//データを取得する緯度経度範囲を記載します。
	// 	//[最小経度(西), 最小緯度(南), 最大経度(東), 最大緯度(北)]
	// 	// bbox: [-180, -90, 180, 90],
	// 	// bbox: [11.39085, 47.27574, 17.0, 48.0],
	// 	bbox: [16.0, 47.0, 17.0, 48.0],

	// 	//データを取得する画像のサイズをピクセル数で記載します。
	// 	// width: 1000,
	// 	width: 500,
	// 	height: 500,

	// 	//可視化用のカラーマップを指定します。
	// 	colorMap: {
	// 		//最小値
	// 		min: 0,
	// 		//最大値
	// 		max: 6000,
	// 		//最小値～最大値をjet（青～緑～黄～赤の虹色）で塗りつぶします。
	// 		colors: 'jet'
	// 	}
	// });

	// これを取得したいです

	// const image = await je.getImage({
	// 	//利用するデータセットのcollection.jsonのURLを記載します。
	// 	collection:
	// 		'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json',
	// 	//利用するデータセットのバンドを指定します。
	// 	band: 'DSM',
	// 	//データを取得する緯度経度範囲を記載します。
	// 	//[最小経度(西), 最小緯度(南), 最大経度(東), 最大緯度(北)]
	// 	// bbox: [-180, -90, 180, 90],
	// 	// bbox: [11.39085, 47.27574, 17.0, 48.0],
	// 	bbox: [16.0, 47.0, 17.0, 48.0],
	// 	//データを取得する画像のサイズをピクセル数で記載します。
	// 	// width: 1000,
	// 	width: 500,
	// 	height: 500,
	// 	//可視化用のカラーマップを指定します。
	// 	colorMap: {
	// 		//最小値
	// 		min: 0,
	// 		//最大値
	// 		max: 6000,
	// 		//最小値～最大値をjet（青～緑～黄～赤の虹色）で塗りつぶします。
	// 		colors: 'jet'
	// 	}
	// });

	// ここにTypeScriptを書く
</script>

<!-- HTMLのhead要素はsvelte:headタグで書く -->
<svelte:head>
	<title>地理クイズ - unsharot</title>
</svelte:head>

<main class="mx-auto flex min-h-dvh max-w-4xl flex-col gap-4 bg-yellow-50 p-8">
	<section class="bg-yellow-50 p-1 pt-15 text-center text-5xl text-black">
		<h1>地理クイズ</h1>
	</section>

	<section class="rounded-lg px-4 py-8">
		<h2 class="text-2xl font-bold">問題</h2>
		<p>
			太郎君は衛星データのラベルを紛失してしまいました。以下の衛星データの資料から、これらのデータはどの地点でとられたものか特定してください。(配点100点)
		</p>
	</section>

	<section class="flex flex-col gap-4 rounded-lg px-4 py-8">
		<h2 class="text-2xl font-bold">資料</h2>
		<div class="grid grid-cols-3 gap-6">
			<div class="flex flex-col items-center justify-center gap-3 rounded bg-yellow-50 p-4">
				<!-- {#await je.getImage({ //利用するデータセットのcollection.jsonのURLを記載します。
					collection: 'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json', band: 'DSM', // bbox: [-180, -90, 180, 90], //[最小経度(西), 最小緯度(南), 最大経度(東), 最大緯度(北)] //利用するデータセットのバンドを指定します。 //データを取得する緯度経度範囲を記載します。
					// bbox: [11.39085, 47.27574, 17.0, 48.0],
					bbox: [16.0, 47.0, 17.0, 48.0], width: 500, height: 500, //可視化用のカラーマップを指定します。 // width: 1000, //データを取得する画像のサイズをピクセル数で記載します。
					colorMap: { //最小値
						min: 0, max: 6000, colors: 'jet' } })}
					//最大値 //最小値～最大値をjet（青～緑～黄～赤の虹色）で塗りつぶします。
					<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				{:then value}
					<div class="h-24 w-24 bg-gray-600 text-center text-white">{value}</div>
				{:catch error}
					<div class="h-24 w-24 bg-gray-600 text-center text-white">{error.message}</div>
				{/await} -->
				<div class="text-sm">情報テキスト</div>
			</div>

			<DataTile />
			<DataTile />
			<DataTile />
			<DataTile />
			<DataTile />
		</div>
	</section>

	<section class="rounded-lgp-4">
		<h2 class="text-2xl font-bold">解答</h2>
		<div class="h-96 w-full bg-gray-600">
			<MapLibre
				class="h-[400px]"
				style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
			/>
		</div>

		<button class="mt-4 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">回答する</button
		>
	</section>
</main>

<footer class="bg-sky-500 p-1 text-center text-sm text-white">
	<h1>資料はJAXA Earth APIを利用して作成したものです</h1>
</footer>
