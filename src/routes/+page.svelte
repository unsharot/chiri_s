<script lang="ts">
	import DataTile from './DataTile.svelte';
	import H2 from './H2.svelte';

	// ここにTypeScriptを書く
</script>

<!-- HTMLのhead要素はsvelte:headタグで書く -->
<svelte:head>
	<title>地理クイズ - unsharot</title>
</svelte:head>

<header class="bg-yellow-50 p-1 text-center text-black font-serif text-5xl pt-15">
	<h1>地理クイズ</h1>
</header>

<main class="mx-auto flex min-h-dvh max-w-4xl flex-col gap-4 bg-yellow-50 p-8">
	<section class="rounded-lg px-4 py-8 font-serif">
		<H2 text="問題" />
		<p>太郎君は衛星データのラベルを紛失してしまいました。以下の衛星データの資料から、これらのデータはどの地点でとられたものか特定してください。(配点100点)</p>
	</section>

	<section class="flex flex-col gap-4 rounded-lg  px-4 py-8 font-serif">
		<H2 text="資料" />
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
		<H2 text="解答" />
		<!-- TODO: ここに回答用の地図が入る -->
		<!-- svelte-maplibre使うとよさそう -->
		<div class="h-96 w-full bg-gray-600 text-center text-white">地図placeholder</div>

		<button class="mt-4 rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">回答する</button
		>
	</section>
</main>

<footer class="bg-sky-500 p-1 text-center text-white text-sm font-serif">
	<h1>資料はJAXA Earth APIを利用して作成したものです</h1>
</footer>
