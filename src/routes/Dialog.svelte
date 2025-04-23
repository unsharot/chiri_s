<script lang="ts">
	let {
		dialog = $bindable(),
		markerLabels,
		markerCount = $bindable(),
		deltaLng = $bindable(),
		deltaLat = $bindable()
	} = $props();
</script>

<dialog
	bind:this={dialog}
	id="menu"
	class="fixed z-3 min-h-screen w-100 rounded p-3 shadow-gray-800"
>
	<button
		class="absolute right-2 m-1 rounded p-0.5 text-center text-2xl hover:bg-gray-200"
		onclick={() => dialog.close()}
	>
		<div class="text-center text-2xl select-none">×</div>
	</button>

	<div class="m-2 select-none">
		<input
			id="marker-count"
			type="range"
			min="1"
			max={markerLabels.length}
			bind:value={markerCount}
		/>
		<label for="marker-count">マーカー数: {markerCount}</label>
	</div>
	<div class="m-2 select-none">
		<input id="delta-lng" type="range" min="1" max="11" bind:value={deltaLng} />
		<label for="delta-lng">経度の幅: {deltaLng}</label>
	</div>
	<div class="m-2 select-none">
		<input id="delta-lat" type="range" min="1" max="11" bind:value={deltaLat} />
		<label for="delta-lat">緯度の幅: {deltaLat}</label>
	</div>
</dialog>

<style lang="postcss">
	#menu {
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
