<script lang="ts">
	import { getJaxaImage } from '$lib';

	let collection = $state(
		'https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json'
	);
	let band = $state('DSM');

	let west = $state(122);
	let south = $state(24);
	let east = $state(153);
	let north = $state(45);
	let bbox = $derived([west, south, east, north]);

	let width = $state(480);
	let height = $state(480);

	let colors = $state('jet');
	let colorsMin = $state(0);
	let colorsMax = $state(10000);

	let imgDataURL = $state('');
	let legendDataURL = $state('');

	$effect(() => {
		(async () => {
			const image = await getJaxaImage(collection, band, bbox, width, height, {
				colors,
				min: colorsMin,
				max: colorsMax
			});
			imgDataURL = image.getCanvas().toDataURL();
			legendDataURL = image.getLegend(720, 30, 9).toDataURL();
		})();
	});
</script>

<main class="mx-auto max-w-3xl p-8">
	<div class="flex w-full items-center justify-between gap-3">
		<h1 class="text-xl font-bold">JAXA Earth API</h1>
		<a target="_blank" href="https://data.earth.jaxa.jp/ja/" class="underline hover:no-underline"
			>詳細</a
		>
	</div>

	<div class="my-9 flex flex-col items-center justify-center gap-3">
		<img
			src={imgDataURL}
			{width}
			{height}
			class="border-4 shadow-2xl"
			alt="JAXA Earth APIから取得した画像"
		/>
		<div class="bg-red">
			<img src={legendDataURL} alt="JAXA Earth APIから取得した画像の凡例" />
		</div>
	</div>

	<div class="space-y-5">
		<div class="grid grid-cols-2 gap-1">
			<label for="collection" class="flex items-center gap-1 text-sm">
				collection
				<input
					id="collection"
					type="text"
					bind:value={collection}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="band" class="flex items-center gap-1 text-sm">
				band
				<input
					id="band"
					type="text"
					bind:value={band}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
		</div>

		<div class="grid grid-cols-4 gap-1">
			<label for="bbox-west" class="flex items-center gap-1 text-sm">
				west
				<input
					id="bbox-west"
					type="number"
					bind:value={west}
					step="0.1"
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="bbox-south" class="flex items-center gap-1 text-sm">
				south
				<input
					id="bbox-south"
					type="number"
					bind:value={south}
					step="0.1"
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="bbox-east" class="flex items-center gap-1 text-sm">
				east
				<input
					id="bbox-east"
					type="number"
					bind:value={east}
					step="0.1"
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="bbox-north" class="flex items-center gap-1 text-sm">
				north
				<input
					id="bbox-north"
					type="number"
					bind:value={north}
					step="0.1"
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
		</div>

		<div class="grid grid-cols-2 gap-1">
			<label for="width" class="flex items-center gap-1 text-sm">
				width
				<input
					id="width"
					type="number"
					bind:value={width}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="height" class="flex items-center gap-1 text-sm">
				height
				<input
					id="height"
					type="number"
					bind:value={height}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
		</div>

		<div class="grid grid-cols-3 gap-1">
			<label for="colors" class="flex items-center gap-1 text-sm">
				colors
				<input
					id="colors"
					type="text"
					bind:value={colors}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="colorsMin" class="flex items-center gap-1 text-sm">
				colorsMin
				<input
					id="colorsMin"
					type="number"
					bind:value={colorsMin}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
			<label for="colorsMax" class="flex items-center gap-1 text-sm">
				colorsMax
				<input
					id="colorsMax"
					type="number"
					bind:value={colorsMax}
					class="block w-full rounded border p-1 text-xs"
				/>
			</label>
		</div>
	</div>
</main>
