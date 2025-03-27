<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import {
		getJaxaImage,
		getRandomPoint,
		isSamePoint,
		calcDistance,
		type HintItem,
		type Point
	} from '$lib';
	import HintCard from './HintCard.svelte';
	import { get } from 'svelte/store';

	let markerCount = 4;
	let points: Point[] = $state([]);
	let ansPoint: Point = $state(getRandomPoint());

	// プレイヤーの答え
	let selectedPoint: Point = $state(getRandomPoint());

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

	const WIDTH_SETTING = 480;
	const HEIGHT_SETTING = 480;

	const DELTA_LNG = 10;
	const DELTA_LAT = 10;

	// 手掛かりカードの画像を取得
	async function getHintItemImages() {
		const bbox = [
			ansPoint.lng - DELTA_LNG,
			ansPoint.lat - DELTA_LAT,
			ansPoint.lng + DELTA_LNG,
			ansPoint.lat + DELTA_LAT
		];

		const images = await Promise.all(
			hintItems.map((hintItem) => {
				const { collection, band, colors, colorMin, colorMax } = hintItem.api;
				return getJaxaImage(collection, band, bbox, WIDTH_SETTING, HEIGHT_SETTING, {
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
		resetQuiz();
	});

	/////////////////////////////////////////////////

	// 正誤処理

	let correct = $state(false);
	let quizMode: 'playing' | 'result' = $state('playing');

	let resultText = $derived(correct ? '正解' : '不正解');

	function checkAnswer() {
		quizMode = 'result';
		correct = isSamePoint(selectedPoint, ansPoint);
	}

	function resetPoints() {
		points = [ansPoint];
		for (let i = 0; i < markerCount - 1; i++) {
			points.push(getRandomPoint());
		}
	}

	async function resetQuiz() {
		quizMode = 'playing';
		correct = false;

		ansPoint = getRandomPoint();
		resetPoints();

		await getHintItemImages();
	}
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
		<div class="h-[600px] w-full">
			<MapLibre
				class="h-full"
				style="https://tile.openstreetmap.jp/styles/openmaptiles/style.json"
				zoom={0}
			>
				{#each points as point}
					<Marker
						lnglat={[point.lng, point.lat]}
						color={isSamePoint(selectedPoint, point) ? 'red' : 'grey'}
					>
						{#snippet content()}
							{#if isSamePoint(selectedPoint, point)}
								<button
									class="h-12 w-12 rounded-full bg-red-500 text-2xl text-white hover:bg-teal-600"
									onclick={() => {
										selectedPoint = point;
									}}
								>
									2
								</button>
							{:else}
								<button
									class="h-12 w-12 rounded-full bg-teal-500 text-2xl text-white hover:bg-teal-600"
									onclick={() => {
										selectedPoint = point;
									}}
								>
									1
								</button>
							{/if}
						{/snippet}</Marker
					>
				{/each}
			</MapLibre>
		</div>

		<button
			class="mt-4 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
			onclick={() => {
				checkAnswer();
			}}>答える</button
		>

		<h4>答え: ({ansPoint.lng}, {ansPoint.lat})</h4>
		<h4>選択中: ({selectedPoint.lng}, {selectedPoint.lat})</h4>
		<h4>距離: {calcDistance(ansPoint, selectedPoint)}</h4>
		{#if quizMode === 'result'}
			<div class="bg-red-500">
				{resultText}
			</div>
			<button
				onclick={() => resetQuiz()}
				class="mt-4 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">もう一回</button
			>
		{/if}
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
