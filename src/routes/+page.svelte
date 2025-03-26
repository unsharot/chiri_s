<script lang="ts">
	import DataTile from './DataTile.svelte';
	import { MapLibre } from 'svelte-maplibre-gl';
	import { getJaxaImage } from '$lib';

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
