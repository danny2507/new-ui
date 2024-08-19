<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Modal from "$lib/components/Modal.svelte";
	import CarbonClose from "~icons/carbon/close";
	import CarbonTrashCan from "~icons/carbon/trash-can";
	import CarbonArrowUpRight from "~icons/carbon/arrow-up-right";

	import { enhance } from "$app/forms";
	import { base } from "$app/paths";

	import { useSettingsStore } from "$lib/stores/settings";
	import Switch from "$lib/components/Switch.svelte";
	import { PUBLIC_APP_DATA_SHARING } from "$env/static/public";

	let isConfirmingDeletion = false;

	const dispatch = createEventDispatcher<{ close: void }>();

	let settings = useSettingsStore();
</script>

<div class="flex w-full flex-col gap-5">
	<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Cài đặt hệ thống</h2>
	</div>

	<div class="flex h-full flex-col gap-4 pt-4 max-sm:pt-0">
		{#if PUBLIC_APP_DATA_SHARING === "1"}
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="flex items-center">
				<Switch
					name="shareConversationsWithModelAuthors"
					bind:checked={$settings.shareConversationsWithModelAuthors}
				/>
				<div class="inline cursor-pointer select-none items-center gap-2 pl-2">
					Chia sẻ cuộc trò chuyện với các nhà phát triển Chatbot
				</div>
			</label>

			<p class="text-sm text-gray-500">
				Chia sẻ dữ liệu của bạn giúp chúng tôi phát triển Chatbot tốt hơn nữa.
			</p>
		{/if}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="mt-6 flex items-center">
			<Switch name="hideEmojiOnSidebar" bind:checked={$settings.hideEmojiOnSidebar} />
			<div class="inline cursor-pointer select-none items-center gap-2 pl-2">
				Ẩn biểu tượng cảm xúc trong các chủ đề cuộc trò chuyện
			</div>
		</label>

		<div class="mt-12 flex flex-col gap-3">
			<a
				href="mailto:long.nguyencse2023@hcmut.edu.vn?subject=Phản hồi về ứng dụng HCMUT Chatbot"
				class="flex items-center underline decoration-gray-300 underline-offset-2 hover:decoration-gray-700"
			>
				<CarbonArrowUpRight class="mr-1.5 shrink-0 text-sm" /> Gửi phản hồi đến nhà phát triển
			</a>
			<button
				on:click|preventDefault={() => (isConfirmingDeletion = true)}
				type="submit"
				class="flex items-center underline decoration-gray-300 underline-offset-2 hover:decoration-gray-700"
				><CarbonTrashCan class="mr-2 inline text-sm text-red-500" />Xóa tất cả các cuộc trò chuyện</button
			>
		</div>
	</div>

	{#if isConfirmingDeletion}
		<Modal on:close={() => (isConfirmingDeletion = false)}>
			<form
				use:enhance={() => {
					dispatch("close");
				}}
				method="post"
				action="{base}/conversations?/delete"
				class="flex w-full flex-col gap-5 p-6"
			>
				<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
					<h2>Bạn chắc chưa?</h2>
					<button
						type="button"
						class="group"
						on:click|stopPropagation={() => (isConfirmingDeletion = false)}
					>
						<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
					</button>
				</div>
				<p class="text-gray-800">
					Hành động này sẽ xóa tất cả cuộc trò chuyện của bạn. Điều này không thể hoàn tác.
				</p>
				<button
					type="submit"
					class="mt-2 rounded-full bg-red-700 px-5 py-2 text-lg font-semibold text-gray-100 ring-gray-400 ring-offset-1 transition-all focus-visible:outline-none focus-visible:ring hover:ring"
				>
					Xác nhận xóa
				</button>
			</form>
		</Modal>
	{/if}
</div>
