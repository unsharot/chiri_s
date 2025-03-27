<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import * as turf from '@turf/turf';
	import { getJaxaImage, type HintItem } from '$lib';
	import HintCard from './HintCard.svelte';

	// 答えの座標の計算
	let ans_x = Math.random() * 360 - 180;
	let ans_y = Math.random() * 180 - 90;

	// プレイヤーの答え
	let player_x = $state(0);
	let player_y = $state(0);

	type Point = {
		lng: number;
		lat: number;
	};

	function randomPoint() {
		const lng = Math.random() * 360 - 180;
		const lat = Math.random() * 170 - 85;
		return { lng, lat };
	}

	// 偽のマーカー
	let markerCount = 4;
	let fakePoints = [];
	for (let i = 0; i < markerCount - 1; i++) {
		fakePoints.push(randomPoint());
	}

	///////////////////////////////////////////////////////

	// 手掛かりカード（JAXA Earth APIから取得した画像）

	let hintItems: HintItem[] = $state([
		{
			name: '標高',
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
			name: '森林',
			api: {
				collection:
					'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS-2.PALSAR-2_FNF.v2.1.0_global_yearly/collection.json',
				band: 'FNF',
				colors: 'ndvi',
				colorMin: 0,
				colorMax: 10000
			},
			imgDataURL: ''
		}
	]);

	const BBOX_SETTING = [122, 24, 153, 45];
	const WIDTH_SETTING = 480;
	const HEIGHT_SETTING = 480;

	// 手掛かりカードの画像を取得
	async function getHintItemImages() {
		const images = await Promise.all(
			hintItems.map((hintItem) => {
				const { collection, band, colors, colorMin, colorMax } = hintItem.api;
				return getJaxaImage(collection, band, BBOX_SETTING, WIDTH_SETTING, HEIGHT_SETTING, {
					colors,
					min: colorMin,
					max: colorMax
				});
			})
		);
		images.forEach((image, index) => {
			hintItems[index].imgDataURL = image.getCanvas().toDataURL();
		});
	}

	onMount(async () => {
		await getHintItemImages();
	});
</script>

<svelte:head>
	<title>地理クイズ - unsharot</title>
</svelte:head>

<main
	id="paper-background"
	class="paper-background mx-auto my-12 flex min-h-dvh max-w-4xl flex-col gap-4 p-8 shadow-2xl"
>
	<section class="p-1 pt-8 text-center text-5xl">
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
			{#each hintItems as hint}
				<HintCard name={hint.name} imgDataURL={hint.imgDataURL} />
			{/each}
		</div>
	</section>

	<section class="rounded-lgp-4">
		<h2 class="text-2xl font-bold">解答</h2>
		<div class="h-96 w-full">
			<MapLibre
				class="h-[400px]"
				style="https://tile.openstreetmap.jp/styles/openmaptiles/style.json"
				onclick={(e) => {
					player_x = e.lngLat.lng;
					player_y = e.lngLat.lat;
				}}
			>
				<Marker lnglat={[ans_x, ans_y]}></Marker>
				<Marker color="red" lnglat={[player_x, player_y]}></Marker>
				{#each fakePoints as point}
					<Marker lnglat={[point.lng, point.lat]}></Marker>
				{/each}
			</MapLibre>
		</div>

		<button class="mt-4 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">回答する</button
		>

		<h4>答え: ({ans_x}, {ans_y})</h4>
		<h4>選択中: ({player_x}, {player_y})</h4>
		<h4>距離: {turf.distance(turf.point([ans_x, ans_y]), turf.point([player_x, player_y]))}</h4>
	</section>
</main>

<footer class="bg-gray-500 p-1 text-center text-sm text-white">
	資料は<a href="https://data.earth.jaxa.jp/ja/" class="underline hover:no-underline"
		>JAXA Earth API</a
	>を利用して作成したものです
</footer>

<style lang="postcss">
	:global(body) {
		background-color: #aaa;
		color: #333;
	}

	#paper-background {
		background-color: #fdfdfb;
		background-image:
			repeating-linear-gradient(
				0deg,
				rgba(0, 0, 0, 0.02) 0px,
				rgba(0, 0, 0, 0.02) 1px,
				transparent 1px,
				transparent 4px
			),
			repeating-linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.01) 0px,
				rgba(0, 0, 0, 0.01) 1px,
				transparent 1px,
				transparent 4px
			);
	}
</style>
