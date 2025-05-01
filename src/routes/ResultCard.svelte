<script lang="ts">
	let { quizMode, correct } = $props();
</script>

{#if quizMode === 'result'}
	{#if correct}
		<div class="absolute right-0 rounded bg-green-500 p-0.5 text-center text-4xl">正解</div>
	{:else}
		<div class="absolute right-0 rounded bg-red-500 p-0.5 text-center text-4xl">不正解</div>
	{/if}
{/if}
