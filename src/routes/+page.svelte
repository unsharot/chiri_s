<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import {
		getJaxaImage,
		getRandomPoint,
		isSamePoint,
		calcDistance,
		initHintItems,
		type HintItem,
		type Point
	} from '$lib';
	import HintCard from './HintCard.svelte';
	import { Confetti } from 'svelte-confetti';

	let quizMode: 'playing' | 'result' = $state('playing');
	let correct = $state(false);

	let markerCount = 4;
	let markerLabels = ['ア', 'イ', 'ウ', 'エ'];
	let points: Point[] = $state([]);
	let ansPoint: Point = $state(getRandomPoint());
	let selectedPoint: Point = $state(getRandomPoint()); // プレイヤーの答え

	let hintItems: HintItem[] = $state(initHintItems);

	const WIDTH_SETTING = 480;
	const HEIGHT_SETTING = 480;

	const DELTA_LNG = 10;
	const DELTA_LAT = 10;

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

<div class="grid h-screen place-items-center">
	<main
		id="paper-background"
		class="paper-background mx-6 my-6 flex flex-col gap-4 px-8 py-8 shadow-2xl"
	>
		<div class="flex flex-col gap-6 lg:flex-row lg:gap-12">
			<section id="left-page" class="w-full lg:basis-1/2">
				<div class="flex items-end gap-3">
					<h1 class="text-3xl font-bold tracking-[.5em]">地理S</h1>
					<a class="underline hover:no-underline" href="https://github.com/unsharot">unsharot</a>
				</div>

				<div class="my-6 text-base tracking-tighter">
					<span class="mr-1 font-bold tracking-[.5em]">第1問</span>
					タロウさんは、衛星データの資料のラベルを誤って他のラベルと混ぜてしまい、どのラベルが付いていたか分からなくなってしまった。資料のラベルとして最も適切なものを地図上の
					<button class="border-1 bg-white text-xl text-black">ア</button>
					~<button class="border-1 bg-white text-xl text-black">エ</button>のうちから一つ選べ。(配点
					100)
				</div>

				<div class="h-[30vh] w-full lg:h-[70vh]">
					<MapLibre
						class="h-full"
						style="https://tile.openstreetmap.jp/styles/openmaptiles/style.json"
						zoom={0}
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
				</div>
			</section>

			<section id="right-page" class="relative w-full lg:basis-1/2">
				<section class="flex flex-col gap-4 rounded-lg">
					<h2 class="text-2xl font-bold tracking-[.5em]">資料</h2>
					<div class="grid grid-cols-3 gap-6">
						{#each hintItems as hint}
							<HintCard name={hint.name} imgDataURL={hint.imgDataURL} />
						{/each}
					</div>
				</section>

				{#if quizMode === 'result'}
					{#if correct}
						<div class="rounded bg-green-500 text-center text-4xl">正解</div>
						<Confetti amount={100} x={[-2, 2]} y={[-2, 2]} />
					{:else}
						<div class="rounded bg-red-500 text-center text-4xl">不正解</div>{/if}
					<button
						onclick={() => resetQuiz()}
						class="absolute right-0 bottom-10 mt-4 rounded border-1 bg-white px-4 py-2 align-middle text-black hover:bg-teal-600"
						>もう一回 (Enter)</button
					>
				{/if}

				<div class="absolute bottom-0 w-full p-1 text-center text-sm">
					資料は<a href="https://data.earth.jaxa.jp/ja/" class="underline hover:no-underline"
						>JAXA Earth API</a
					>を利用して作成したものです
				</div>
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
