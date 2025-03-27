<script lang="ts">
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import * as turf from '@turf/turf';
  import DataTile from './DataTile.svelte';

	// 答えの座標の計算
	let ans_x = Math.random() * 360 - 180;
	let ans_y = Math.random() * 180 - 90;

	// プレイヤーの答え
	let player_x = $state(0);
	let player_y = $state(0);
</script>

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
			<DataTile />
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
				style="https://tile.openstreetmap.jp/styles/openmaptiles/style.json"
				onclick={(e) => {
					player_x = e.lngLat.lng;
					player_y = e.lngLat.lat;
				}}
			>
				<Marker lnglat={[ans_x, ans_y]}></Marker>
				<Marker color="red" lnglat={[player_x, player_y]}></Marker>
			</MapLibre>
		</div>

		<button class="mt-4 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">回答する</button
		>

		<h4>答え: ({ans_x}, {ans_y})</h4>
		<h4>選択中: ({player_x}, {player_y})</h4>
		<h4>距離: {turf.distance(turf.point([ans_x, ans_y]), turf.point([player_x, player_y]))}</h4>
	</section>
</main>

<footer class="bg-sky-500 p-1 text-center text-sm text-white">
	<h1>資料はJAXA Earth APIを利用して作成したものです</h1>
</footer>
