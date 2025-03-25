<script lang="ts">
	import H2 from './H2.svelte';

	// ここにTypeScriptを書く
</script>

<!-- HTMLのhead要素はsvelte:headタグで書く -->
<svelte:head>
	<title>地理クイズ - unsharot</title>
</svelte:head>

<header class="bg-teal-500 p-4 text-center text-white">
	<h1>ヘッダー</h1>
</header>

<main class="mx-auto flex min-h-dvh max-w-4xl flex-col gap-12 bg-amber-100 p-8">
	<section class="rounded-lg bg-amber-300 px-4 py-8">
		<H2 text={'問題'} />
		<p>問題文</p>
	</section>

	<section class="flex flex-col gap-6 rounded-lg bg-amber-300 px-4 py-8">
		<H2 text={'手がかり'} />
		<div class="grid grid-cols-3 gap-6">
			<!-- ↓こういうのをコンポーネントへ切り出すといいよね -->
			<div class="flex flex-col items-center justify-center gap-3 rounded bg-teal-500 p-4">
				<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				<div class="text-sm">情報テキスト</div>
			</div>

			<div class="flex flex-col items-center justify-center gap-3 rounded bg-teal-500 p-4">
				<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				<div class="text-sm">情報テキスト</div>
			</div>

			<div class="flex flex-col items-center justify-center gap-3 rounded bg-teal-500 p-4">
				<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				<div class="text-sm">情報テキスト</div>
			</div>

			<div class="flex flex-col items-center justify-center gap-3 rounded bg-teal-500 p-4">
				<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				<div class="text-sm">情報テキスト</div>
			</div>

			<div class="flex flex-col items-center justify-center gap-3 rounded bg-teal-500 p-4">
				<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				<div class="text-sm">情報テキスト</div>
			</div>

			<div class="flex flex-col items-center justify-center gap-3 rounded bg-teal-500 p-4">
				<div class="h-24 w-24 bg-gray-600 text-center text-white">タイル画像placeholder</div>
				<div class="text-sm">情報テキスト</div>
			</div>
		</div>
	</section>

	<section class="rounded-lg bg-blue-200 p-4">
		<H2 text="回答" />
		<!-- TODO: ここに回答用の地図が入る -->
		<!-- svelte-maplibre使うとよさそう -->
		<div class="h-96 w-full bg-gray-600 text-center text-white">地図placeholder</div>

		<button class="mt-4 rounded bg-teal-500 px-4 py-2 text-white">回答する</button>
	</section>
</main>

<header class="bg-sky-500 p-4 text-center text-white">
	<h1>フッター</h1>
</header>
