<script lang="ts">
	import { MapLibre, Marker } from 'svelte-maplibre-gl';
	import { isSamePoint } from '$lib';

	let { selectedPoint = $bindable(), markerLabels, points, checkAnswer } = $props();
</script>

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
			{/snippet}
		</Marker>
	{/each}
</MapLibre>
