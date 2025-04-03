<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import {
		getJaxaImage,
		getRandomPoint,
		isSamePoint,
		calcDistance,
		initHintItems,
		markerLabels,
		type HintItem,
		type Point
	} from '$lib';
	import HintCard from './HintCard.svelte';
	import { Confetti } from 'svelte-confetti';
	import Dialog from './Dialog.svelte';

	let dialog: any = $state();

	let quizMode: 'playing' | 'result' = $state('playing');
	let correct = $state(false);

	let markerCount = $state(4);
	let points: Point[] = $state([]);
	let ansPoint: Point = $state(getRandomPoint());
	let selectedPoint: Point = $state(getRandomPoint()); // プレイヤーの答え

	let hintItems: HintItem[] = $state(initHintItems);

	const WIDTH_SETTING = 480;
	const HEIGHT_SETTING = 480;

	let deltaLng = $state(10);
	let deltaLat = $state(10);

	async function getHintItemImages() {
		const bbox = [
			ansPoint.lng - deltaLng,
			ansPoint.lat - deltaLat,
			ansPoint.lng + deltaLng,
			ansPoint.lat + deltaLat
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

	onMount(() => {
		// 初期化処理を実行
		resetQuiz();

		// キーボードイベントリスナーを追加
		window.addEventListener('keydown', handleKeyDown);

		// コンポーネントがアンマウントされたときにイベントリスナーを削除
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	function handleKeyDown(event: KeyboardEvent) {
		// Enterキーが押されたときに、quizModeがresultなら、resetQuiz()を呼び出す
		if (event.key === 'Enter' && quizMode === 'result') {
			resetQuiz();
		}
	}

	function checkAnswer() {
		quizMode = 'result';
		correct = isSamePoint(selectedPoint, ansPoint);
	}

	async function resetQuiz() {
		quizMode = 'playing';
		correct = false;

		ansPoint = getRandomPoint();
		points = [ansPoint];
		for (let i = 0; i < markerCount - 1; i++) {
			points.push(getRandomPoint());
		}
		// 最初の項目が常に正解、とならないようにシャッフル
		points = points.sort(() => Math.random() - 0.5);

		await getHintItemImages();
	}
</script>

<svelte:head>
	<title>地理S - unsharot</title>
</svelte:head>

<button
	class="absolute right-1 z-2 p-1"
	onclick={() => {
		dialog.showModal();
	}}
>
	<div class="z-2 rounded p-0.5 text-center text-2xl hover:bg-gray-400">☰</div>
</button>

<div class="relative w-full">
	<Dialog bind:dialog>
		<form method="dialog">
			<button onclick={() => {}}>
				<div class="absolute right-5 rounded p-0.5 text-center text-2xl hover:bg-gray-200">×</div>
			</button>
		</form>

		<div>
			<input type="range" min="1" max={markerLabels.length} bind:value={markerCount} />
			<label for="volume">マーカー数: {markerCount}</label>
		</div>
		<div>
			<input type="range" min="1" max="11" bind:value={deltaLng} />
			<label for="volume">経度の幅: {deltaLng}</label>
		</div>
		<div>
			<input type="range" min="1" max="11" bind:value={deltaLat} />
			<label for="volume">緯度の幅: {deltaLat}</label>
		</div>
	</Dialog>
</div>

<div class="grid h-screen place-items-center">
	<main
		id="paper-background"
		class="paper-background mx-6 my-6 flex flex-col gap-4 px-8 py-8 shadow-2xl"
	>
		<div class="flex flex-col gap-6 lg:flex-row lg:gap-12">
			<section id="left-page" class="relative w-full lg:basis-1/2">
				<div class="flex items-end gap-3">
					<h1 class="text-3xl font-bold tracking-[.5em]">地理S</h1>
					<a class="underline hover:no-underline" href="https://github.com/unsharot">unsharot</a>
					{#if quizMode === 'result'}
						{#if correct}
							<div class="absolute right-0 rounded bg-green-500 p-0.5 text-center text-4xl">
								正解
							</div>
						{:else}
							<div class="absolute right-0 rounded bg-red-500 p-0.5 text-center text-4xl">
								不正解
							</div>
						{/if}
					{/if}
				</div>

				<div class="my-6 text-base tracking-tighter">
					<span class="mr-1 font-bold tracking-[.5em]">第1問</span>
					タロウさんは、衛星データの資料のラベルを誤って他のラベルと混ぜてしまい、どのラベルが付いていたか分からなくなってしまった。資料のラベルとして最も適切なものを地図上の
					<button class="border-1 bg-white text-xl text-black">{markerLabels[0]}</button>
					~<button class="border-1 bg-white text-xl text-black"
						>{markerLabels[markerCount - 1]}</button
					>のうちから一つ選べ。(配点 100)
				</div>

				<div class="h-[90vh] w-full lg:h-[70vh]">
					<MapLibre
						class="h-full"
						style="https://tile.openstreetmap.jp/styles/openmaptiles/style.json"
						zoom={-1}
						center={[180, 0]}
					>
						{#each points as point, idx}
							<Marker lnglat={[point.lng, point.lat]}>
								{#snippet content()}
									<button
										class="h-12 w-12 border-3 text-2xl text-black hover:bg-black hover:text-white {isSamePoint(
											selectedPoint,
											point
										)
											? 'bg-teal-500'
											: 'bg-white'}"
										onclick={() => {
											selectedPoint = point;
											checkAnswer();
										}}
									>
										{markerLabels[idx]}
									</button>
								{/snippet}</Marker
							>
						{/each}
					</MapLibre>
					{#if quizMode === 'result'}
						{#if correct}
							<div class="fixed bottom-[50%] left-[50%]">
								<Confetti amount={100} x={[-2, 2]} y={[-2, 2]} />
							</div>
						{/if}
					{/if}
				</div>
			</section>

			<section id="right-page" class="relative w-full lg:basis-1/2">
				<section class="flex flex-col gap-4 rounded-lg">
					<h2 class="text-2xl font-bold tracking-[.5em]">資料</h2>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each hintItems as hint}
							<HintCard name={hint.name} imgDataURL={hint.imgDataURL} />
						{/each}
					</div>
				</section>

				<div class="absolute bottom-0 w-full p-1 text-center text-sm">
					資料は<a href="https://data.earth.jaxa.jp/ja/" class="underline hover:no-underline"
						>JAXA Earth API</a
					>を利用して作成したものです
				</div>

				{#if quizMode === 'result'}
					<button
						onclick={() => resetQuiz()}
						class="absolute right-0 bottom-0 mt-4 rounded border-1 bg-white px-4 py-2 align-middle text-black hover:bg-teal-600"
						>もう一回 (Enter)</button
					>
				{/if}
			</section>
		</div>
	</main>
</div>

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
