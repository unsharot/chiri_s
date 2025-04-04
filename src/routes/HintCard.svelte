<script lang="ts">
	let { hint } = $props();

	let open = $state(false);

	function openLightBox() {
		open = true;
	}
	function closeLightBox() {
		open = false;
	}
</script>

{#if open}
	<div class="absolute z-3 rounded shadow-gray-800">
		<button onclick={closeLightBox}>
			<img
				class="h-180 w-180 rounded-md border bg-white"
				src={hint.imgDataURL}
				alt="{hint.name}のタイル画像"
			/>
		</button>
		<div class="bg-red">
			<img src={hint.legendDataURL} alt="{hint.name}の凡例" />
		</div>
		<div class="font-bold">{hint.name} ({hint.date})</div>
	</div>
{/if}

<div class="flex flex-col items-center justify-center gap-3 rounded p-4">
	<button onclick={openLightBox}>
		<img
			class="h-36 w-36 rounded-md border bg-white"
			src={hint.imgDataURL}
			alt="{hint.name}のタイル画像"
		/>
	</button>
	<div class="font-bold">{hint.name}</div>
</div>
