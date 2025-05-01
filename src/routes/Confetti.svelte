<script lang="ts">
	import { Confetti } from 'svelte-confetti';

	let { quizMode, correct } = $props();
</script>

{#if quizMode === 'result'}
	{#if correct}
		<div class="fixed bottom-[50%] left-[50%]">
			<Confetti amount={100} x={[-2, 2]} y={[-2, 2]} />
		</div>
	{/if}
{/if}
